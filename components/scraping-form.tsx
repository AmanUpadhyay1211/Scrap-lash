"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, Globe, Building2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch } from "@/lib/redux/hooks"
import { updateUserCredits } from "@/lib/redux/slices/userSlice"

interface ScrapingFormProps {
  onResults: (results: any) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  userId?: string
}

export function ScrapingForm({ onResults, isLoading, setIsLoading, userId }: ScrapingFormProps) {
  const [input, setInput] = useState("")
  const [inputType, setInputType] = useState("url")
  const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input.trim(),
          type: inputType,
          userId,
        }),
      })

      const data = await response.json()
      onResults(data)

      // Update user credits if scraping was successful
      if (data.success && userId) {
        dispatch(updateUserCredits({ userId, creditsUsed: 1 }))
      }
    } catch (error) {
      console.error("Scraping failed:", error)
      onResults({
        success: false,
        error: "Failed to scrape data. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPlaceholder = () => {
    switch (inputType) {
      case "url":
        return "https://www.example.com"
      case "company":
        return "Google, Microsoft, OpenAI..."
      case "query":
        return "cloud computing startups in Europe"
      default:
        return "Enter your input..."
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={inputType} onValueChange={setInputType} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            URL
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="query" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Search Query
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <div>
            <Label htmlFor="url-input">Website URL</Label>
            <Input
              id="url-input"
              type="url"
              placeholder={getPlaceholder()}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">Enter a complete URL including https://</p>
          </div>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <div>
            <Label htmlFor="company-input">Company Name</Label>
            <Input
              id="company-input"
              placeholder={getPlaceholder()}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter the company name to find and scrape their website
            </p>
          </div>
        </TabsContent>

        <TabsContent value="query" className="space-y-4">
          <div>
            <Label htmlFor="query-input">Search Query</Label>
            <Textarea
              id="query-input"
              placeholder={getPlaceholder()}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground mt-1">Describe what type of companies you're looking for</p>
          </div>
        </TabsContent>
      </Tabs>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Scraping Data...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Start Scraping
            </>
          )}
        </Button>
      </motion.div>
    </form>
  )
}
