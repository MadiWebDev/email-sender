import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const { emails } = await req.json()

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "Emails array is required" }, { status: 400 })
    }

    // Filter valid emails and create contacts
    const validEmails = emails.filter((email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email.trim())
    })

    if (validEmails.length === 0) {
      return NextResponse.json({ error: "No valid email addresses found" }, { status: 400 })
    }

    // Create contacts in bulk
    const contacts = await Promise.allSettled(
      validEmails.map((email: string) =>
        prisma.contact.create({
          data: {
            email: email.trim(),
            userId: userId
          }
        })
      )
    )

    const successful = contacts.filter((c) => c.status === "fulfilled").length
    const failed = contacts.filter((c) => c.status === "rejected").length

    return NextResponse.json({ 
      success: true, 
      imported: successful,
      failed,
      message: `Successfully imported ${successful} contacts${failed > 0 ? `, ${failed} failed (duplicates)` : ""}`
    })
  } catch (error) {
    console.error("Error importing contacts:", error)
    return NextResponse.json({ error: "Failed to import contacts" }, { status: 500 })
  }
}
