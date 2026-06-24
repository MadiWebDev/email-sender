import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all contacts for the user
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contacts = await prisma.contact.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}

// POST - Create a new contact
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, firstName, lastName, tags } = await req.json()

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: {
        email,
        firstName,
        lastName,
        tags: tags || [],
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true, contact })
  } catch (error: any) {
    console.error("Error creating contact:", error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Contact with this email already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}
