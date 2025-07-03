"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle, Globe, Mail, Phone, MapPin, Users, Calendar, ExternalLink, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ResultsDisplayProps {
  results: any
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
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
                  Found {data.length} {data.length === 1 ? "company" : "companies"}
                </p>
              </div>
            </div>
            <Button onClick={() => exportToCSV(data)} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid gap-6">
        {data.map((company: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur">
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

                    {company.emails && company.emails.length > 0 && (
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
                    )}

                    {company.address && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="w-4 h-4" />
                          Address
                        </div>
                        <p className="text-sm text-muted-foreground">{company.address}</p>
                      </div>
                    )}
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

                    {company.techStack && company.techStack.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          Tech Stack
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {company.techStack.map((tech: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {company.socialMedia && Object.keys(company.socialMedia).length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Globe className="w-4 h-4" />
                          Social Media
                        </div>
                        <div className="space-y-1">
                          {Object.entries(company.socialMedia).map(([platform, url]: [string, any], i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                {platform}
                              </Badge>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Visit
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
