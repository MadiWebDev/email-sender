import { auth, signOut } from "@/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, Mail, Users, FileText, Settings, LogOut, Send } from "lucide-react"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex text-zinc-100 bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 glass-dark flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
            M
          </div>
          <span className="font-bold text-xl tracking-tight text-white">MailingPerson</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/send-email" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-all">
            <Send className="w-5 h-5" />
            Send Email
          </Link>
          <Link href="/campaigns" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-all">
            <Mail className="w-5 h-5" />
            Campaigns
          </Link>
          <Link href="/templates" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-all">
            <FileText className="w-5 h-5" />
            Templates
          </Link>
          <Link href="/contacts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-all">
            <Users className="w-5 h-5" />
            Audience
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-all text-sm">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <form action={async () => {
            "use server"
            await signOut()
          }}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all text-sm">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">
        {/* Mobile Header Top Bar could go here */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
