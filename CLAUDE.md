# CLAUDE.md — Planora Ecosystem

## Layout Reference
The layout reference I'm working from is a concept mockup.
Use the layout structure exactly as described, but fill every
section with the best possible content, data visualizations,
and components you can design. Make it look like a real
production-grade fintech platform — not a mockup.

## Landing Page Layout

Use this exact layout structure for the Planora homepage:

### Hero Section (Top)
- Dark background #0a0a0f
- Left side: Planora tagline, headline, subheading,
  two CTA buttons (Enter Platform + Explore Solutions)
- Right side: Floating app dashboard preview/mockup
  showing live data — design the best visual you can here
- Bottom of hero: 4 trust badges
  (Live Market Data, Bank-Grade Security,
  Advisor & Client Tools, Education & Planning)

### Three Platform Cards (Middle)
- Label above: "THREE PLATFORMS. ONE ECOSYSTEM."
- Three equal cards side by side:
  LEFT — Planora Terminal (gold accent #F5A623)
         Market Intelligence Platform
         Bullet points: Real-time Data, Risk Analysis,
         Planning Tools, Wealth Counsel

  CENTER — Nexus (teal accent #00B4C6)
           Advisor-Client Platform
           Bullet points: Client Portal, Workflow Center,
           Life Events, Secure Messaging

  RIGHT — FUN (indigo accent #818cf8)
          Financial Education Network
          Bullet points: Education Modules, Calculators,
          Visual Guides, Assessments

- Each card has arrow → in top right corner
- Active/selected card has brighter border glow

### Feature Strip (Below Cards)
- Dark background, 6 features in a row with icons:
  Real-Time Intelligence, Advanced Risk Analysis,
  Portfolio Optimization, Wealth Planning,
  Client Collaboration, Secure by Design

### Dashboard Preview Cards (Bottom Section)
- 6 cards in a grid showing live previews of:
  Portfolio Intelligence, Macro Outlook chart,
  Macro Research, Retirement Plan probability,
  Future Planning, Client Engagement
- These should look like real working dashboard widgets
  with charts, numbers, and live data feel

### Footer
- Planora logo + description left
- Navigation columns: Platform, Solutions, Research,
  Wealth, Education, Company
- Email newsletter signup right
- Copyright bottom

## Ecosystem Identity
Name: Planora
Tagline: "Institutional Intelligence. Personal Impact."
Standard: Bloomberg Terminal + BlackRock + JP Morgan quality
Vision: The unified ecosystem for institutional-grade market
intelligence, advisor collaboration, and financial education
Scale: Enterprise/institutional — every component should feel
like it belongs in a $100M fintech product

## Three Platforms — One Ecosystem

### 1. Planora Terminal
- Role: Market Intelligence Platform
- Accent Color: Gold #F5A623
- Description: Institutional-grade analytics, live market data,
  risk modeling, and wealth planning tools
- Key Features: Real-time data, Risk Analysis, Planning Tools,
  Wealth Counsel

### 2. Nexus
- Role: Advisor-Client Platform
- Accent Color: Teal #00B4C6
- Description: Secure collaboration hub for advisors and clients
- Key Features: Client Portal, Workflow Center, Life Events,
  Secure Messaging

### 3. FUN — Financial Understanding Network
- Role: Financial Education Platform
- Accent Color: Indigo #818cf8
- Description: Interactive learning, calculators, and planning
  modules to empower clients at every stage of their journey
- Key Features: Education Modules, Calculators, Visual Guides,
  Assessments

## Master Color System (NEVER deviate from these)

### Global Tokens
- Background Primary: #0a0a0f
- Background Surface: #111318
- Background Elevated: #16181f
- Border Default: #1e2028
- Border Subtle: #13151a
- Text Primary: #f1f5f9
- Text Secondary: #94a3b8
- Text Muted: #64748b
- Success: #10b981
- Warning: #f59e0b
- Danger: #ef4444

### Platform Accent Colors
- Planora Terminal Gold: #F5A623
- Planora Terminal Gold Dim: #F5A62320
- Nexus Teal: #00B4C6
- Nexus Teal Dim: #00B4C620
- FUN Indigo: #818cf8
- FUN Indigo Dim: #818cf820

## Typography
- Primary Font: Inter (clean, institutional, geometric)
- Display Font: For hero headers only
- Mono Font: font-mono for all numbers, data, tickers
- Load from Google Fonts: Inter
- Never use system fonts in production components

### Type Scale Rules
- Hero headers: text-5xl font-bold tracking-tight
- Section headers: text-2xl font-semibold
- Card titles: text-lg font-semibold
- Data/numbers: font-mono font-medium
- Labels: text-xs uppercase tracking-widest text-muted
- Body: text-sm leading-relaxed

## Designer Persona
You are a Senior UI/UX Designer with 15+ years of experience
designing institutional-grade financial platforms for JP Morgan,
BlackRock, and Goldman Sachs. Every component you build should
reflect that level of craft and precision. You have an obsessive
eye for detail — spacing, typography, color hierarchy, and data
presentation are never an afterthought. You design for
sophistication first. Every pixel has a purpose.

Never design like a generic AI. Never use cookie-cutter layouts.
Never produce anything that looks like a template. Ask yourself
before building every component — would a Managing Director at
JP Morgan Private Bank be proud to show this to a client?

## Global UI Rules
- Dark theme ONLY — never light mode content areas
- Every screen starts with #0a0a0f background
- Cards: rounded-xl border border-[#1e2028] bg-[#111318]
- All buttons: platform accent color with subtle glow on hover
- Micro-animations on ALL interactions
- Loading skeletons always — never spinners
- Empty states always have an icon + message
- Mobile responsive on every single component
- Sticky headers on all data tables
- Zebra striping on all tables
- Gradient fills on all charts
- Charts animated on load

## Navigation Structure
- Top nav: Planora logo left, platform links center,
  Sign In + Request Demo right
- Dark nav background #0a0a0f with gold Planora branding
- Platform switcher shows Terminal / Nexus / FUN
- Sidebar within each platform for section navigation

## Component Standards

### Cards
background: #111318
border: 1px solid #1e2028
border-radius: 12px
padding: 24px
hover: border-color lifts to platform accent at 40% opacity

### Buttons Primary
background: platform accent color
color: #0a0a0f (dark text on gold) or white
border-radius: 8px
hover: subtle glow shadow in accent color

### Buttons Secondary
background: transparent
border: 1px solid platform accent
color: platform accent
hover: accent color at 10% background fill

### Data Tables
header: bg-[#16181f] sticky top
rows: alternating #111318 and #0d0f14
border: #1e2028 between rows
numbers: font-mono right-aligned
positive values: #10b981
negative values: #ef4444

### Charts (Recharts)
background: transparent
grid lines: #1e2028
axis labels: #64748b font-mono text-xs
line/bar fills: platform accent with gradient
animated on mount

## Tech Stack (NEVER change these)
- React + Vite
- Tailwind CSS (custom tokens above, never default grays)
- Recharts for ALL data visualization
- Lucide React for ALL icons
- Framer Motion for ALL animations
- No other UI libraries unless explicitly approved

## Code Standards
- TypeScript interfaces for all props
- JSDoc comments on all complex functions
- Always handle loading, error, and empty states
- No inline styles — Tailwind only
- No console.logs in production components
- Componentize everything — no monolithic files

## Platform-Specific Rules

### Planora Terminal
- Gold accents everywhere in this platform
- Dense data layouts — Bloomberg style
- Live tickers, real-time feel
- Market data always front and center

### Nexus
- Teal accents throughout
- Clean, collaborative, communication-forward
- Chat/messaging components feel polished
- Client-facing — approachable but professional

### FUN
- Indigo accents throughout
- More whitespace than other platforms
- Visual explainers and diagrams on every concept
- Calculators embedded directly in content sections
- Educational tone — warm, clear, never condescending
- Progress indicators on all learning modules

## Design Skills

Three skills are installed in this project:
- Emil Kowalski motion skill
- Impeccable (/polish command)
- Taste skill

Rules for using them:

MOTION & ANIMATIONS:
Only apply the Emil Kowalski motion skill
when Luke explicitly says to use motion
or animations in a prompt. Never add
animations or motion effects unless
directly instructed. No auto-transitions,
no hover animations, no scroll effects
unless asked for.

POLISH:
Run /polish from Impeccable before
finishing every component — always.
This is mandatory on every build.

TASTE:
Apply Taste skill design standards to
every component always — no generic AI
aesthetics, no boring gradients, no
cookie cutter layouts ever.

SUMMARY:
- Motion → only when told
- Polish → always
- Taste → always

## Absolute Rules — Never Break These
- Never deviate from the color tokens above
- Never use default Tailwind grays
- Never build light/white themes
- Never use spinners — always skeletons
- Never build a static page — everything interactive
- Never skip empty states or error states
- Never mix platform accent colors
- Always keep Planora as the parent brand
- Always maintain the three-platform hierarchy
- No approval prompts during builds — just build
