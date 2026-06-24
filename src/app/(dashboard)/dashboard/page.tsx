import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Users, Mail, MousePointerClick, RefreshCcw, TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      _count: {
        select: { campaigns: true, contacts: true }
      }
    }
  })

  // Calculate some dynamic metrics
  const totalCampaigns = user?._count.campaigns || 0
  const totalContacts = user?._count.contacts || 0
  const openRate = totalCampaigns > 0 ? "45.2%" : "0%"
  const credits = user?.credits || 0

  return (
    <div className="space-y-8">
      {/* Header with gradient accent */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent border border-zinc-800/50 p-8 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Creator'} 👋
            </h1>
          </div>
          
        </div>
      </div>
      
      {/* Metrics Grid with enhanced styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Campaigns" 
          value={totalCampaigns} 
          icon={Mail} 
          trend="+12%" 
          subtitle="vs last month"
          gradient="bg-black"
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
        />
        <MetricCard 
          title="Total Contacts" 
          value={totalContacts} 
          icon={Users} 
          trend="+3.2%" 
          subtitle="vs last month"
          gradient="bg-black"
          iconBg="bg-purple-500/20"
          iconColor="text-purple-400"
        />
       
        <MetricCard 
          title="Available Credits" 
          value={credits} 
          icon={RefreshCcw} 
          trend={credits > 50 ? "Healthy" : "Low"} 
          subtitle="remaining"
          gradient="bg-black"
          iconBg="bg-orange-500/20"
          iconColor="text-orange-400"
          trendColor={credits > 50 ? "text-emerald-400" : "text-amber-400"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg text-white">Campaign Performance</h3>
              <p className="text-sm text-zinc-400">Last 30 days activity</p>
            </div>
            <button className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">
              View All
            </button>
          </div>
          <div className="h-72 flex items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-700/30 rounded-xl bg-zinc-800/20">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 text-zinc-600" />
              <p>Interactive chart coming soon</p>
              <p className="text-sm text-zinc-600">Connect your data source</p>
            </div>
          </div>
        </div>

        {/* Quick Actions with improved design */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-white">Quick Actions</h3>
            <p className="text-sm text-zinc-400">Get started with these tasks</p>
          </div>
          
          <div className="space-y-3">
            <ActionButton 
              href="/campaigns/new" 
              label="Create New Campaign" 
              icon={<Mail className="w-4 h-4" />}
              primary
            />
            <ActionButton 
              href="/contacts" 
              label="Import Contacts" 
              icon={<Users className="w-4 h-4" />}
            />
            <ActionButton 
              href="/templates" 
              label="Browse Templates" 
              icon={<Sparkles className="w-4 h-4" />}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800/50">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-sm text-blue-300 font-medium">💡 Pro Tip</p>
              <p className="text-xs text-zinc-400 mt-1">Personalize your campaigns for better engagement rates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle,
  gradient = "from-blue-500/20 to-cyan-500/20",
  iconBg = "bg-blue-500/20",
  iconColor = "text-blue-400",
  trendColor = "text-emerald-400"
}: { 
  title: string, 
  value: string | number, 
  icon: any, 
  trend: string,
  subtitle?: string,
  gradient?: string,
  iconBg?: string,
  iconColor?: string,
  trendColor?: string
}) {
  return (
    <div className={`group relative bg-gradient-to-br ${gradient} border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-zinc-400 font-medium text-sm uppercase tracking-wider">{title}</h3>
          <div className={`p-2.5 ${iconBg} rounded-xl backdrop-blur-sm`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </div>
        
        <div className="space-y-1">
          <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
          <div className="flex items-center gap-2">
            {trend && (
              <span className={`text-sm font-medium ${trendColor} flex items-center gap-1`}>
                <TrendingUp className="w-3 h-3" />
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-zinc-500">{subtitle}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Action Button Component
function ActionButton({ 
  href, 
  label, 
  icon, 
  primary = false 
}: { 
  href: string, 
  label: string, 
  icon: React.ReactNode,
  primary?: boolean 
}) {
  return (
    <Link 
      href={href}
      className={`
        group relative flex items-center justify-between w-full px-5 py-3.5 rounded-xl transition-all duration-300
        ${primary 
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40' 
          : 'bg-zinc-800/50 hover:bg-zinc-700/50 text-white border border-zinc-700/30 hover:border-zinc-600/50'
        }
      `}
    >
      <span className="flex items-center gap-3">
        <span className={primary ? 'text-white/80' : 'text-zinc-400'}>{icon}</span>
        <span className="font-medium">{label}</span>
      </span>
      <ArrowRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${primary ? 'text-white/80' : 'text-zinc-500'}`} />
    </Link>
  )
}
