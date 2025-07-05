<div align="center">
  <img src="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/f_png/v1751701111/ChatGPT_Image_Jul_5_2025_11_00_56_AM_u6inpq.png" alt="Scrap⚡lash Logo" width="200" height="200" style="border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" />
  
  # Scrap⚡lash
  
  **Lightning-fast web scraping with AI-powered insights**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-1.0-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
  
  [Live Demo](https://scrapflash.vercel.app) • [Documentation](https://docs.scrapflash.com) • [Report Bug](https://github.com/yourusername/scrapflash/issues)
</div>

---

## ⚡ Features

### 🕷️ **Advanced Web Scraping**
- **Multi-source scraping** from websites, LinkedIn, and company databases
- **Intelligent data extraction** with automatic field detection
- **Real-time processing** with progress indicators
- **Export capabilities** (CSV, JSON, Excel)

### 🤖 **AI-Powered Insights**
- **Company analysis** with detailed business intelligence
- **Market research** and competitive analysis
- **Growth predictions** and investment insights
- **Custom AI conversations** for each company

### 💬 **Interactive AI Chat**
- **Context-aware conversations** with company data
- **Credit-based system** for fair usage
- **Chat history** with persistent conversations
- **Real-time messaging** with typing indicators

### 🎨 **Modern UI/UX**
- **Glass morphism design** with backdrop blur effects
- **Dark/Light mode** with smooth transitions
- **Responsive design** for all devices
- **Smooth animations** with Framer Motion

### 🔐 **Enterprise Security**
- **Clerk authentication** with secure user management
- **Rate limiting** and API protection
- **Data encryption** and secure storage
- **User credits system** for controlled access

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Google Gemini API key
- Clerk authentication setup

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/scrapflash.git
cd scrapflash

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
MONGODB_URI=your_mongodb_connection_string

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NODE_ENV=development
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## 🏗️ Architecture

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Redux Toolkit** - State management
- **Clerk** - Authentication & user management

### Backend Stack
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Google Gemini AI** - AI-powered insights
- **Rate limiting** - API protection

### Key Components

```
scrapflash/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chats/         # Chat management
│   │   ├── scrape/        # Web scraping
│   │   └── user/          # User management
│   ├── chat/              # AI chat interface
│   └── dashboard/         # User dashboard
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utilities & configurations
│   ├── redux/            # Redux store & slices
│   └── ...               # Other utilities
└── types/                # TypeScript type definitions
```

---

## 🎯 Usage Guide

### 1. **Web Scraping**
1. Navigate to the home page
2. Enter a company name, website, or LinkedIn URL
3. Select scraping options (emails, phone numbers, etc.)
4. Click "Start Scraping" and wait for results
5. View detailed company information

### 2. **AI Insights**
1. After scraping, click "Get AI Insight" on any company
2. Automatically creates a new AI chat session
3. AI provides detailed analysis with initial prompt
4. Continue conversation for deeper insights

### 3. **Chat Management**
1. Access "AI Chat" from the navigation
2. View all your chat sessions
3. Continue previous conversations
4. Create new chats or delete old ones

### 4. **Credit System**
- Each AI message costs 1 credit
- Credits are displayed in the chat interface
- Purchase more credits as needed

---

## 🔧 API Reference

### Scraping Endpoints

```typescript
POST /api/scrape
{
  "input": "company name or URL",
  "inputType": "company|website|linkedin",
  "options": {
    "emails": boolean,
    "phones": boolean,
    "addresses": boolean
  }
}
```

### Chat Endpoints

```typescript
// Get user chats
GET /api/chats?userId={userId}

// Create new chat
POST /api/chats
{
  "userId": "string",
  "title": "string",
  "scrapeData": "object"
}

// Send message
POST /api/chats/{chatId}/messages
{
  "userId": "string",
  "message": "string"
}
```

### User Endpoints

```typescript
// Get user data
GET /api/user/{userId}

// Update credits
POST /api/user/{userId}/credits
{
  "creditsUsed": number
}
```

---

## 🎨 Customization

### Styling
The app uses Tailwind CSS with custom design tokens:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}
```

### Components
All UI components are built with Shadcn/ui and can be customized:

```bash
# Add new components
npx shadcn-ui@latest add [component-name]
```

### AI Integration
To integrate different AI providers, modify the `callGeminiAPI` function in:
```
app/api/chats/[chatId]/messages/route.ts
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
GEMINI_API_KEY=your_production_gemini_key
CLERK_SECRET_KEY=your_production_clerk_key
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/scrapflash.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Add tests if applicable

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

---

## 📊 Performance

### Optimization Features
- **Image optimization** with Next.js Image component
- **Code splitting** for faster page loads
- **Server-side rendering** for SEO
- **Caching strategies** for API responses
- **Bundle analysis** with webpack-bundle-analyzer

### Monitoring
- **Real-time performance** monitoring
- **Error tracking** and logging
- **User analytics** and insights
- **API response times** tracking

---

## 🔒 Security

### Security Features
- **Authentication** with Clerk
- **Rate limiting** on API endpoints
- **Input validation** and sanitization
- **CORS protection**
- **Environment variable** protection

### Best Practices
- Never commit sensitive data
- Use HTTPS in production
- Regular dependency updates
- Security audits with `npm audit`

---

## 📈 Roadmap

### Upcoming Features
- [ ] **Advanced analytics dashboard**
- [ ] **Bulk scraping operations**
- [ ] **Custom scraping templates**
- [ ] **API rate limit management**
- [ ] **Team collaboration features**
- [ ] **Export to multiple formats**
- [ ] **Real-time notifications**
- [ ] **Mobile app development**

### Planned Improvements
- [ ] **Performance optimization**
- [ ] **Enhanced AI capabilities**
- [ ] **Better error handling**
- [ ] **More data sources**
- [ ] **Advanced filtering**

---

## 📞 Support

### Getting Help
- 📧 **Email**: support@scrapflash.com
- 💬 **Discord**: [Join our community](https://discord.gg/scrapflash)
- 📖 **Documentation**: [docs.scrapflash.com](https://docs.scrapflash.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/scrapflash/issues)

### Community
- 🌟 **Star us on GitHub**
- 📢 **Share on social media**
- 🤝 **Contribute to the project**
- 💡 **Suggest new features**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ⚡ by the Scrap⚡lash team</p>
  <p>
    <a href="https://scrapflash.com">Website</a> •
    <a href="https://twitter.com/scrapflash">Twitter</a> •
    <a href="https://linkedin.com/company/scrapflash">LinkedIn</a>
  </p>
</div>
