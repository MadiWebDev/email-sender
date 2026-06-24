import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT - Update a template
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, subject, htmlContent } = await req.json()

    // Verify template belongs to user
    const existing = await prisma.template.findUnique({
      where: { id }
    })

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const template = await prisma.template.update({
      where: { id },
      data: {
        name,
        subject,
        htmlContent
      }
    })

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}

// DELETE - Delete a template
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify template belongs to user
    const existing = await prisma.template.findUnique({
      where: { id }
    })

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    await prisma.template.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
  }
}
