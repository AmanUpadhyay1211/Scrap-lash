import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { creditsUsed } = await request.json()
    const { db } = await connectToDatabase()
    const users = db.collection("users")

    const result = await users.findOneAndUpdate(
      { userId: params.userId },
      {
        $inc: {
          credits: -creditsUsed,
          successfulScrapes: 1,
        },
        $set: {
          lastActivity: new Date().toISOString(),
        },
      },
      { returnDocument: "after", upsert: true },
    )

    return NextResponse.json(result?.value || { error: "Failed to update user credits" })
  } catch (error) {
    console.error("Failed to update user credits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
