"use client"

import { CampaignData } from "./wizard-container"
import { Editor } from "@/components/editor"

export function StepCompose({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: { 
  data: CampaignData, 
  updateData: (d: Partial<CampaignData>) => void, 
  onNext: () => void, 
  onPrev: () => void 
}) {

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-white">Compose Email</h2>
        <p className="text-zinc-400 mt-1">Design your subject and inner content.</p>
      </div>
      
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Subject Line</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-zinc-500"
            placeholder="A compelling subject..."
            value={data.subject}
            onChange={(e) => updateData({ subject: e.target.value })}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Email Body</label>
          <div className="flex-1 overflow-y-auto rounded-lg">
            <Editor 
              content={data.htmlContent} 
              onChange={(html) => updateData({ htmlContent: html })} 
            />
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-between pt-6 border-t border-zinc-800">
        <button
          onClick={onPrev}
          className="bg-zinc-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
        >
          Back
        </button>
        <button
          disabled={!data.subject || !data.htmlContent}
          onClick={onNext}
          className="bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalize Setup
        </button>
      </div>
    </div>
  )
}
