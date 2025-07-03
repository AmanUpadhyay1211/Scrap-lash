import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { db } = await connectToDatabase()
    const users = db.collection("users")
    const userData = await users.findOne({ userId: params.userId })

    // Generate mock analytics data
    const analytics = {
      totalScrapes: userData?.successfulScrapes || 0,
      scrapeGrowth: Math.floor(Math.random() * 50) + 10,
      successRate: Math.floor(Math.random() * 20) + 80,
      successfulScrapes: userData?.successfulScrapes || 0,
      monthlyScrapesCount: Math.floor((userData?.successfulScrapes || 0) * 0.7),
      avgResponseTime: Math.floor(Math.random() * 5) + 2,
      dataAccuracy: Math.floor(Math.random() * 10) + 90,
      uniqueCompanies: Math.floor((userData?.successfulScrapes || 0) * 0.8),
      recentActivity: [
        {
          type: "URL Scraping",
          target: "https://example.com",
          status: "success",
          timestamp: "2 hours ago",
        },
        {
          type: "Company Search",
          target: "Google Inc",
          status: "success",
          timestamp: "5 hours ago",
        },
        {
          type: "Query Search",
          target: "Tech startups",
          status: "success",
          timestamp: "1 day ago",
        },
      ],
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
