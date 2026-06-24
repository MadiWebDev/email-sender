"use client"

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Quote, Undo, Redo, Code, Variable, Sparkles, Eye, Edit2 } from 'lucide-react'

const PRESET_TEMPLATES = {
  welcome: {
    name: "Welcome Email",
    html: `<h1 style="color: #18181b; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Welcome to our community, {{firstName}}!</h1><p style="color: #3f3f46; font-size: 16px; line-height: 24px;">We're so glad to have you with us. Our platform is designed to help you succeed.</p><p style="color: #3f3f46; font-size: 16px; line-height: 24px;">To get started, check out our guide or reach out to us if you have any questions.</p><p style="color: #3f3f46; font-size: 16px; line-height: 24px;">Best regards,<br/>The Team</p>`
  },
  newsletter: {
    name: "Monthly Newsletter",
    html: `<h1 style="color: #18181b; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Monthly Update</h1><p style="color: #3f3f46; font-size: 16px; line-height: 24px;">Hello {{firstName}}, here's what's been happening this month:</p><ul style="color: #3f3f46; font-size: 16px; line-height: 24px;"><li>New feature: AI Templates</li><li>Improved security logic</li><li>Performance updates</li></ul><p style="color: #3f3f46; font-size: 16px; line-height: 24px;">Thanks for being a loyal subscriber!</p>`
  },
  promotion: {
    name: "Special Offer",
    html: `<h1 style="color: #18181b; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Special Offer for {{firstName}}!</h1><p style="color: #3f3f46; font-size: 16px; line-height: 24px;">We have a special discount just for you. Use the code <strong style="color: #2563eb;">SAVE20</strong> at checkout to get 20% off your next purchase.</p><p style="color: #3f3f46; font-size: 16px; line-height: 24px;">Don't miss out, this offer expires in 48 hours!</p>`
  }
}

interface EditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function Editor({ content, onChange, placeholder }: EditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-6 bg-zinc-900/50 border border-zinc-700 rounded-b-lg',
      },
    },
  })

  if (!editor) return null

  const addVariable = (variable: string) => {
    editor.chain().focus().insertContent(`{{${variable}}}`).run()
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-800 border border-zinc-700 border-b-0 rounded-t-lg">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isPreview ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
          title={isPreview ? "Back to Edit" : "Preview Email"}
        >
          {isPreview ? <Edit2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {isPreview ? "Edit" : "Preview"}
        </button>

        <div className="w-px h-6 bg-zinc-700 mx-2" />

        {!isPreview && (
          <>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-zinc-700 transition-colors ${editor.isActive('bold') ? 'bg-zinc-700 text-blue-400' : 'text-zinc-400'}`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-zinc-700 transition-colors ${editor.isActive('italic') ? 'bg-zinc-700 text-blue-400' : 'text-zinc-400'}`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-zinc-700 transition-colors ${editor.isActive('bulletList') ? 'bg-zinc-700 text-blue-400' : 'text-zinc-400'}`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-zinc-700 transition-colors ${editor.isActive('orderedList') ? 'bg-zinc-700 text-blue-400' : 'text-zinc-400'}`}
              title="Ordered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />
            
            <div className="relative group">
              <button
                className="flex items-center gap-1 p-2 rounded hover:bg-zinc-700 transition-colors text-zinc-400"
                title="Insert Variable"
              >
                <Variable className="w-4 h-4" />
                <span className="text-xs font-medium">Variables</span>
              </button>
              <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl min-w-[150px] p-1">
                {['firstName', 'lastName', 'email', 'company'].map((v) => (
                  <button
                    key={v}
                    onClick={() => addVariable(v)}
                    className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 rounded transition-colors"
                  >
                    {"{{"}{v}{"}}"}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button
                className="flex items-center gap-1 p-2 rounded hover:bg-zinc-700 transition-colors text-blue-400"
                title="Load Preset"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium">Presets</span>
              </button>
              <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl min-w-[180px] p-1">
                {Object.entries(PRESET_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => editor.commands.setContent(template.html)}
                    className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 rounded transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {isPreview ? (
        <div className="bg-zinc-950 p-8 rounded-b-lg border border-zinc-700 min-h-[400px] flex justify-center overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col">
            <div className="bg-zinc-50 p-8 border-b border-zinc-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-blue-500/20">
                S
              </div>
              <h1 className="text-zinc-900 text-2xl font-bold tracking-tight">SaaS Mailer</h1>
            </div>
            <div className="p-10">
              <div 
                className="text-zinc-700 text-base leading-relaxed prose prose-zinc max-w-none"
                dangerouslySetInnerHTML={{ __html: content.replace(/\{\{(.*?)\}\}/g, '<span class="bg-blue-100 text-blue-700 px-1 rounded font-medium">$1</span>') }} 
              />
            </div>
            <div className="mt-auto bg-zinc-50 p-8 border-t border-zinc-100 text-center">
              <p className="text-zinc-400 text-xs mb-4">
                You are receiving this because you are a valued contact of <strong>SaaS Mailer</strong>.
              </p>
              <div className="flex justify-center gap-6 mb-6">
                <span className="text-blue-600 text-xs underline font-medium cursor-pointer">Unsubscribe</span>
                <span className="text-blue-600 text-xs underline font-medium cursor-pointer">Privacy Policy</span>
              </div>
              <p className="text-zinc-300 text-[10px] uppercase tracking-[0.2em] font-bold">
                © 2026 SaaS Mailer. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  )
}
      <EditorContent editor={editor} />
    </div>
  )
}
