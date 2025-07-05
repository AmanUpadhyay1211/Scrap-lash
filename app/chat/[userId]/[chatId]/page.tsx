"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Send, 
  User, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Sparkles,
  ArrowLeft,
  Loader2,
  CreditCard,
  Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  fetchUserChats, 
  fetchChatMessages, 
  sendMessage, 
  deleteChat,
  createNewChat 
} from "@/lib/redux/slices/chatSlice"
import { AppDispatch, RootState } from "@/lib/redux/store"
import { Message } from "@/types/Chat"
import Link from "next/link"
import { fetchUserData } from "@/lib/redux/slices/userSlice"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const dispatch = useDispatch<AppDispatch>()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { resolvedTheme } = useTheme?.() || { resolvedTheme: 'light' }

  const { chats, activeChat, loading, sendingMessage, error } = useSelector(
    (state: RootState) => state.chat
  )
  const { userData } = useSelector((state: RootState) => state.user)

  const userId = params.userId as string
  const chatId = params.chatId as string

  useEffect(() => {
    if (user && userId === user.id) {
      dispatch(fetchUserChats(user.id))
      if (chatId) {
        dispatch(fetchChatMessages(chatId))
      }
    }
  }, [user, userId, chatId, dispatch])

  useEffect(() => {
    scrollToBottom()
  }, [activeChat?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !activeChat) return

    setIsTyping(true)
    try {
      await dispatch(sendMessage({
        chatId: activeChat._id as string,
        userId: user.id,
        message: message.trim()
      })).unwrap()
      setMessage("")
      await dispatch(fetchUserData(user.id))
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewChat = async () => {
    if (!user) return
    
    try {
      const result = await dispatch(createNewChat({
        userId: user.id,
        title: `New Chat ${new Date().toLocaleDateString()}`
      })).unwrap()
      
      if (result.success && result.data) {
        router.push(`/chat/${user.id}/${result.data._id}`)
      }
    } catch (error) {
      console.error('Failed to create new chat:', error)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      await dispatch(deleteChat(chatId)).unwrap()
      if (activeChat?._id === chatId) {
        router.push(`/chat/${user?.id}`)
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (!user || userId !== user.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You can only access your own chats.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background/80 backdrop-blur"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>
      {/* Sidebar Drawer for Mobile, Static for Desktop */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : -300 }}
        className={`fixed md:relative z-40 w-72 md:w-80 h-full border-r bg-card/50 backdrop-blur transition-transform duration-300 ${sidebarOpen ? 'block' : 'hidden md:block'}`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* Close button for mobile */}
              <button
                type="button"
                className="md:hidden p-2 rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Home button always visible */}
              <Link href="/">
                <Button variant="ghost" size="icon" className="mr-1">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              {/* Single chat icon and title */}
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="hidden sm:inline">AI Chats</span>
                <span className="sm:hidden">Chats</span>
              </h2>
            </div>
            <Button onClick={handleNewChat} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {/* Credits Display */}
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Credits</span>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                  {userData?.credits || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-2">
            <AnimatePresence>
              {chats.map((chat) => (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-2"
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${activeChat?._id === chat._id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent/50'}`}
                    onClick={() => {
                      router.push(`/chat/${user.id}/${chat._id}`)
                      setSidebarOpen(false)
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(chat.updatedAt)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteChat(chat._id as string)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </motion.div>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="border-b bg-card/50 backdrop-blur p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="md:hidden"
              >
                <Home className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-base md:text-lg font-semibold truncate max-w-[60vw]">{activeChat?.title || "New Chat"}</h1>
                <p className="text-xs md:text-sm text-muted-foreground">{activeChat?.messages.length || 0} messages</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-700 text-xs md:text-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">AI Powered</span>
                <span className="sm:hidden">AI</span>
              </Badge>
            </div>
          </div>
        </div>
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading chat...</p>
              </div>
            </div>
          ) : activeChat ? (
            <ScrollArea className="h-full p-2 md:p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {activeChat.messages.map((msg: Message, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[95%] sm:max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'}`}>
                          {msg.role === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Image
                              src="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png"
                              alt="AI Bot Mascot"
                              width={24}
                              height={24}
                              className="object-contain rounded-full bg-white dark:bg-neutral-900 p-0.5"
                            />
                          )}
                        </div>
                        <div className={`rounded-lg px-3 py-2 break-words ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted dark:bg-neutral-900 text-foreground'} shadow-sm w-full`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatTime(msg.timestamp)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-end gap-2 max-w-[95%] sm:max-w-[85%] md:max-w-[70%]">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                        <Image
                          src="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png"
                          alt="AI Bot Mascot"
                          width={24}
                          height={24}
                          className="object-contain rounded-full bg-white dark:bg-neutral-900 p-0.5"
                        />
                      </div>
                      <div className="bg-muted dark:bg-neutral-900 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <Image
                    src="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png"
                    alt="AI Bot Mascot"
                    fill
                    className="object-contain rounded-full bg-white dark:bg-neutral-900 p-1 border border-neutral-200 dark:border-neutral-700"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Chat Selected</h3>
                <p className="text-muted-foreground text-sm">Select a chat from the sidebar or create a new one.</p>
              </div>
            </div>
          )}
        </div>
        {/* Message Input */}
        {activeChat && (
          <div className="border-t bg-card/50 backdrop-blur p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm md:text-base"
                disabled={sendingMessage}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendingMessage}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {sendingMessage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 