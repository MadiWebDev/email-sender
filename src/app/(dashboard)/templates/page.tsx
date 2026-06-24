"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Plus, Edit, Trash2, FileText, Eye, Save, X, 
  Loader2, Copy, Search, Filter, Sparkles, Zap,
  Layers, CheckCircle2, Globe, User
} from "lucide-react"
import { Editor } from "@/components/editor"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  name: string
  subject?: string
  htmlContent?: string
  category: string
  isPublic: boolean
  userId?: string
  createdAt: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    htmlContent: "",
    category: "General",
    isPublic: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<'all' | 'mine' | 'public'>('all')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/templates")
      const data = await res.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({ name: "", subject: "", htmlContent: "", category: "General", isPublic: false })
  }

  const handleEdit = (template: Template) => {
    setEditingId(template.id)
    setFormData({
      name: template.name,
      subject: template.subject || "",
      htmlContent: template.htmlContent || "",
      category: template.category || "General",
      isPublic: template.isPublic
    })
  }

  const handleUseTemplate = (template: Template) => {
    localStorage.setItem('selectedTemplate', JSON.stringify(template))
    router.push('/send-email')
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ name: "", subject: "", htmlContent: "", category: "General", isPublic: false })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return
    setIsSaving(true)
    try {
      const url = editingId ? `/api/templates/${editingId}` : "/api/templates"
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        await fetchTemplates()
        handleCancel()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" })
      if (res.ok) await fetchTemplates()
    } catch (error) {
      console.error(error)
    }
  }

  const categoriesList = useMemo(() => {
    const cats = new Set(templates.map(t => t.category))
    return ["All", ...Array.from(cats)]
  }, [templates])

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (t.subject?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || t.category === selectedCategory
      const matchesView = viewMode === 'all' || 
                         (viewMode === 'mine' && !t.isPublic) || 
                         (viewMode === 'public' && t.isPublic)
      return matchesSearch && matchesCategory && matchesView
    })
  }, [templates, searchQuery, selectedCategory, viewMode])

  if (isLoading) return <div className="p-8 text-center text-zinc-400">Loading templates...</div>

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Layers className="w-10 h-10 text-blue-500" />
            TEMPLATES
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">Choose from 20+ professional designs or create your own.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> NEW TEMPLATE
        </button>
      </div>

      {!isCreating && !editingId ? (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800 backdrop-blur-sm">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search by name or subject..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'mine', 'public'].map((m) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m as any)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                    viewMode === m ? "bg-white text-zinc-900 border-white" : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-600"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <select 
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map(t => (
              <div key={t.id} className="group bg-zinc-900/40 border border-zinc-800 rounded-[32px] overflow-hidden hover:border-blue-500/50 transition-all flex flex-col">
                <div className="h-48 bg-zinc-950 p-6 overflow-hidden relative border-b border-zinc-800/50">
                  <div className="scale-[0.4] origin-top-left pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity" dangerouslySetInnerHTML={{ __html: t.htmlContent || '' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-zinc-800/80 backdrop-blur-md text-zinc-300 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-zinc-700">{t.category}</span>
                    {t.isPublic && <span className="bg-blue-500/20 backdrop-blur-md text-blue-400 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-blue-500/30">PRO</span>}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors truncate">{t.name}</h3>
                  <p className="text-zinc-500 text-sm mt-1 line-clamp-1 italic">{t.subject}</p>
                  <div className="mt-auto pt-6 flex items-center justify-between">
                    <div className="flex gap-1">
                      {t.userId && <button onClick={() => handleEdit(t)} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl border border-zinc-700"><Edit className="w-4 h-4" /></button>}
                      <button onClick={() => handleDelete(t.id)} className="p-2.5 bg-zinc-800 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-xl border border-zinc-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => handleUseTemplate(t)} className="bg-white text-zinc-900 px-6 py-2.5 rounded-2xl font-black text-xs uppercase hover:scale-105 transition-transform">Use Design</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[40px] p-8 lg:p-12 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30"><Sparkles className="w-6 h-6" /></div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase">{editingId ? "Refine Design" : "New Creation"}</h2>
                <p className="text-zinc-500 text-sm font-medium">Craft your perfect message</p>
              </div>
            </div>
            <button onClick={handleCancel} className="w-10 h-10 flex items-center justify-center bg-zinc-800 text-zinc-400 rounded-full"><X className="w-6 h-6" /></button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <input type="text" placeholder="Template Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none" />
              <input type="text" placeholder="Email Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none" />
              <Editor content={formData.htmlContent} onChange={html => setFormData({...formData, htmlContent: html})} />
            </div>
            <div className="space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none">
                  {["General", "Welcome", "Newsletter", "Promotion", "Billing", "Events", "Security"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <label className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer">
                  <span className="text-xs font-bold text-zinc-300">Public Template</span>
                  <input type="checkbox" checked={formData.isPublic} onChange={e => setFormData({...formData, isPublic: e.target.checked})} className="w-5 h-5 rounded bg-zinc-800 text-blue-600" />
                </label>
              </div>
              <button onClick={handleSave} disabled={isSaving} className="bg-white text-zinc-900 w-full py-4 rounded-[20px] font-black text-sm uppercase transition-all shadow-xl">{isSaving ? "Saving..." : "Save Template"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
