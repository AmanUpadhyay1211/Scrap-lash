"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Analytics", href: "/analytics" },
  { name: "Contact", href: "/contact" },
]

const chatNavigation = {
  name: "AI Chat",
  href: "/chat",
  icon: Bot,
  special: true
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/0"
            >
              <img
                src="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/c_crop,w_810,h_810,ar_1:1,f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png"
                alt="ScrapFlash Logo"
                className="w-8 h-8 object-contain"
              />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Scrap⚡lash
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isSignedIn &&
              navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            {isSignedIn && (
              <Link
                href={chatNavigation.href}
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  pathname.startsWith('/chat') 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600' 
                    : 'text-muted-foreground hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600'
                } flex items-center gap-2`}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-4 h-4"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                {chatNavigation.name}
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Get Started</Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t py-4"
          >
            <nav className="flex flex-col space-y-4">
              {isSignedIn &&
                navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              {isSignedIn && (
                <Link
                  href={chatNavigation.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname.startsWith('/chat') 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600' 
                      : 'text-muted-foreground hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600'
                  } flex items-center gap-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  {chatNavigation.name}
                </Link>
              )}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {isSignedIn ? (
                  <div className="flex justify-start">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="justify-start">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="justify-start">Get Started</Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
