"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Send, 
  Bot, 
  User, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Sparkles,
  ArrowLeft,
  Loader2,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const dispatch = useDispatch<AppDispatch>()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-80 border-r bg-card/50 backdrop-blur"
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Chats
            </h2>
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
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      activeChat?._id === chat._id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => router.push(`/chat/${user.id}/${chat._id}`)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(chat.updatedAt)}
                          </p>
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">
                  {activeChat?.title || "New Chat"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {activeChat?.messages.length || 0} messages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-700">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading chat...</p>
              </div>
            </div>
          ) : activeChat ? (
            <ScrollArea className="h-full p-4">
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
                      <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        }`}>
                          {msg.role === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </p>
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
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
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
                <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Chat Selected</h3>
                <p className="text-muted-foreground">Select a chat from the sidebar or create a new one.</p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        {activeChat && (
          <div className="border-t bg-card/50 backdrop-blur p-4">
            <div className="flex items-center gap-3">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
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