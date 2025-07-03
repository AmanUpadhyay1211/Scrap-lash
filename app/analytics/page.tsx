"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Calendar, CreditCard, Target, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchUserData, fetchAnalytics } from "@/lib/redux/slices/userSlice"

export default function AnalyticsPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userData, analytics, loading } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isSignedIn, isLoaded, router])

  useEffect(() => {
    if (isSignedIn && user) {
      dispatch(fetchUserData(user.id))
      dispatch(fetchAnalytics(user.id))
    }
  }, [isSignedIn, user, dispatch])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const creditUsagePercentage = userData?.credits
    ? ((userData.totalCredits - userData.credits) / userData.totalCredits) * 100
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Track your scraping performance and usage statistics</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scrapes</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalScrapes || 0}</div>
              <p className="text-xs text-muted-foreground">+{analytics?.scrapeGrowth || 0}% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.successRate || 0}%</div>
              <p className="text-xs text-muted-foreground">{analytics?.successfulScrapes || 0} successful scrapes</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData?.credits || 0}</div>
              <p className="text-xs text-muted-foreground">of {userData?.totalCredits || 0} total credits</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.monthlyScrapesCount || 0}</div>
              <p className="text-xs text-muted-foreground">scraping requests</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Analytics */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Credit Usage */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Credit Usage
                </CardTitle>
                <CardDescription>Track your credit consumption and remaining balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Credits Used</span>
                    <span className="text-sm text-muted-foreground">
                      {(userData?.totalCredits || 0) - (userData?.credits || 0)} / {userData?.totalCredits || 0}
                    </span>
                  </div>
                  <Progress value={creditUsagePercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userData?.credits || 0}</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(userData?.totalCredits || 0) - (userData?.credits || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Used</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Plan:</span>
                  <Badge variant="secondary">{userData?.plan || "Free"}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest scraping activities and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.recentActivity?.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{activity.type}</div>
                        <div className="text-sm text-muted-foreground">{activity.target}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={activity.status === "success" ? "default" : "destructive"}>
                          {activity.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                      </div>
                    </div>
                  )) || <div className="text-center py-8 text-muted-foreground">No recent activity to display</div>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Insights
              </CardTitle>
              <CardDescription>Key metrics and trends for your scraping activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{analytics?.avgResponseTime || 0}s</div>
                  <div className="text-sm text-muted-foreground">Average Response Time</div>
                </div>

                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{analytics?.dataAccuracy || 0}%</div>
                  <div className="text-sm text-muted-foreground">Data Accuracy</div>
                </div>

                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{analytics?.uniqueCompanies || 0}</div>
                  <div className="text-sm text-muted-foreground">Unique Companies Scraped</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
