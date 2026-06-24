import { WizardContainer } from "@/components/campaign-wizard/wizard-container"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function NewCampaignPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Fetch necessary data for the wizard
  // For instance, the user's previously saved templates and contacts
  const userTemplates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  // In a real scenario you would have the user DB fetched or mock templates
  
  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Create Campaign</h1>
        <p className="text-zinc-400 mt-1">Design and schedule your next bulk email blast.</p>
      </div>
      
      <div className="flex-1 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden glass shadow-2xl relative">
        <WizardContainer templates={userTemplates} userId={session.user.id} />
      </div>
    </div>
  )
}
