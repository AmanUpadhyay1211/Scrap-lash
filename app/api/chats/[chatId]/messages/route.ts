import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getInfoByChatBot } from "@/utils/getCompanyInfoByGemini"

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
    const allMessages = [...chat.messages, userMsg]

    // Prepare messages for AI (only user messages + system context)
    let messagesForAI = allMessages.filter(msg => msg.role === "user")
    
    // Enhance context with company data if available
    if (chat.scrapeData && Object.keys(chat.scrapeData).length > 0) {
      // Add company context to the first user message for better AI understanding
      if (messagesForAI.length === 1) {
        const companyContext = `\n\nCompany Data Available: ${JSON.stringify(chat.scrapeData, null, 2)}\n\nPlease use this company information to provide more accurate and detailed analysis.`
        messagesForAI[0] = {
          ...messagesForAI[0],
          content: messagesForAI[0].content + companyContext
        }
      }
    }

    // Call Gemini API using the enhanced chatbot function
    let botReply: string
    try {
      botReply = await getInfoByChatBot(messagesForAI)
      
      // Validate and clean the response
      if (!botReply || botReply.trim().length === 0) {
        botReply = "I apologize, but I couldn't generate a meaningful response. Please try rephrasing your question."
      }
      
      console.log(`AI Response for chat ${chatId}:`, botReply.substring(0, 100) + "...")
    } catch (aiError) {
      console.error("AI API Error:", aiError)
      botReply = "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
    }
    
    const botMsg = { role: "bot", content: botReply, timestamp: new Date() }
    const updatedMessages = [...allMessages, botMsg]

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