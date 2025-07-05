export interface Message {
  role: "user" | "bot"
  content: string
  timestamp: Date
}

export interface Chat {
  _id?: string | any
  userId: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
  scrapeData?: any // Store the original scrape data for context
}

export interface ChatResponse {
  success: boolean
  data?: Chat | Chat[]
  error?: string
}

export interface CreateChatRequest {
  userId: string
  title?: string
  scrapeData?: any
}

export interface SendMessageRequest {
  chatId: string
  userId: string
  message: string
}

export interface SendMessageResponse {
  success: boolean
  data?: {
    chat: Chat
    botResponse: string
  }
  error?: string
} 