"use client"

import { CampaignData } from "./wizard-container"
import { LayoutTemplate, PlusCircle } from "lucide-react"

export function StepTemplates({ 
  templates, 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: { 
  templates: any[], 
  data: CampaignData, 
  updateData: (d: Partial<CampaignData>) => void, 
  onNext: () => void, 
  onPrev: () => void 
}) {
  
  const selectTemplate = (templateId?: string, htmlContent: string = "") => {
    updateData({ templateId, htmlContent })
    onNext()
  }

  // Pre-defined fallback templates if none provided
  const dummyTemplates = [
    { id: "t1", name: "Welcome Email", htmlContent: "<h1>Welcome!</h1><p>We're glad to have you.</p>" },
    { id: "t2", name: "Promo Offer", htmlContent: "<h1>50% OFF!</h1><p>Grab it now.</p>" },
    { id: "t3", name: "Newsletter", htmlContent: "<h1>Weekly Digest</h1><p>Here is what's new.</p>" }
  ]

  const displayTemplates = templates.length > 0 ? templates : dummyTemplates

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Choose a Template</h2>
        <p className="text-zinc-400 mt-1">Start from a pre-designed layout or start blank.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
          
          {/* Start from Blank Card */}
          <button 
            onClick={() => selectTemplate(undefined, "")}
            className="group flex flex-col items-center justify-center h-48 border-2 border-dashed border-zinc-700 rounded-2xl hover:border-blue-500 hover:bg-blue-500/5 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white text-zinc-400 transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="mt-4 font-medium text-zinc-300 group-hover:text-white">Start from Scratch</span>
          </button>

          {/* Template Cards */}
          {displayTemplates.map(t => (
            <button 
              key={t.id}
              onClick={() => selectTemplate(t.id, t.htmlContent)}
              className={`text-left group flex flex-col border rounded-2xl overflow-hidden transition-all shadow-lg ${data.templateId === t.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50'}`}
            >
              <div className="h-32 bg-zinc-800/50 flex items-center justify-center w-full group-hover:bg-zinc-800 transition-colors">
                <LayoutTemplate className="w-10 h-10 text-zinc-600 group-hover:text-zinc-500" />
              </div>
              <div className="p-4 bg-zinc-900 w-full flex-1">
                <h3 className="font-semibold text-white">{t.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{t.subject || t.name}</p>
              </div>
            </button>
          ))}

        </div>
      </div>

      <div className="mt-auto flex justify-between pt-6 border-t border-zinc-800">
        <button
          onClick={onPrev}
          className="bg-zinc-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
        >
          Back
        </button>
        {/* Next can be skipped since clicking a template proceeds automatically. If they just select one and want to click next: */}
        <button
          disabled={data.templateId === undefined && data.htmlContent === ""}
          onClick={onNext}
          className="bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
