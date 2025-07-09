"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, BarChart3, CreditCard, History } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { ScrapingForm } from "@/components/scraping-form"
import { ResultsDisplay } from "@/components/results-display"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchUserData } from "@/lib/redux/slices/userSlice"

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userData, loading } = useAppSelector((state) => state.user)
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isSignedIn, isLoaded, router])

  useEffect(() => {
    if (isSignedIn && user) {
      dispatch(fetchUserData(user.id))
    }
  }, [isSignedIn, user, dispatch])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show skeleton while Redux user data is loading
  if (loading || !userData) {
    // Dynamic import to avoid circular dependency
    const Loading = require("./loading").default;
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName || "User"}! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Ready to extract some company data? Let's get started with your next scraping project.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData?.credits || 0}</div>
              <p className="text-xs text-muted-foreground">{userData?.plan || "Free"} plan</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Scrapes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData?.successfulScrapes || 0}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData?.recentScrapes || 0}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scraping Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Start New Scraping Project
              </CardTitle>
              <CardDescription>
                Enter a company name, URL, or search query to extract comprehensive business data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrapingForm onResults={setResults} isLoading={isLoading} setIsLoading={setIsLoading} userId={user.id} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Display */}
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <ResultsDisplay results={results} />
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card
            className="border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors cursor-pointer"
            onClick={() => router.push("/analytics")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                View Analytics
              </CardTitle>
              <CardDescription>Check your scraping statistics and usage patterns</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors cursor-pointer"
            onClick={() => router.push("/contact")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Upgrade Plan
              </CardTitle>
              <CardDescription>Get more credits and unlock advanced features</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
