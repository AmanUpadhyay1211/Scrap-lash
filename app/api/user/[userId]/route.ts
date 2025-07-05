import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { db } = await connectToDatabase()
    const users = db.collection("users")

    let userData : any = await users.findOne({ userId: params.userId })

    // Create default user data if not exists
    if (!userData) {
      const defaultUserData = {
        userId: params.userId,
        credits: 100,
        totalCredits: 100,
        successfulScrapes: 0,
        recentScrapes: 0,
        plan: "Free",
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }

      await users.insertOne(defaultUserData)
      userData = defaultUserData
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Failed to fetch user data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
