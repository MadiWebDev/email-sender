import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET - Fetch all campaigns for the user
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

// POST - Create a new campaign
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, subject, fromName, templateId, htmlContent, recipients } = await req.json()

    if (!name?.trim() || !subject?.trim() || !htmlContent?.trim()) {
      return NextResponse.json({ error: "Name, subject, and content are required" }, { status: 400 })
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients are required" }, { status: 400 })
    }

    // Import the server action
    const { createCampaign } = await import("@/app/actions/campaign.actions")

    const result = await createCampaign({
      name,
      subject,
      fromName,
      templateId,
      htmlContent,
      recipients
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
