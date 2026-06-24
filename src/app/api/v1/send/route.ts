import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/nodemailer"

// Rate limiting and API Key protection would go here
// Use Upstash Redis for actual rate limiting

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    // Simple placeholder for API Key validation
    if (authHeader !== `Bearer ${process.env.API_KEY_SECRET || "development-key"}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { to, subject, html, fromName, fromEmail } = body

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields: to, subject, html" }, { status: 400 })
    }

    const result = await sendEmail({ 
      to, 
      subject, 
      html, 
      fromName, 
      fromEmail,
      gmailEmail: process.env.GMAIL_EMAIL || "",
      gmailAppPassword: process.env.GMAIL_APP_PASSWORD || ""
    })
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        messageIds: result.messageIds,
        sentCount: result.sentCount
      })
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
