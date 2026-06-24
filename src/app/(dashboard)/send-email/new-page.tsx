"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Send, Mail, Check, AlertCircle, Loader2, FileText, 
  Users, Clock, Sparkles, X, Search, Zap, Megaphone
} from "lucide-react"
import { Editor } from "@/components/editor"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function SendEmailPage() {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [templates, setTemplates] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    fetch("/api/templates").then(res => res.json()).then(data => setTemplates(data.templates || []))
    fetch("/api/contacts").then(res => res.json()).then(data => setContacts(data.contacts || []))
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    try {
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.split(","), subject, html: htmlContent })
      })
      const data = await res.json()
      if (data.success) setMessage({ type: "success", text: "Sent!" })
      else setMessage({ type: "error", text: data.error })
    } catch (error) {
      setMessage({ type: "error", text: "Error" })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Megaphone className="w-8 h-8 text-blue-400" /> Send Email</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <form onSubmit={handleSend} className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Recipients</label>
              <button type="button" onClick={() => setShowContactModal(true)} className="text-xs text-blue-400">+ Select from Audience</button>
            </div>
            <input type="text" value={to} onChange={e => setTo(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white" placeholder="Emails..." />
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white" placeholder="Subject..." />
            <Editor content={htmlContent} onChange={setHtmlContent} />
            <button type="submit" disabled={isSending} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">{isSending ? "Sending..." : "Send Now"}</button>
            {message && <div className={cn("p-3 rounded-xl", message.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>{message.text}</div>}
          </form>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Templates</h3>
          <div className="space-y-2">
            {templates.map(t => (
              <div key={t.id} onClick={() => {setSubject(t.subject || ""); setHtmlContent(t.htmlContent || "")}} className="p-3 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 text-sm text-zinc-300">{t.name}</div>
            ))}
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-96 max-h-96 flex flex-col">
            <h3 className="text-white font-bold mb-4">Select Contacts</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {contacts.map(c => (
                <div key={c.id} onClick={() => setTo(prev => prev ? `${prev}, ${c.email}` : c.email)} className="p-2 bg-zinc-800 rounded-lg cursor-pointer text-xs text-zinc-300 hover:text-white">{c.firstName} ({c.email})</div>
              ))}
            </div>
            <button onClick={() => setShowContactModal(false)} className="mt-4 w-full py-2 bg-zinc-800 text-white rounded-xl">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
