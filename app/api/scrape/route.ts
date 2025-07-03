import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Dummy scraping function - replace with actual Puppeteer implementation
async function scrapeCompanyData(input: string, type: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock data based on input type
  const mockData = {
    url: [
      {
        name: "Example Company",
        website: input,
        emails: ["contact@example.com", "info@example.com"],
        phones: ["+1-555-0123", "+1-555-0124"],
        address: "123 Business St, Tech City, TC 12345",
        description: "A leading technology company focused on innovative solutions for modern businesses.",
        techStack: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
        socialMedia: {
          linkedin: "https://linkedin.com/company/example",
          twitter: "https://twitter.com/example",
          facebook: "https://facebook.com/example",
        },
      },
    ],
    company: [
      {
        name: input,
        website: `https://www.${input.toLowerCase().replace(/\s+/g, "")}.com`,
        emails: [`contact@${input.toLowerCase().replace(/\s+/g, "")}.com`],
        phones: ["+1-555-0100"],
        address: "456 Corporate Ave, Business District, BD 67890",
        description: `${input} is a innovative company leading the industry with cutting-edge solutions.`,
        techStack: ["JavaScript", "Python", "React", "PostgreSQL"],
        socialMedia: {
          linkedin: `https://linkedin.com/company/${input.toLowerCase().replace(/\s+/g, "-")}`,
        },
      },
    ],
    query: [
      {
        name: "TechStart Inc",
        website: "https://www.techstart.com",
        emails: ["hello@techstart.com"],
        phones: ["+1-555-0200"],
        address: "789 Innovation Blvd, Startup Valley, SV 13579",
        description: "A promising startup in the cloud computing space, focusing on European markets.",
        techStack: ["Vue.js", "Go", "Kubernetes", "GCP"],
        socialMedia: {
          linkedin: "https://linkedin.com/company/techstart-inc",
        },
      },
      {
        name: "CloudEurope Solutions",
        website: "https://www.cloudeurope.eu",
        emails: ["info@cloudeurope.eu", "sales@cloudeurope.eu"],
        phones: ["+49-30-12345678"],
        address: "Unter den Linden 1, Berlin, Germany",
        description: "European cloud computing solutions provider with focus on enterprise clients.",
        techStack: ["Angular", "Java", "Spring Boot", "Azure", "Terraform"],
        socialMedia: {
          linkedin: "https://linkedin.com/company/cloudeurope",
          twitter: "https://twitter.com/cloudeurope",
        },
      },
    ],
  }

  return mockData[type as keyof typeof mockData] || mockData.url
}

async function updateUserStats(userId: string) {
  try {
    const { db } = await connectToDatabase()
    const users = db.collection("users")

    await users.updateOne(
      { userId },
      {
        $inc: {
          successfulScrapes: 1,
          credits: -1,
        },
        $set: {
          lastActivity: new Date(),
        },
      },
      { upsert: true },
    )
  } catch (error) {
    console.error("Failed to update user stats:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { input, type, userId } = await request.json()

    if (!input || !type) {
      return NextResponse.json({ success: false, error: "Missing input or type parameter" }, { status: 400 })
    }

    // Validate input based on type
    if (type === "url") {
      try {
        new URL(input)
      } catch {
        return NextResponse.json({ success: false, error: "Invalid URL format" }, { status: 400 })
      }
    }

    // Simulate scraping process
    const scrapedData = await scrapeCompanyData(input, type)

    // Update user statistics if userId is provided
    if (userId) {
      await updateUserStats(userId)
    }

    return NextResponse.json({
      success: true,
      data: scrapedData,
      timestamp: new Date().toISOString(),
      inputType: type,
      originalInput: input,
    })
  } catch (error) {
    console.error("Scraping API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: "Method not allowed" }, { status: 405 })
}
