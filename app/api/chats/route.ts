import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { Chat, CreateChatRequest } from "@/types/Chat"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const chats = db.collection("chats")

    const userChats = await chats
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: userChats })
  } catch (error) {
    console.error("Failed to fetch chats:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateChatRequest = await request.json()
    const { userId, title, scrapeData } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const chats = db.collection("chats")

    // Generate a default title if not provided
    const defaultTitle = title || `Chat ${new Date().toLocaleDateString()}`

    const newChat: Chat = {
      userId,
      title: defaultTitle,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      scrapeData,
    }

    const result = await chats.insertOne(newChat)
    const createdChat = await chats.findOne({ _id: result.insertedId })

    return NextResponse.json({ success: true, data: createdChat })
  } catch (error) {
    console.error("Failed to create chat:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
} 