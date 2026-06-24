import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all templates for the user
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const templates = await prisma.template.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { isPublic: true }
        ]
      },
      orderBy: [
        { isPublic: "desc" },
        { createdAt: "desc" }
      ]
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

// POST - Create a new template
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, subject, htmlContent } = await req.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 })
    }

    const template = await prisma.template.create({
      data: {
        name,
        subject,
        htmlContent,
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
