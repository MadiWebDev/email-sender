import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/encryption"
import { sendEmail } from "@/lib/email/nodemailer"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, subject, html, text } = await req.json()

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json({ error: "To, subject, and content (html or text) are required" }, { status: 400 })
    }

    // Get user's Gmail credentials
    const credentials = await prisma.gmailCredentials.findUnique({
      where: { userId: session.user.id }
    })

    if (!credentials || !credentials.isActive) {
      return NextResponse.json({ error: "Gmail credentials not configured" }, { status: 400 })
    }

    // Decrypt app password
    const appPassword = decrypt(credentials.appPassword, credentials.iv || "", credentials.authTag || "")

    // Fetch recipient data for personalization if it's a single email or list
    const recipients = Array.isArray(to) ? to : [to]
    const contacts = await prisma.contact.findMany({
      where: {
        userId: session.user.id,
        email: { in: recipients }
      }
    })

    const recipientData = recipients.map(email => {
      const contact = contacts.find(c => c.email === email)
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
      html: html || text, // fallback to text if html is missing
      fromName: credentials.senderName || session.user.name || undefined,
      gmailEmail: credentials.email,
      gmailAppPassword: appPassword,
      recipientData: recipientData
    })

    // Update credits based on actual sent count
    if (emailResult.sentCount > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: emailResult.sentCount } }
      })
    }

    const updatedUser = await prisma.user.findUnique({ where: { id: session.user.id } })

    return NextResponse.json({ 
      success: emailResult.success, 
      sentCount: emailResult.sentCount,
      failedCount: emailResult.failedCount,
      remainingCredits: updatedUser?.credits
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
