import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params

    if (!ObjectId.isValid(chatId)) {
      return NextResponse.json({ success: false, error: "Invalid chat ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const chats = db.collection("chats")

    const chat = await chats.findOne({ _id: new ObjectId(chatId) })

    if (!chat) {
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: chat })
  } catch (error) {
    console.error("Failed to fetch chat:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params

    if (!ObjectId.isValid(chatId)) {
      return NextResponse.json({ success: false, error: "Invalid chat ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const chats = db.collection("chats")

    const result = await chats.deleteOne({ _id: new ObjectId(chatId) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Chat deleted successfully" })
  } catch (error) {
    console.error("Failed to delete chat:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
} 