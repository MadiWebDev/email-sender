import Link from "next/link"
import { Mail, Send, Users, FileText, Shield, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
              M
            </div>
            <span className="font-bold text-xl tracking-tight text-white">MailingPerson</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-zinc-300 hover:text-white transition-colors">Sign In</Link>
            <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
            <Shield className="w-4 h-4" /> Secure Gmail Integration
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Send Bulk Emails with<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Gmail App Passwords</span>
          </h1>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            The easiest way to manage and send bulk email campaigns. Configure your Gmail credentials, create templates, manage contacts, and send emails in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">Start Sending Emails<ArrowRight className="w-4 h-4" /></Link>
            <Link href="#features" className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all">Learn More</Link>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Powerful features to help you manage your email campaigns efficiently</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4"><Mail className="w-6 h-6 text-blue-400" /></div>
            <h3 className="text-lg font-semibold text-white mb-2">Gmail Integration</h3>
            <p className="text-zinc-400 text-sm">Securely connect your Gmail account using App Passwords for reliable email delivery</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4"><FileText className="w-6 h-6 text-purple-400" /></div>
            <h3 className="text-lg font-semibold text-white mb-2">Template Management</h3>
            <p className="text-zinc-400 text-sm">Create and reuse email templates with HTML support and live preview</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4"><Users className="w-6 h-6 text-green-400" /></div>
            <h3 className="text-lg font-semibold text-white mb-2">Contact Management</h3>
            <p className="text-zinc-400 text-sm">Add contacts individually or import in bulk with tags and organization</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4"><Send className="w-6 h-6 text-orange-400" /></div>
            <h3 className="text-lg font-semibold text-white mb-2">Bulk Campaigns</h3>
            <p className="text-zinc-400 text-sm">Send emails to multiple recipients at once with real-time status tracking</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Get started in just a few simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold text-blue-400">1</span></div>
            <h3 className="text-lg font-semibold text-white mb-2">Configure Gmail</h3>
            <p className="text-zinc-400 text-sm">Generate an App Password from your Google Account settings and add it in Settings</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border-2 border-purple-500/20 flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold text-purple-400">2</span></div>
            <h3 className="text-lg font-semibold text-white mb-2">Create Content</h3>
            <p className="text-zinc-400 text-sm">Build email templates and add your contacts to the audience list</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold text-green-400">3</span></div>
            <h3 className="text-lg font-semibold text-white mb-2">Send Campaigns</h3>
            <p className="text-zinc-400 text-sm">Select recipients, choose a template, and send your bulk email campaign</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Sending?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of users who trust MailingPerson for their bulk email campaigns</p>
          <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-zinc-100 transition-all">Get Started Free<ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
          <p>&copy; 2024 MailingPerson. Built with Next.js, Prisma, and Nodemailer.</p>
        </div>
      </footer>
    </div>
  )
}
