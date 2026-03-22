# 💪 FORM — AI Fitness Coach

A full-stack AI-powered fitness chatbot for beginners, built with Next.js 14, TypeScript, Supabase, and Groq (LLaMA 3.3 70B).

**Live Demo:** [form-fitness.vercel.app](https://form-fitness.vercel.app)  
**GitHub:** [github.com/yourusername/form-fitness](https://github.com/yourusername/form-fitness)

---

## Why This Topic

Fitness is one of the areas where beginners feel the most lost and overwhelmed. Generic advice is everywhere but personalised, conversational guidance is rare. FORM bridges that gap — it feels like texting a knowledgeable trainer, not querying a search engine. Every design and engineering decision was made to make fitness feel *achievable* to someone who's never stepped in a gym.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js (Credentials + Google OAuth) |
| Database | Supabase (PostgreSQL + RLS) |
| AI | Groq API — LLaMA 3.3 70B (free tier) |
| Deployment | Vercel |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js App                        │
│                                                      │
│  /login  /signup  /dashboard                         │
│                                                      │
│  ┌─────────────┐    ┌──────────────────────────┐    │
│  │  Sidebar    │    │     ChatWindow            │    │
│  │  - Sessions │    │  - MessageBubble          │    │
│  │  - Prompts  │    │  - TypingIndicator        │    │
│  │  - User     │    │  - EmptyState             │    │
│  └─────────────┘    │  - ChatInput              │    │
│                     └──────────────────────────┘    │
└─────────────────────────────────────────────────────┘
          │                        │
          ▼                        ▼
  ┌──────────────┐        ┌─────────────────┐
  │   Supabase   │        │  /api/chat      │
  │  PostgreSQL  │◄───────│  (Groq API)     │
  │              │        │  API key = ENV  │
  │  - users     │        └─────────────────┘
  │  - sessions  │
  │  - messages  │
  └──────────────┘
```

**Key security decision:** The `GROQ_API_KEY` lives *only* in the server environment. It is never sent to the client. All AI calls go through `/api/chat`, which validates the user's JWT session before proceeding.

---

## Features

- **Authentication** — Email/password signup + Google OAuth via NextAuth.js
- **Persistent chat history** — Sessions and messages saved to Supabase, restored on return visits
- **Secure AI calls** — API key server-side only, never exposed to the browser
- **Smart session management** — Auto-creates first session, auto-titles from first message
- **Quick programs sidebar** — One-click access to 5 common beginner programs
- **Optimistic UI** — User message appears instantly; rolls back on error
- **Empty state with prompts** — No blank screen; 4 starter questions for new users
- **Typing indicator** — Animated dots while AI generates response
- **Error states** — Graceful handling of auth errors, network failures, API errors
- **Responsive design** — Full mobile support, sidebar collapses on small screens
- **Route protection** — Middleware guards `/dashboard` for unauthenticated users

---

## Local Setup

### 1. Clone & install
```bash
git clone https://github.com/yourusername/form-fitness.git
cd form-fitness
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
# AI — Groq (free at console.groq.com)
GROQ_API_KEY=gsk_your-key-here

# Supabase (free at supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# NextAuth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET on Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 3. Set up Supabase database
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste contents of `supabase/migrations/001_initial_schema.sql` → **Run**

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/yourusername/form-fitness.git
git push -u origin main
```

### 2. Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
2. Add all environment variables from `.env.local` in the Vercel dashboard
3. Set `NEXTAUTH_URL` to your Vercel deployment URL (e.g. `https://form-fitness.vercel.app`)
4. Click **Deploy**

### 3. Update Supabase redirect URLs
In Supabase → **Authentication → URL Configuration**, add:
```
https://your-app.vercel.app
https://your-app.vercel.app/api/auth/callback/google
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler + providers
│   │   │   └── signup/route.ts          # Registration endpoint
│   │   ├── chat/route.ts                # Groq AI call (secured, server-only)
│   │   └── sessions/
│   │       ├── route.ts                 # List / create sessions
│   │       └── [id]/messages/route.ts   # Get messages / delete session
│   ├── dashboard/page.tsx               # Main app page
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx               # Main chat orchestrator
│   │   ├── MessageBubble.tsx            # Markdown-rendered message
│   │   ├── ChatInput.tsx                # Auto-resize textarea + send
│   │   ├── EmptyState.tsx               # Starter prompts for new users
│   │   └── TypingIndicator.tsx          # Animated dots
│   └── layout/
│       └── Sidebar.tsx                  # Session history + quick programs
├── hooks/
│   └── useChat.ts                       # Chat state, API calls, optimistic UI
├── lib/
│   ├── supabase.ts                      # Supabase browser + admin clients
│   └── utils.ts                         # cn() helper
├── middleware.ts                         # Route protection for /dashboard
└── types/
    ├── index.ts                          # Shared TypeScript types
    └── next-auth.d.ts                    # Session type augmentation
supabase/
└── migrations/
    └── 001_initial_schema.sql            # Tables + RLS policies
```

---

## Design Decisions

**Dark athletic aesthetic** — Electric lime (`#c8ff00`) on near-black (`#0a0a0a`). Feels like a premium fitness app (Nike Training Club, Whoop) rather than a generic SaaS chat tool.

**Barlow Condensed + DM Sans** — Condensed display font signals sport and performance. Clean body font maintains readability in conversation.

**Empty state with prompts** — New users never face a blank screen. Four starter prompts cover the most common beginner questions and immediately communicate what the coach can do.

**Persistent sessions** — Returning users pick up exactly where they left off. Each session auto-titles itself from the first message so history is scannable.

**Optimistic updates** — User messages render immediately without waiting for the server. Failed messages roll back automatically with an error notice.

**Groq over OpenAI** — LLaMA 3.3 70B on Groq's custom silicon is faster than GPT-3.5, completely free at 14,400 requests/day, and requires no credit card — making this genuinely deployable without ongoing cost.

**Custom `useChat` hook** — Separates chat state and API logic from the UI layer. Makes the logic independently testable and keeps `ChatWindow.tsx` focused on rendering.

**Server-only API key** — The AI key never reaches the browser. `/api/chat` acts as a secure proxy, validating the user's session before every request.

---

## If I Had More Time

- **Workout logger** — Let users log completed exercises and track progressive overload over time
- **BMI & calorie calculator** — Built into the sidebar as a quick tool
- **Daily reminders** — Push notifications for scheduled workout days
- **Streak system** — Gamified consistency tracking with visual progress
- **Voice input** — Web Speech API integration for hands-free coaching

---

## Built With

- [Next.js 14](https://nextjs.org) — App Router, Server Components, API Routes
- [Supabase](https://supabase.com) — PostgreSQL database with Row Level Security
- [NextAuth.js](https://next-auth.js.org) — Authentication with JWT sessions
- [Groq](https://groq.com) — Free LLaMA 3.3 70B inference API
- [Tailwind CSS](https://tailwindcss.com) — Utility-first styling
- [React Markdown](https://github.com/remarkjs/react-markdown) — Markdown rendering in chat
- [Vercel](https://vercel.com) — Deployment and hosting
