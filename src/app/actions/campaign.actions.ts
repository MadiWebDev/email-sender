"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email/nodemailer"
import { decrypt } from "@/lib/encryption"

export async function createCampaign(data: {
  name: string
  subject: string
  fromName: string
  templateId?: string
  htmlContent: string
  recipients: string[]
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  // Get user's Gmail credentials
  const gmailCredentials = await prisma.gmailCredentials.findUnique({
    where: { userId: session.user.id }
  })

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
    )

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

    const recipientData = data.recipients.map(email => {
      const contact = contacts.find(c => c.email === email)
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
    })

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
  } catch (error:  any ) {
    console.error("Action error:", error)
    return { success: false, error: error.message }
  }
}
