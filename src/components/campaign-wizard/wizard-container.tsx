"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StepRecipients } from "./step-recipients"
import { StepTemplates } from "./step-templates"
import { StepCompose } from "./step-compose"
import { StepSender } from "./step-sender"

export type CampaignData = {
  name: string;
  recipients: string[];
  templateId?: string;
  subject: string;
  htmlContent: string;
  fromName: string;
  fromEmail: string;
  scheduleTime?: Date;
}

export function WizardContainer({ templates, userId }: { templates: any[], userId: string }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<CampaignData>({
    name: "",
    recipients: [],
    subject: "",
    htmlContent: "<p>Hello, {{firstName}}!</p>",
    fromName: "",
    fromEmail: "",
  })

  useEffect(() => {
    fetch("/api/settings/gmail")
      .then(res => res.json())
      .then(creds => {
        if (creds.hasCredentials) {
          updateData({ 
            fromEmail: creds.email,
            fromName: creds.senderName || ""
          })
        }
      })
  }, [])

  const updateData = (partial: Partial<CampaignData>) => setData((prev) => ({ ...prev, ...partial }))
  
  const handleNext = () => setStep((s) => Math.min(s + 1, 4))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1))

  const stepTitles = ["Recipients", "Template", "Compose", "Sender & Dispatch"]

  return (
    <div className="flex flex-col h-[700px]">
      {/* Wizard Header / Progress */}
      <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex space-x-2">
          {stepTitles.map((title, idx) => (
            <div key={idx} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors duration-300 ${
                step > idx + 1 ? "bg-blue-500 text-white" : step === idx + 1 ? "bg-white text-black" : "bg-zinc-800 text-zinc-400"
              }`}>
                {idx + 1}
              </div>
              <span className={`ml-2 text-sm hidden sm:block ${step >= idx + 1 ? "text-white" : "text-zinc-500"}`}>
                {title}
              </span>
              {idx < 3 && <div className="w-8 sm:w-12 h-px bg-zinc-800 mx-2 sm:mx-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full overflow-y-auto"
          >
            {step === 1 && <StepRecipients data={data} updateData={updateData} onNext={handleNext} />}
            {step === 2 && <StepTemplates templates={templates} data={data} updateData={updateData} onNext={handleNext} onPrev={handlePrev} />}
            {step === 3 && <StepCompose data={data} updateData={updateData} onNext={handleNext} onPrev={handlePrev} />}
            {step === 4 && <StepSender data={data} updateData={updateData} onPrev={handlePrev} userId={userId} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
