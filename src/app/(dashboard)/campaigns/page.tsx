"use client"

import { useState, useEffect } from "react"
import { Plus, Mail, Send, Check, X, FileText, Users, Clock, AlertCircle } from "lucide-react"

interface Template {
  id: string
  name: string
  subject?: string
  htmlContent?: string
}

interface Contact {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

interface Campaign {
  id: string
  name: string
  subject: string
  status: string
  recipients: string[]
  createdAt: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    fromName: "",
    htmlContent: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [campaignsRes, templatesRes, contactsRes] = await Promise.all([
        fetch("/api/campaigns"),
        fetch("/api/templates"),
        fetch("/api/contacts")
      ])

      const campaignsData = await campaignsRes.json()
      const templatesData = await templatesRes.json()
      const contactsData = await contactsRes.json()

      setCampaigns(campaignsData.campaigns || [])
      setTemplates(templatesData.templates || [])
      setContacts(contactsData.contacts || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({ name: "", subject: "", fromName: "", htmlContent: "" })
    setSelectedTemplateId("")
    setSelectedContacts([])
    setSelectAll(false)
    setMessage(null)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setFormData({ name: "", subject: "", fromName: "", htmlContent: "" })
    setSelectedTemplateId("")
    setSelectedContacts([])
    setSelectAll(false)
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setFormData({
        ...formData,
        subject: template.subject || formData.subject,
        htmlContent: template.htmlContent || formData.htmlContent
      })
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    if (!selectAll) {
      setSelectedContacts(contacts.map(c => c.id))
    } else {
      setSelectedContacts([])
    }
  }

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const handleSend = async () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.htmlContent.trim()) {
      setMessage({ type: "error", text: "Please fill in all required fields" })
      return
    }

    if (selectedContacts.length === 0) {
      setMessage({ type: "error", text: "Please select at least one recipient" })
      return
    }

    setIsSending(true)
    setMessage(null)

    try {
      const recipientEmails = contacts
        .filter(c => selectedContacts.includes(c.id))
        .map(c => c.email)

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          templateId: selectedTemplateId || undefined,
          recipients: recipientEmails
        })
      })

      const data = await res.json()
      
      if (data.success) {
        setMessage({ type: "success", text: "Campaign sent successfully!" })
        await fetchData()
        handleCancel()
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send campaign" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to send campaign" })
    } finally {
      setIsSending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "SENDING":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "FAILED":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading campaigns...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-zinc-400">Create and send bulk email campaigns</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Create Campaign Form */}
      {isCreating && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Create New Campaign</h2>
            <button
              onClick={handleCancel}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Monthly Newsletter"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                From Name *
              </label>
              <input
                type="text"
                value={formData.fromName}
                onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                placeholder="e.g., Your Name"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Special Offer Inside!"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Select Template (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleTemplateChange("")}
                className={`p-4 border rounded-lg text-left transition-all ${
                  selectedTemplateId === ""
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <span className="text-white font-medium">Custom</span>
                </div>
                <p className="text-xs text-zinc-500">Write your own content</p>
              </button>

              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedTemplateId === template.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium truncate">{template.name}</span>
                  </div>
                  {template.subject && (
                    <p className="text-xs text-zinc-500 truncate">{template.subject}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Email Content */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email Content *
            </label>
            <textarea
              value={formData.htmlContent}
              onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
              placeholder="<h1>Hello!</h1><p>Your email content here...</p>"
              rows={8}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* Recipients Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-zinc-300">
                Select Recipients ({selectedContacts.length} selected)
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {selectAll ? "Deselect All" : "Select All"}
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="p-6 bg-zinc-800/50 rounded-lg text-center">
                <Users className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">No contacts available. Add contacts first.</p>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                {contacts.map((contact) => (
                  <label
                    key={contact.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-zinc-700/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleContactToggle(contact.id)}
                      className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-white text-sm">
                        {contact.firstName || contact.lastName
                          ? `${contact.firstName || ""} ${contact.lastName || ""}`
                          : contact.email}
                      </div>
                      <div className="text-zinc-500 text-xs">{contact.email}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20"
                : "bg-red-500/10 border border-red-500/20"
            }`}>
              {message.type === "success" ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {message.text}
              </span>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              disabled={isSending}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800/50 text-white rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-all"
            >
              <Send className="w-4 h-4" />
              {isSending ? "Sending..." : "Send Campaign"}
            </button>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      {campaigns.length === 0 && !isCreating ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
          <Mail className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No campaigns yet</h3>
          <p className="text-zinc-400 mb-6">Create your first email campaign to get started</p>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                    <p className="text-sm text-zinc-400 mb-2">{campaign.subject}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {campaign.recipients.length} recipients
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
