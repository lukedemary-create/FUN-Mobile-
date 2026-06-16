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
- Dark background #1a1410
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
  LEFT — Planora Terminal (gold accent #c9a96e)
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
- Accent Color: Gold #c9a96e
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

## Master Color System — Arche Warm Dark (NEVER deviate from these)

This is the ARCHĒ warm-dark design language used throughout every
component. All backgrounds are warm near-black (brown-tinted), not
cool blue-black. All text is warm cream, not cool white/gray.

### Global Tokens — JavaScript object (copy exactly)
```js
const C = {
  bg:       '#1a1410',   // page background — warm near-black
  surf:     '#231c16',   // card / surface
  raise:    '#2d2419',   // elevated / raised card
  b1:       '#2a2018',   // border default
  b2:       '#3d3028',   // border alt / stronger
  t1:       '#f0e8d8',   // text primary — warm cream
  t2:       '#a89070',   // text secondary — warm tan
  t3:       '#6b5540',   // text muted — warm brown
  gold:     '#c9a96e',   // Terminal / Planning accent
  goldDim:  'rgba(201,169,110,0.10)',
  goldBdr:  'rgba(201,169,110,0.20)',
  teal:     '#00B4C6',   // Nexus / Wealth Counsel accent
  tealDim:  'rgba(0,180,198,0.10)',
  tealBdr:  'rgba(0,180,198,0.22)',
  indigo:   '#818cf8',   // FUN accent
  indigoDim:'rgba(129,140,248,0.08)',
  indigoBdr:'rgba(129,140,248,0.22)',
  up:       '#4a7c59',   // positive / green
  down:     '#c0392b',   // negative / red
  success:  '#10b981',
  warning:  '#f59e0b',
  danger:   '#ef4444',
}
```

### Quick token reference
- Background: `#1a1410`
- Surface (cards): `#231c16`
- Elevated: `#2d2419`
- Border: `#2a2018` / `#3d3028`
- Text primary: `#f0e8d8`
- Text secondary: `#a89070`
- Text muted: `#6b5540`
- Gold accent: `#c9a96e`
- Teal accent: `#00B4C6`
- Indigo accent: `#818cf8`

## Typography

Three fonts — use exactly these variable names:
```js
const DISPLAY = "'Playfair Display', Georgia, serif"   // headlines, card titles
const UI      = "'Inter', system-ui, sans-serif"        // body, labels, UI text
const MONO    = "'JetBrains Mono', 'Courier New', monospace"  // numbers, data, tickers
```

### Type Scale
- Hero headers: Playfair Display, clamp(28px,4vw,48px), weight 700
- Section headers: Playfair Display or Inter, 22–28px, weight 700
- Card titles: Inter, 13–15px, weight 700
- Data/numbers: JetBrains Mono, weight 600–900
- Labels: Inter, 9–11px, uppercase, letterSpacing 0.1–0.18em, color #6b5540
- Body: Inter, 13–14px, lineHeight 1.65, color #a89070

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
- Dark theme ONLY — Arche warm-dark palette everywhere
- Every screen starts with #1a1410 background (warm near-black, NOT cool black)
- Cards: background #231c16, border 1px solid #2a2018, border-radius 12–20px
- All buttons: platform accent color (gold/teal/indigo) with subtle glow on hover
- Empty states always have an icon + message
- Mobile responsive on every single component
- Charts: Recharts, transparent background, grid lines #2a2018

## Navigation Structure
- Top nav: Planora logo left, platform links center, Sign In right
- Warm dark nav background #1a1410 with gold Planora branding
- Platform switcher shows Terminal / Nexus / FUN
- Sidebar within Planora Terminal (Layout.jsx) for section navigation

## Component Standards

### Cards
background: #231c16
border: 1px solid #2a2018
border-radius: 12–20px
padding: 20–28px
hover: border-color lifts to platform accent at 30–40% opacity

### Buttons Primary
background: platform accent color (#c9a96e gold / #00B4C6 teal / #818cf8 indigo)
color: #1a1410 (dark text on gold) or #f0e8d8 on teal/indigo
border-radius: 8–12px
hover: brightness(1.08–1.12)

### Buttons Secondary
background: transparent
border: 1px solid platform accent
color: platform accent
hover: accent color at 10% background fill

### Data Tables
header: background #2d2419, sticky top
rows: alternating #231c16 and #1f1812
border: #2a2018 between rows
numbers: JetBrains Mono, right-aligned
positive values: #4a7c59
negative values: #c0392b

### Charts (Recharts)
background: transparent
grid lines: #2a2018
axis labels: #6b5540, JetBrains Mono, text-xs
line/bar fills: platform accent

## Tech Stack (NEVER change these)
- React + Vite (plain JSX — no TypeScript)
- Tailwind CSS present but components primarily use inline styles
- Recharts for ALL data visualization
- Lucide React for ALL icons
- Framer Motion for animations (only when explicitly requested by Luke)
- No other UI libraries unless explicitly approved

## Code Standards
- Plain JSX throughout — NO TypeScript, no .tsx files, no interfaces
- Inline styles are the standard pattern (not Tailwind-only)
- No console.logs in production components
- localStorage persistence via useLS(key, default) hook pattern
- State-based internal navigation (not React Router sub-routes) for complex pages
- All tax/financial constants imported from src/config/taxConstants2026.js

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

Skills installed in this project:
- Emil Kowalski motion skill
- Impeccable (/polish command)
- Taste skill
- julianoczkowski designer-skills (brief-to-tasks, design-brief,
  design-flow, design-review, design-tokens, frontend-design,
  grill-me, information-architecture)

Rules for using them:

DESIGNER-FIRST WORKFLOW:
Apply the julianoczkowski designer-skills workflow to every
section before writing any code. Think like a designer first,
engineer second. Plan layout, hierarchy, spacing, and
component structure as a designer would before touching code.

MOTION & ANIMATIONS:
Only apply the Emil Kowalski motion skill when Luke explicitly
says to use motion or animations in a prompt. Never add
animations or motion effects unless directly instructed.
No auto-transitions, no hover animations, no scroll effects
unless asked for.

POLISH:
Run impeccable /polish before finishing every single component.
This is mandatory on every build — no exceptions.

TASTE:
Apply Taste skill design standards to every component always —
no generic AI aesthetics, no boring gradients, no cookie-cutter
layouts ever.

VISUAL QUALITY BENCHMARK:
Stripe.com is the visual quality benchmark for Planora.
Not to copy Stripe — to match that level of precision and
intentionality. Planora is a financial platform like Stripe —
institutional, precise, trusted. Every component must meet or
exceed that standard of craft: spacing, typography, hierarchy,
and component quality must be at Stripe-level or better.

SUMMARY:
- Designer workflow → always, before writing code
- Motion → only when explicitly told by Luke
- Polish → always, before finishing every component
- Taste → always
- Quality bar → Stripe-level precision and intentionality

## Absolute Rules — Never Break These
- Never deviate from the Arche warm-dark color tokens above
- Never use cool blue-black or generic dark grays (#0a0a0f, #111318, etc.)
- Never build light/white themes
- Never mix platform accent colors
- Always use #1a1410 as the page background
- Always use Playfair Display for display headings
- Always use JetBrains Mono for numbers and data
- Always keep Planora as the parent brand
- Always maintain the three-platform hierarchy (Terminal / Nexus / FUN)
- No approval prompts during builds — just build
- No TypeScript — plain JSX only
