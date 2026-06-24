"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { 
  Send, Mail, Check, AlertCircle, Loader2, FileText, 
  Users, Clock, Sparkles, Edit, Eye, X, Plus, Search, Zap, Megaphone
} from "lucide-react"
import { Editor } from "@/components/editor"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Template {
  id: string
  name: string
  subject?: string
  htmlContent?: string
  category?: string
  createdAt?: string
}

interface Contact {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

interface EmailHistory {
  id: string
  recipients: string[]
  subject: string
  sentAt: string
  status: 'sent' | 'failed' | 'pending'
}

export default function SendEmailPage() {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info", text: string } | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactSearch, setContactSearch] = useState("")

  useEffect(() => {
    fetchTemplates()
    fetchEmailHistory()
    fetchContacts()
  }, [])

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true)
    try {
      const res = await fetch("/api/templates")
      const data = await res.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  const fetchContacts = async () => {
    setIsLoadingContacts(true)
    try {
      const res = await fetch("/api/contacts")
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingContacts(false)
    }
  }

  const fetchEmailHistory = async () => {
    try {
      const res = await fetch("/api/campaigns")
      const data = await res.json()
      const history = (data.campaigns || []).map((c: any) => ({
        id: c.id,
        recipients: c.recipients || [],
        subject: c.subject,
        sentAt: c.createdAt,
        status: c.status.toLowerCase() === 'completed' ? 'sent' : 
                c.status.toLowerCase() === 'failed' ? 'failed' : 'pending',
      }))
      setEmailHistory(history)
    } catch (error) {
      console.error(error)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSubject(template.subject || "")
      setHtmlContent(template.htmlContent || "")
      setSelectedTemplate(templateId)
    }
  }

  const toggleContactSelection = (email: string) => {
    const currentEmails = to.split(',').map(e => e.trim()).filter(Boolean)
    if (currentEmails.includes(email)) {
      setTo(currentEmails.filter(e => e !== email).join(', '))
    } else {
      setTo([...currentEmails, email].join(', '))
    }
  }

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [templates, searchQuery])

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => 
      c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.firstName?.toLowerCase().includes(contactSearch.toLowerCase())
    )
  }, [contacts, contactSearch])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const recipients = to.split(',').map(e => e.trim()).filter(Boolean)
    if (recipients.length === 0) return

    setIsSending(true)
    setMessage(null)

    try {
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipients,
          cc: cc.split(',').map(e => e.trim()).filter(Boolean),
          bcc: bcc.split(',').map(e => e.trim()).filter(Boolean),
          subject,
          html: htmlContent
        })
      })

      const data = await res.json()
      if (data.success) {
        setMessage({ type: "success", text: `Sent to ${data.sentCount} recipients!` })
        setTo(""); setSubject(""); setHtmlContent(""); setCc(""); setBcc("")
        fetchEmailHistory()
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error" })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-blue-400" />
            Send Email
          </h1>
          <p className="text-zinc-400 text-sm">Compose and send professional emails with personalization</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" /> History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <form onSubmit={handleSend} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Recipients</label>
                    <button type="button" onClick={() => setShowContactModal(true)} className="text-xs text-blue-400">+ Select Contacts</button>
                  </div>
                  <input type="text" value={to} onChange={e => setTo(e.target.value)} placeholder="Emails (comma separated)" className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={cc} onChange={e => setCc(e.target.value)} placeholder="CC" className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm outline-none" />
                  <input type="text" value={bcc} onChange={e => setBcc(e.target.value)} placeholder="BCC" className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Subject</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject line" className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Content</label>
                <Editor content={htmlContent} onChange={setHtmlContent} />
              </div>

              {message && (
                <div className={cn("p-4 rounded-xl text-sm flex items-center gap-2", message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20")}>
                  {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <button type="submit" disabled={isSending || !to || !subject || !htmlContent} className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isSending ? "Sending..." : "Send Email"}
              </button>
            </form>
          </div>

          {showHistory && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Campaigns</h3>
              <div className="space-y-3">
                {emailHistory.map(h => (
                  <div key={h.id} className="p-3 bg-zinc-800/30 border border-zinc-700/50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{h.subject}</div>
                      <div className="text-xs text-zinc-500">{h.recipients.length} recipients • {format(new Date(h.sentAt), 'MMM d, yyyy')}</div>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full uppercase font-bold", h.status === 'sent' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>{h.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" /> Templates</h3>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search templates..." className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs mb-3 outline-none" />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredTemplates.map(t => (
                <div key={t.id} onClick={() => handleTemplateSelect(t.id)} className={cn("p-3 rounded-xl border cursor-pointer transition-all", selectedTemplate === t.id ? "bg-blue-500/10 border-blue-500/30" : "bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600")}>
                  <div className="text-sm font-medium text-white truncate">{t.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{t.subject}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Pro Tips</h3>
            <ul className="space-y-2 text-[11px] text-zinc-400">
              <li>• Use {"{{firstName}}"} for personalization</li>
              <li>• Keep subjects short and engaging</li>
              <li>• Test with your own email first</li>
            </ul>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Select Contacts</h3>
              <button onClick={() => setShowContactModal(false)}><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <input type="text" value={contactSearch} onChange={e => setContactSearch(e.target.value)} placeholder="Search..." className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm mb-4 outline-none" />
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredContacts.map(c => {
                const isSelected = to.split(',').map(e => e.trim()).includes(c.email)
                return (
                  <div key={c.id} onClick={() => toggleContactSelection(c.email)} className={cn("p-3 rounded-xl border cursor-pointer flex justify-between items-center", isSelected ? "bg-blue-500/10 border-blue-500/30" : "bg-zinc-800/50 border-zinc-700/50")}>
                    <div><div className="text-sm text-white">{c.firstName}</div><div className="text-xs text-zinc-500">{c.email}</div></div>
                    {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                  </div>
                )
              })}
            </div>
            <button onClick={() => setShowContactModal(false)} className="mt-6 w-full py-2 bg-blue-600 text-white rounded-xl font-medium">Done</button>
          </div>
        </div>
      )}
    </div>
  )
}
