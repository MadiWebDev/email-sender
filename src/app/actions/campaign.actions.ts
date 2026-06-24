"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email/nodemailer"
import { decrypt } from "@/lib/encryption"

// Types
interface CreateCampaignData {
  name: string
  subject: string
  fromName: string
  templateId?: string
  htmlContent: string
  recipients: string[]
}

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
  iv: string
  authTag: string
  senderName?: string | null
  isActive: boolean
}

interface EmailResult {
  success: boolean
  sentCount: number
  failedCount: number
}

export async function createCampaign(data: CreateCampaignData): Promise<{
  success: boolean
  sentCount?: number
  failedCount?: number
  error?: string
}> {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  // Get user's Gmail credentials
  const gmailCredentials = await prisma.gmailCredentials.findUnique({
    where: { userId: session.user.id }
  }) as GmailCredentials | null

  if (!gmailCredentials) {
    return { success: false, error: "Please configure your Gmail credentials in Settings first." }
  }

  if (!gmailCredentials.isActive) {
    return { success: false, error: "Your Gmail credentials are not active." }
  }

  // Deduct credits check
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true }
  })

  if (!user || user.credits < data.recipients.length) {
    return { success: false, error: "Insufficient credits to send this campaign." }
  }

  try {
    // Decrypt the app password
    const appPassword = decrypt(
      gmailCredentials.appPassword, 
      gmailCredentials.iv, 
      gmailCredentials.authTag
    ) as string

    // Create the campaign in DB
    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        subject: data.subject,
        fromName: data.fromName,
        fromEmail: gmailCredentials.email,
        status: "SENDING",
        userId: session.user.id,
        templateId: data.templateId,
        recipients: data.recipients,
      }
    })

    // Fetch recipient data for personalization
    const contacts = await prisma.contact.findMany({
      where: {
        userId: session.user.id,
        email: { in: data.recipients }
      }
    })

    // Map recipients with contact data
    const recipientData: Recipient[] = data.recipients.map((email: string): Recipient => {
      const contact = contacts.find((c: Contact) => c.email === email)
      return {
        email,
        firstName: contact?.firstName || "",
        lastName: contact?.lastName || "",
        fullName: `${contact?.firstName || ""} ${contact?.lastName || ""}`.trim() || "Subscriber"
      }
    })

    // Dispatch Emails via Nodemailer
    const emailResult = await sendEmail({
      to: data.recipients,
      subject: data.subject,
      html: data.htmlContent,
      fromName: data.fromName || gmailCredentials.senderName || session.user.name || undefined,
      gmailEmail: gmailCredentials.email,
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

    // Update campaign status based on email result
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        status: emailResult.success ? "COMPLETED" : (emailResult.sentCount > 0 ? "PARTIAL" : "FAILED")
      }
    })

    revalidatePath("/campaigns")
    
    if (emailResult.success) {
      return { success: true, sentCount: emailResult.sentCount }
    } else {
      return { 
        success: emailResult.sentCount > 0, 
        sentCount: emailResult.sentCount,
        failedCount: emailResult.failedCount,
        error: `Sent ${emailResult.sentCount} emails, failed ${emailResult.failedCount}.` 
      }
    }
  } catch (error: unknown) {
    console.error("Action error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
}