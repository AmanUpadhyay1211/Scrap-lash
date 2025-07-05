import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { config } from "@/lib/config"

async function callGeminiAPI(messages: any[]): Promise<string> {
  // Convert messages to Gemini format
  const geminiMessages = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [msg.content],
  }))

  // Call Gemini API (pseudo-code, replace with actual API call)
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + config.GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: geminiMessages }),
  })
  const data = await response.json()
  // Extract the bot's reply (adjust based on actual Gemini API response)
  return data.candidates?.[0]?.content?.parts?.[0] || "Sorry, I couldn't generate a response."
}

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params
    const { userId, message } = await request.json()

    if (!ObjectId.isValid(chatId) || !userId || !message) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const chats = db.collection("chats")
    const users = db.collection("users")

    // Fetch chat
    const chat = await chats.findOne({ _id: new ObjectId(chatId) })
    if (!chat) {
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 })
    }

    // Fetch user and check credits
    const user = await users.findOne({ userId })
    if (!user || user.credits <= 0) {
      return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 403 })
    }

    // Add user message
    const userMsg = { role: "user", content: message, timestamp: new Date() }
    const updatedMessages = [...chat.messages, userMsg]

    // Call Gemini API
    const botReply = await callGeminiAPI(updatedMessages)
    const botMsg = { role: "bot", content: botReply, timestamp: new Date() }
    updatedMessages.push(botMsg)

    // Update chat
    await chats.updateOne(
      { _id: new ObjectId(chatId) },
      {
        $set: { messages: updatedMessages, updatedAt: new Date() },
      }
    )

    // Deduct 1 credit
    await users.updateOne(
      { userId },
      { $inc: { credits: -1 } }
    )

    const updatedChat = await chats.findOne({ _id: new ObjectId(chatId) })

    return NextResponse.json({
      success: true,
      data: { chat: updatedChat, botResponse: botReply },
    })
  } catch (error) {
    console.error("Failed to send message:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
} 