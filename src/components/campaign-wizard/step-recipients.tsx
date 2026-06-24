"use client"

import { useState } from "react"
import { CampaignData } from "./wizard-container"
import { Users, X } from "lucide-react"

export function StepRecipients({ data, updateData, onNext }: { data: CampaignData, updateData: (d: Partial<CampaignData>) => void, onNext: () => void }) {
  const [inputValue, setInputValue] = useState("")
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addEmail(inputValue)
    }
  }

  const addEmail = (emailStr: string) => {
    const rawEmails = emailStr.split(/[\s,]+/)
    const validEmails = rawEmails.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    if (validEmails.length > 0) {
      updateData({ recipients: [...new Set([...data.recipients, ...validEmails])] })
      setInputValue("")
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text")
    addEmail(text)
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Campaign Setup</h2>
        <p className="text-zinc-400 mt-1">Name your campaign and add recipients.</p>
      </div>
      
      <div className="flex-1 space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Campaign Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-zinc-500"
            placeholder="e.g., Summer Newsletter 2024"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Recipients</label>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 min-h-[200px] flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all cursor-text" onClick={() => document.getElementById('email-input')?.focus()}>
            {data.recipients.map((email) => (
              <div key={email} className="flex items-center gap-2 bg-zinc-800 text-zinc-200 px-3 py-1.5 rounded-md text-sm">
                <Users className="w-3 h-3 text-zinc-400" />
                <span>{email}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    updateData({ recipients: data.recipients.filter(r => r !== email) })
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <input
              id="email-input"
              type="text"
              className="flex-1 min-w-[150px] bg-transparent outline-none text-white placeholder-zinc-500"
              placeholder="john@example.com, jane@example.com..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onBlur={() => addEmail(inputValue)}
            />
          </div>
          <div className="mt-4 text-sm text-zinc-500">
            {data.recipients.length} {data.recipients.length === 1 ? "recipient" : "recipients"} added.
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-end pt-6 border-t border-zinc-800">
        <button
          disabled={!data.name || data.recipients.length === 0}
          onClick={onNext}
          className="bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    </div>
  )
}
