import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { ReduxProvider } from "@/lib/redux/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Scrap⚡lash - AI-Powered Company Data Extraction",
  description:
    "Transform any company name, URL, or search query into comprehensive business intelligence. Get contact information, tech stack details, and competitive insights instantly.",
  keywords: "web scraping, company data, business intelligence, contact extraction, tech stack analysis",
  authors: [{ name: "Aman Upadhyay" }],
  openGraph: {
    title: "Scrap⚡lash - AI-Powered Company Data Extraction",
    description: "Transform any company name, URL, or search query into comprehensive business intelligence.",
    type: "website",
  },
    generator: 'v0.dev',
  icons: {
    icon: [
      { url: "https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png", type: "image/png" }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Add favicon link */}
          <link rel="icon" href="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png" type="image/png" />
        </head>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ReduxProvider>{children}</ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
