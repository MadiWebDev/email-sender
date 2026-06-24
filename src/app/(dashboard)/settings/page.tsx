"use client"

import { useState, useEffect } from "react"
import { Shield, Mail, Key, Check, AlertCircle, Save, Eye, EyeOff, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [email, setEmail] = useState("")
  const [senderName, setSenderName] = useState("")
  const [appPassword, setAppPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [hasCredentials, setHasCredentials] = useState(false)

  useEffect(() => {
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    try {
      const res = await fetch("/api/settings/gmail")
      const data = await res.json()
      if (data.hasCredentials) {
        setHasCredentials(true)
        setEmail(data.email || "")
        setSenderName(data.senderName || "")
      }
    } catch (error) {
      console.error("Failed to fetch credentials:", error)
    }
  }

  const handleTest = async () => {
    if (!email || !appPassword) {
      setMessage({ type: "error", text: "Please enter both email and app password to test." })
      return
    }

    setIsTesting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/settings/gmail/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, appPassword })
      })

      const data = await res.json()
      
      if (data.success) {
        setMessage({ type: "success", text: "Connection test successful! Your credentials are valid." })
      } else {
        setMessage({ type: "error", text: data.error || "Connection test failed." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to test connection." })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/settings/gmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, appPassword, senderName })
      })

      const data = await res.json()
      
      if (data.success) {
        setMessage({ type: "success", text: "Gmail credentials saved successfully!" })
        setHasCredentials(true)
        setAppPassword("")
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save credentials" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save credentials" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your Gmail credentials?")) {
      return
    }

    try {
      const res = await fetch("/api/settings/gmail", {
        method: "DELETE"
      })

      const data = await res.json()
      
      if (data.success) {
        setMessage({ type: "success", text: "Gmail credentials removed successfully!" })
        setHasCredentials(false)
        setEmail("")
        setAppPassword("")
      } else {
        setMessage({ type: "error", text: data.error || "Failed to remove credentials" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to remove credentials" })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-400">Manage your Gmail credentials for sending emails</p>
      </div>

      {/* Gmail Credentials Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Gmail Credentials</h2>
            <p className="text-sm text-zinc-400">Configure your Gmail account with App Password</p>
          </div>
        </div>

        {hasCredentials && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm">Gmail credentials are configured</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Default Sender Name
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              The name recipients will see in their inbox
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Gmail Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              App Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                placeholder="Enter your 16-character App Password"
                className="w-full pl-10 pr-12 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!hasCredentials}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Generate an App Password from your Google Account settings under Security - 2-Step Verification - App Passwords
            </p>
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || isSaving}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800/50 text-white rounded-lg font-medium transition-all"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Test Connection
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={isSaving || isTesting}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Credentials"}
            </button>

            {hasCredentials && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/20 rounded-lg font-medium transition-all"
              >
                Remove Credentials
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Instructions */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">How to get an App Password</h2>
            <p className="text-sm text-zinc-400">Follow these steps to generate your Gmail App Password</p>
          </div>
        </div>

        <ol className="space-y-3 text-sm text-zinc-300">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium">1</span>
            <span>Go to your Google Account settings</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium">2</span>
            <span>Navigate to Security</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium">3</span>
            <span>Enable 2-Step Verification if not already enabled</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium">4</span>
            <span>Search for "App Passwords" and click on it</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium">5</span>
            <span>Enter a name (e.g., "Email Sender") and click Generate</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium">6</span>
            <span>Copy the 16-character password and paste it above</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
