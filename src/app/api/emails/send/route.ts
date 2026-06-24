import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/encryption"
import { sendEmail } from "@/lib/email/nodemailer"

// Types
interface Contact {
  email: string
  firstName?: string | null
  lastName?: string | null
}

interface Recipient {
  email: string
  firstName: string
  lastName: string
  fullName: string
}

interface GmailCredentials {
  email: string
  appPassword: string
  iv: string | null
  authTag: string | null
  senderName?: string | null
  isActive: boolean
}

interface EmailResult {
  success: boolean
  sentCount: number
  failedCount: number
}

interface RequestBody {
  to: string | string[]
  subject: string
  html?: string
  text?: string
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, subject, html, text }: RequestBody = await req.json()

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: "To, subject, and content (html or text) are required" }, 
        { status: 400 }
      )
    }

    // Get user's Gmail credentials
    const credentials = await prisma.gmailCredentials.findUnique({
      where: { userId: session.user.id }
    }) as GmailCredentials | null

    if (!credentials || !credentials.isActive) {
      return NextResponse.json(
        { error: "Gmail credentials not configured" }, 
        { status: 400 }
      )
    }

    // Decrypt app password
    const appPassword = decrypt(
      credentials.appPassword, 
      credentials.iv || "", 
      credentials.authTag || ""
    ) as string

    // Fetch recipient data for personalization if it's a single email or list
    const recipients: string[] = Array.isArray(to) ? to : [to]
    const contacts = await prisma.contact.findMany({
      where: {
        userId: session.user.id,
        email: { in: recipients }
      }
    })

    // Map recipients with contact data
    const recipientData: Recipient[] = recipients.map((email: string): Recipient => {
      const contact = contacts.find((c: Contact) => c.email === email)
      return {
        email,
        firstName: contact?.firstName || "",
        lastName: contact?.lastName || "",
        fullName: `${contact?.firstName || ""} ${contact?.lastName || ""}`.trim() || "Subscriber"
      }
    })

    // Send email using the shared utility which handles bulk correctly
    const emailResult = await sendEmail({
      to,
      subject,
      html: (html || text) as string, // Type assertion - guaranteed to exist due to validation
      fromName: credentials.senderName || session.user.name || undefined,
      gmailEmail: credentials.email,
      gmailAppPassword: appPassword,
      recipientData: recipientData
    }) as EmailResult

    // Update credits based on actual sent count
    if (emailResult.sentCount > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: emailResult.sentCount } }
      })
    }

    const updatedUser = await prisma.user.findUnique({ 
      where: { id: session.user.id } 
    })

    return NextResponse.json({ 
      success: emailResult.success, 
      sentCount: emailResult.sentCount,
      failedCount: emailResult.failedCount,
      remainingCredits: updatedUser?.credits
    })
  } catch (error: unknown) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" }, 
      { status: 500 }
    )
  }
}