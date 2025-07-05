"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle, Globe, Mail, Phone, MapPin, Users, Calendar, ExternalLink, Download, Bot, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrapeRouteResponse } from "@/types/ScrapeRouteResponse"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { createNewChat, sendMessage } from "@/lib/redux/slices/chatSlice"
import { AppDispatch } from "@/lib/redux/store"

interface ResultsDisplayProps {
  results: ScrapeRouteResponse
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { user } = useUser()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleAIInsight = async (company: any) => {
    if (!user || !results.success) return
    
    try {
      const companyName = company.name || 'Unknown Company'
      const foundedInfo = company.founded ? ` founded in ${company.founded}` : ''
      const industryInfo = company.industry ? ` in the ${company.industry} industry` : ''
      
      const initialPrompt = `Give me a detailed analysis of ${companyName}${foundedInfo}${industryInfo}. Please provide insights about their business model, market position, growth potential, and any other relevant information based on the available data.`
      
      const result = await dispatch(createNewChat({
        userId: user.id,
        title: `AI Analysis - ${companyName}`,
        scrapeData: company
      })).unwrap()
      
      if (result.success && result.data) {
        // Add the initial prompt as the first message
        await dispatch(sendMessage({
          chatId: result.data._id as string,
          userId: user.id,
          message: initialPrompt
        }))
        
        router.push(`/chat/${user.id}/${result.data._id}`)
      }
    } catch (error) {
      console.error('Failed to create chat:', error)
    }
  }

  const exportToCSV = (data: any[]) => {
    const headers = ["Company Name", "Website", "Emails", "Phones", "Address", "Description"]
    const csvContent = [
      headers.join(","),
      ...data.map((company) =>
        [
          company.name,
          company.website,
          company.emails?.join("; ") || "",
          company.phones?.join("; ") || "",
          company.address || "",
          company.description || "",
        ]
          .map((field) => `"${field}"`)
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "scraped_data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!results.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Scraping Failed</h3>
                <p className="text-sm text-muted-foreground">{results.error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const { data } = results
  // Ensure data is always an array for mapping
  const companies = Array.isArray(data) ? data : [data]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-700 dark:text-green-400">Scraping Completed Successfully</h3>
                <p className="text-sm text-muted-foreground">
                  Found {companies.length} {companies.length === 1 ? "company" : "companies"}
                </p>
              </div>
            </div>
            <Button onClick={() => exportToCSV(companies)} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid gap-6">
        {companies.map((company, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur shadow-lg hover:shadow-2xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {company.name}
                      {company.website && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Globe className="w-4 h-4" />
                      {company.website}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Scraped {new Date().toLocaleDateString()}</Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Contact Information</h4>
                    {company.founder && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Users className="w-4 h-4" />
                        Founder: <span className="text-muted-foreground">{company.founder}</span>
                      </div>
                    )}
                    {company.ceo && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Users className="w-4 h-4" />
                        CEO: <span className="text-muted-foreground">{company.ceo}</span>
                      </div>
                    )}
                    {company.headquarters && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        HQ: <span className="text-muted-foreground">{company.headquarters}</span>
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Users className="w-4 h-4" />
                        Size: <span className="text-muted-foreground">{company.size}</span>
                      </div>
                    )}
                    {company.type && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Badge variant="outline">{company.type}</Badge>
                      </div>
                    )}
                    {company.industry && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Badge variant="secondary">{company.industry}</Badge>
                      </div>
                    )}
                    {company.founded && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        Founded: <span className="text-muted-foreground">{company.founded}</span>
                      </div>
                    )}
                    {/* {company.address && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        Address: <span className="text-muted-foreground">{company.address}</span>
                      </div>
                    )} */}
                    {company.linkedin && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <ExternalLink className="w-4 h-4" />
                        <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-400">LinkedIn</a>
                      </div>
                    )}
                    {/* {company.emails && company.emails.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Mail className="w-4 h-4" />
                          Email Addresses
                        </div>
                        <div className="space-y-1">
                          {company.emails.map((email: string, i: number) => (
                            <Badge key={i} variant="outline" className="mr-2">
                              {email}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {company.phones && company.phones.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Phone className="w-4 h-4" />
                          Phone Numbers
                        </div>
                        <div className="space-y-1">
                          {company.phones.map((phone: string, i: number) => (
                            <Badge key={i} variant="outline" className="mr-2">
                              {phone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>

                  {/* Company Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Company Details</h4>
                    {company.description && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Users className="w-4 h-4" />
                          Description
                        </div>
                        <p className="text-sm text-muted-foreground">{company.description}</p>
                      </div>
                    )}
                    {company.funding && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Badge variant="outline">Funding: {company.funding}</Badge>
                      </div>
                    )}
                    {company.revenue && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Badge variant="outline">Revenue: {company.revenue}</Badge>
                      </div>
                    )}
                    {company.valuation && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Badge variant="outline">Valuation: {company.valuation}</Badge>
                      </div>
                    )}
                    {company.employeeGrowth && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Badge variant="outline">Growth: {company.employeeGrowth}</Badge>
                      </div>
                    )}
                    {company.keyPeople && company.keyPeople.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Users className="w-4 h-4" />
                          Key People
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {company.keyPeople.map((person: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {company.stockSymbol && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Badge variant="outline">Stock: {company.stockSymbol}</Badge>
                      </div>
                    )}
                    {company.technologies && company.technologies.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          Technologies
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {company.technologies.map((tech: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {company.competitors && company.competitors.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Users className="w-4 h-4" />
                          Competitors
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {company.competitors.map((comp: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {company.categories && company.categories.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Badge variant="secondary">Categories</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {company.categories.map((cat: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {company.source && (
                      <div className="flex items-center gap-2 text-sm font-medium mt-2">
                        <ExternalLink className="w-4 h-4" />
                        <a href={company.source} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-400">Source</a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* AI Insight Button */}
                <div className="mt-6 pt-6 border-t">
                  <Button 
                    onClick={() => handleAIInsight(company)} 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Insight for {company.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
