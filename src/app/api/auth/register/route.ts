import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password with proper salt rounds
    const saltRounds = 12 // Increased for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user with clean data
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    // Return success response without exposing sensitive data
    return NextResponse.json(
      { 
        success: true, 
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    
    // Handle Prisma specific errors
    if (error instanceof Error) {
      // Handle unique constraint violation
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        )
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: "Registration failed. Please try again later." },
      { status: 500 }
    )
  }
}
