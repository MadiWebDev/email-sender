"use client"

import { useState, useEffect } from "react"
import { Plus, Upload, Trash2, Users, Search, X, CheckCircle2, XCircle } from "lucide-react"

interface Contact {
  id: string
  email: string
  firstName?: string
  lastName?: string
  tags?: string[]
  isSubscribed: boolean
  createdAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    tags: ""
  })
  const [importText, setImportText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch("/api/contacts")
      
      if (!res.ok) {
        throw new Error(`Failed to fetch contacts: ${res.status}`)
      }
      
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
      setError("Failed to load contacts. Please refresh the page.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setIsImporting(false)
    setFormData({ email: "", firstName: "", lastName: "", tags: "" })
    setError(null)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setIsImporting(false)
    setFormData({ email: "", firstName: "", lastName: "", tags: "" })
    setImportText("")
    setError(null)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSave = async () => {
    const trimmedEmail = formData.email.trim()
    
    if (!trimmedEmail) {
      setError("Email is required")
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address")
      return
    }

    // Check for duplicate email
    if (contacts.some(contact => contact.email.toLowerCase() === trimmedEmail.toLowerCase())) {
      setError("A contact with this email already exists")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const tags = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean)

      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          tags
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to save contact")
      }

      if (data.success) {
        await fetchContacts()
        handleCancel()
      } else {
        throw new Error(data.error || "Failed to save contact")
      }
    } catch (error) {
      console.error("Save error:", error)
      setError(error instanceof Error ? error.message : "Failed to save contact")
    } finally {
      setIsSaving(false)
    }
  }

  const handleImport = async () => {
    const emails = importText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && validateEmail(line))

    if (emails.length === 0) {
      setError("No valid email addresses found")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to import contacts")
      }

      if (data.success) {
        await fetchContacts()
        handleCancel()
      } else {
        throw new Error(data.error || "Failed to import contacts")
      }
    } catch (error) {
      console.error("Import error:", error)
      setError(error instanceof Error ? error.message : "Failed to import contacts")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return
    }

    try {
      setError(null)
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE"
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete contact")
      }

      if (data.success) {
        await fetchContacts()
      } else {
        throw new Error(data.error || "Failed to delete contact")
      }
    } catch (error) {
      console.error("Delete error:", error)
      setError(error instanceof Error ? error.message : "Failed to delete contact")
    }
  }

  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase().trim()
    return (
      contact.email.toLowerCase().includes(query) ||
      contact.firstName?.toLowerCase().includes(query) ||
      contact.lastName?.toLowerCase().includes(query) ||
      contact.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading contacts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audience</h1>
          <p className="text-zinc-400">
            Manage your email contacts ({contacts.length} total)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsImporting(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts by name, email, or tags..."
          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Create Form */}
      {isCreating && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Add New Contact</h2>
            <button
              onClick={handleCancel}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="vip, customer, newsletter"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-all"
            >
              {isSaving ? "Saving..." : "Save Contact"}
            </button>
          </div>
        </div>
      )}

      {/* Import Form */}
      {isImporting && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Import Contacts</h2>
            <button
              onClick={handleCancel}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email Addresses (one per line)
            </label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com"
              rows={10}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-zinc-500 mt-2">
              Paste one email address per line. Only valid email addresses will be imported.
              {importText && (
                <span className="block mt-1 text-blue-400">
                  {importText.split("\n").filter(line => line.trim() && validateEmail(line.trim())).length} valid emails found
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={isSaving}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-all"
            >
              {isSaving ? "Importing..." : "Import Contacts"}
            </button>
          </div>
        </div>
      )}

      {/* Contacts List */}
      {contacts.length === 0 && !isCreating && !isImporting ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
          <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No contacts yet</h3>
          <p className="text-zinc-400 mb-6">Add contacts individually or import them in bulk</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
            <button
              onClick={() => setIsImporting(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
          </div>
        </div>
      ) : filteredContacts.length === 0 && !isCreating && !isImporting ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
          <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No matching contacts</h3>
          <p className="text-zinc-400">
            No contacts found matching "{searchQuery}"
          </p>
        </div>
      ) : (contacts.length > 0 || isCreating || isImporting) && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Tags</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {contact.firstName || contact.lastName 
                          ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
                          : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{contact.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {contact.tags?.map((tag, i) => (
                          <span
                            key={`${contact.id}-tag-${i}`}
                            className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {(!contact.tags || contact.tags.length === 0) && (
                          <span className="text-zinc-500 text-sm">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full inline-flex items-center gap-1 ${
                        contact.isSubscribed 
                          ? "bg-green-500/10 text-green-400" 
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {contact.isSubscribed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Subscribed
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Unsubscribed
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-all"
                        aria-label="Delete contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}