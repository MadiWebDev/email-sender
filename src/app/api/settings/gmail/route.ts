import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/encryption"

// GET - Check if user has Gmail credentials
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const credentials = await prisma.gmailCredentials.findUnique({
      where: { userId: session.user.id },
      select: { email: true, senderName: true, isActive: true }
    })

    return NextResponse.json({ 
      hasCredentials: !!credentials,
      email: credentials?.email,
      senderName: credentials?.senderName,
      isActive: credentials?.isActive
    })
  } catch (error) {
    console.error("Error fetching Gmail credentials:", error)
    return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 })
  }
}

// POST - Save Gmail credentials
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, appPassword, senderName } = await req.json()

    if (!email || !appPassword) {
      return NextResponse.json({ error: "Email and app password are required" }, { status: 400 })
    }

    // Encrypt the app password for security
    const { encrypted, iv, authTag } = encrypt(appPassword)

    // Upsert credentials
    try {
      await prisma.gmailCredentials.upsert({
        where: { userId: session.user.id },
        update: { 
          email, 
          senderName,
          appPassword: encrypted,
          iv,
          authTag,
          isActive: true 
        },
        create: { 
          userId: session.user.id,
          email, 
          senderName,
          appPassword: encrypted,
          iv,
          authTag,
          isActive: true 
        }
      })
    } catch (dbError: any) {
      if (dbError.message?.includes("Unknown argument `senderName`")) {
        return NextResponse.json({ 
          error: "Database schema sync issue. Please stop your development server and run: npx prisma generate" 
        }, { status: 500 })
      }
      throw dbError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving Gmail credentials:", error)
    return NextResponse.json({ error: "Failed to save credentials" }, { status: 500 })
  }
}

// DELETE - Remove Gmail credentials
export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.gmailCredentials.delete({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting Gmail credentials:", error)
    return NextResponse.json({ error: "Failed to delete credentials" }, { status: 500 })
  }
}
