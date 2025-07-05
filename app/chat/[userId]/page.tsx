"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  MessageSquare, 
  Sparkles,
  Bot,
  ArrowLeft,
  Loader2,
  CreditCard,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  fetchUserChats, 
  createNewChat,
  deleteChat
} from "@/lib/redux/slices/chatSlice"
import { AppDispatch, RootState } from "@/lib/redux/store"

export default function ChatHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const dispatch = useDispatch<AppDispatch>()
  const [isCreating, setIsCreating] = useState(false)

  const { chats, loading, error } = useSelector(
    (state: RootState) => state.chat
  )
  const { userData } = useSelector((state: RootState) => state.user)

  const userId = params.userId as string

  useEffect(() => {
    if (user && userId === user.id) {
      dispatch(fetchUserChats(user.id))
    }
  }, [user, userId, dispatch])

  const handleNewChat = async () => {
    if (!user) return
    
    setIsCreating(true)
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
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      await dispatch(deleteChat(chatId)).unwrap()
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Chat History
                </h1>
                <p className="text-muted-foreground mt-1">
                  Continue your conversations with AI insights
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Credits Display */}
              <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Credits</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                      {userData?.credits || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleNewChat} 
                disabled={isCreating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading your chats...</p>
            </div>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full flex items-center justify-center"
            >
              <Bot className="w-12 h-12 text-purple-600" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-2">No chats yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your first AI conversation to get insights about companies
            </p>
            <Button 
              onClick={handleNewChat}
              disabled={isCreating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Start Your First Chat
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {chats.map((chat, index) => (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-0 bg-card/50 backdrop-blur"
                    onClick={() => router.push(`/chat/${user.id}/${chat._id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{chat.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {chat.messages.length} messages
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteChat(chat._id as string)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Created</span>
                          <span>{formatDate(chat.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last updated</span>
                          <span>{formatTime(chat.updatedAt)}</span>
                        </div>
                      </div>

                      {chat.messages.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
} 