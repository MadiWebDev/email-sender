"use client"

import { CampaignData } from "./wizard-container"
import { SendIcon, Calendar, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { createCampaign } from "@/app/actions/campaign.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function StepSender({ 
  data, 
  updateData, 
  onPrev,
  userId
}: { 
  data: CampaignData, 
  updateData: (d: Partial<CampaignData>) => void, 
  onPrev: () => void,
  userId: string 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSend = async () => {
    setIsSubmitting(true)
    try {
      const result = await createCampaign(data)
      if (result.success) {
        toast.success("Campaign launched successfully!")
        router.push("/campaigns") // Assuming this page exists to view campaigns
      } else {
        toast.error(result.error || "Failed to send campaign")
      }
    } catch(err) {
      toast.error("Internal Error Occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Sender & Dispatch</h2>
        <p className="text-zinc-400 mt-1">Review settings and launch your campaign.</p>
      </div>
      
      <div className="flex-1 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">From Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="e.g. John from MailingPerson"
              value={data.fromName}
              onChange={(e) => updateData({ fromName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Sender Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white opacity-70 cursor-not-allowed"
              placeholder="e.g. notifications@yourdomain.com"
              value={data.fromEmail}
              readOnly
            />
            <p className="text-[10px] text-zinc-500 mt-1">Change this in Settings</p>
          </div>
        </div>

        <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-green-500 w-5 h-5" />
            Campaign Summary
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center border-b border-zinc-700/50 pb-2">
              <span className="text-zinc-400">Total Recipients</span>
              <span className="font-semibold text-white">{data.recipients.length} recipients</span>
            </li>
            <li className="flex justify-between items-center border-b border-zinc-700/50 pb-2">
              <span className="text-zinc-400">Subject</span>
              <span className="font-semibold text-white text-right break-words max-w-[200px]">{data.subject}</span>
            </li>
            <li className="flex justify-between items-center pt-1">
              <span className="text-zinc-400">Credits Deducted</span>
              <span className="font-semibold text-blue-400">{data.recipients.length} credits</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="mt-auto flex justify-between pt-6 border-t border-zinc-800">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="bg-zinc-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSend}
          disabled={isSubmitting || !data.fromName || !data.fromEmail}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Launch Campaign"}
          {!isSubmitting && <SendIcon className="w-4 h-4 ml-1" />}
        </button>
      </div>
    </div>
  )
}
