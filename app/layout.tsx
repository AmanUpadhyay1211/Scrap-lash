import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { ReduxProvider } from "@/lib/redux/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WebScraper Pro - AI-Powered Company Data Extraction",
  description:
    "Transform any company name, URL, or search query into comprehensive business intelligence. Get contact information, tech stack details, and competitive insights instantly.",
  keywords: "web scraping, company data, business intelligence, contact extraction, tech stack analysis",
  authors: [{ name: "WebScraper Pro Team" }],
  openGraph: {
    title: "WebScraper Pro - AI-Powered Company Data Extraction",
    description: "Transform any company name, URL, or search query into comprehensive business intelligence.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ReduxProvider>{children}</ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
