import { Loader2, MessageSquare, Bot } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChatLoading() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="w-80 border-r bg-card/50 backdrop-blur">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-2 space-y-2">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-4 h-4 rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Chat Area Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="border-b bg-card/50 backdrop-blur p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[80%] ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-48' : 'w-56'} rounded-lg`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Skeleton */}
        <div className="border-t bg-card/50 backdrop-blur p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="flex-1 h-10 rounded" />
            <Skeleton className="w-10 h-10 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
} 