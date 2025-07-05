import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Chat, Message, ChatResponse, SendMessageResponse } from "@/types/Chat"

interface ChatState {
  chats: Chat[]
  activeChat: Chat | null
  loading: boolean
  sendingMessage: boolean
  error: string | null
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  loading: false,
  sendingMessage: false,
  error: null,
}

// Async thunks
export const fetchUserChats = createAsyncThunk("chat/fetchUserChats", async (userId: string) => {
  const response = await fetch(`/api/chats?userId=${userId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch chats")
  }
  return response.json()
})

export const createNewChat = createAsyncThunk(
  "chat/createNewChat",
  async ({ userId, title, scrapeData }: { userId: string; title?: string; scrapeData?: any }) => {
    const response = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, title, scrapeData }),
    })
    if (!response.ok) {
      throw new Error("Failed to create chat")
    }
    return response.json()
  },
)

export const fetchChatMessages = createAsyncThunk("chat/fetchChatMessages", async (chatId: string) => {
  const response = await fetch(`/api/chats/${chatId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch chat messages")
  }
  return response.json()
})

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, userId, message }: { chatId: string; userId: string; message: string }) => {
    const response = await fetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, message }),
    })
    if (!response.ok) {
      throw new Error("Failed to send message")
    }
    return response.json()
  },
)

export const deleteChat = createAsyncThunk("chat/deleteChat", async (chatId: string) => {
  const response = await fetch(`/api/chats/${chatId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete chat")
  }
  return chatId
})

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload
    },
    clearActiveChat: (state) => {
      state.activeChat = null
    },
    clearChatError: (state) => {
      state.error = null
    },
    addMessageToActiveChat: (state, action) => {
      if (state.activeChat) {
        state.activeChat.messages.push(action.payload)
        state.activeChat.updatedAt = new Date()
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user chats
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.loading = false
        state.chats = action.payload.data || []
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch chats"
      })
      // Create new chat
      .addCase(createNewChat.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createNewChat.fulfilled, (state, action) => {
        state.loading = false
        const newChat = action.payload.data
        if (newChat) {
          state.chats.unshift(newChat)
          state.activeChat = newChat
        }
      })
      .addCase(createNewChat.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create chat"
      })
      // Fetch chat messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false
        state.activeChat = action.payload.data || null
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch chat messages"
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false
        const { chat } = action.payload.data || {}
        if (chat && state.activeChat && state.activeChat._id === chat._id) {
          state.activeChat = chat
        }
        // Update chat in chats list
        const chatIndex = state.chats.findIndex((c) => c._id === chat._id)
        if (chatIndex !== -1) {
          state.chats[chatIndex] = chat
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false
        state.error = action.error.message || "Failed to send message"
      })
      // Delete chat
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter((chat) => chat._id !== action.payload)
        if (state.activeChat && state.activeChat._id === action.payload) {
          state.activeChat = null
        }
      })
  },
})

export const { setActiveChat, clearActiveChat, clearChatError, addMessageToActiveChat } = chatSlice.actions
export default chatSlice.reducer 