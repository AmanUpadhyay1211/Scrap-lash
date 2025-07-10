import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getCompanyInfoGemini } from "@/utils/getCompanyInfoByGemini"
import { CompanyInfo } from "@/types/CompanyInfo"

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
    const scrapedData : CompanyInfo | CompanyInfo[]= await getCompanyInfoGemini(input, type)

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
