import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, appPassword } = await req.json()

    if (!email || !appPassword) {
      return NextResponse.json({ error: "Email and app password are required" }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: appPassword,
      },
    })

    try {
      await transporter.verify()
      return NextResponse.json({ success: true, message: "Connection successful!" })
    } catch (error: any) {
      console.error("SMTP Verify error:", error)
      return NextResponse.json({ 
        success: false, 
        error: error.message || "Failed to connect to Gmail. Please check your email and app password." 
      })
    }
  } catch (error) {
    console.error("Error testing Gmail credentials:", error)
    return NextResponse.json({ error: "Failed to test credentials" }, { status: 500 })
  }
}
