"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Star, Shield, BarChart3, Globe, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mascot } from "@/components/mascot"

const features = [
  {
    icon: () => (
      <img
        src="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/c_crop,w_810,h_810,ar_1:1,f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png"
        alt="ScrapFlash Logo"
        className="w-5 h-5 object-contain"
      />
    ),
    title: "Lightning Fast Scraping",
    description: "Scrape company data in seconds with our AI-powered engine.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get detailed insights and analytics on your scraping activities.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Scrape data from websites worldwide with multi-language support.",
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "Perfect for small businesses and individuals",
    features: ["100 scraping requests/month", "Basic company data extraction", "Email support", "Standard rate limits"],
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "Ideal for growing businesses and agencies",
    features: [
      "1,000 scraping requests/month",
      "Advanced data extraction",
      "Priority support",
      "Custom integrations",
      "Analytics dashboard",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large organizations with high-volume needs",
    features: [
      "Unlimited scraping requests",
      "Custom data extraction",
      "24/7 dedicated support",
      "White-label solution",
      "Advanced analytics",
      "API access",
    ],
    popular: false,
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    content:
      "Scrap⚡lash has revolutionized how we gather competitive intelligence. The accuracy and speed are unmatched.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Data Analyst",
    company: "StartupXYZ",
    content: "The analytics dashboard provides incredible insights. We've increased our lead generation by 300%.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Business Owner",
    company: "GrowthCo",
    content: "Simple to use, powerful results. The customer support team is fantastic and always helpful.",
    rating: 5,
  },
]

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard")
    }
  }, [isSignedIn, isLoaded, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Badge variant="secondary" className="mb-4">
              <img
                src="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/c_crop,w_810,h_810,ar_1:1,f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png"
                alt="ScrapFlash Logo"
                className="w-3 h-3 mr-1 object-contain"
              />
              AI-Powered Web Scraping
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Extract Company Data
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Transform any company name, URL, or search query into comprehensive business intelligence. Get contact
              information, tech stack details, and competitive insights in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <Mascot />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Scrap⚡lash?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make web scraping simple, fast, and reliable for businesses of all sizes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center mb-4">
                    <img
                      src="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/c_crop,w_810,h_810,ar_1:1,f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png"
                      alt="ScrapFlash Logo"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business needs. All plans include our core features with no hidden fees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`relative h-full ${plan.popular ? "border-primary shadow-lg scale-105" : "border-0 bg-card/50"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <SignUpButton mode="modal">
                    <Button
                      className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Scrap⚡lash for their data extraction needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of businesses already using Scrap⚡lash to extract valuable company data and gain
                competitive advantages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignUpButton mode="modal">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Start Your Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignUpButton>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                  <Users className="w-5 h-5 mr-2" />
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
