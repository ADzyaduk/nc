---
trigger: always_on
---

# Cursor Rules — Nuxt 4.3.1 + Nuxt UI 4.5.1 + Supabase + Telegram Mini App

These rules are authoritative for all code generation, refactors, and suggestions in this repository.

They must be followed strictly.

---

## Tech Stack (Do Not Deviate)

- Nuxt 4.3.0
- Vue 3 — Composition API only
- TypeScript — strict mode
- Pinia — state management
- Nuxt UI 4.4.0 — default UI system
- Supabase — mandatory backend
- Telegram WebApp (Mini App inside Telegram)

If Nuxt, Nuxt UI, Supabase, or Telegram provides a solution — it must be used.

---

## MCP Rules (Mandatory)

Required MCP Servers:

- Nuxt MCP
- Nuxt UI MCP
- Supabase MCP
- Telegram MCP

Do not implement custom alternatives when MCP exists.

---

## Project Structure Rules

Use Nuxt 4 app-first structure.

Allowed directories:

- app/components
- app/composables
- app/layouts
- app/middleware
- app/pages
- app/plugins
- app/stores
- app/utils
- server/api
- server/middleware
- server/utils

Do NOT invent alternative folder structures.

---

## File Naming Rules (Strict)

- Components: PascalCase.vue
- Composables: usePascalCase.ts
- Stores: useDomainStore.ts
- Pages, layouts, middleware, plugins: kebab-case

Never mix naming conventions.

---

## Component Rules

- Use <script setup lang="ts"> only
- Do NOT use Options API
- Do NOT use mixins
- Organize logic via composables
- Components must remain presentational when possible

---

## UI Rules (Nuxt UI — Mandatory)

Nuxt UI is the only allowed UI layer.

Required:

- Prefer Nuxt UI components over raw HTML
- Use slot-based APIs
- Rely on Nuxt UI for accessibility
- Mobile-first layout (Telegram viewport priority)

Preferred components:

- UHeader
- UFooter
- UNavigationMenu
- UButton
- UCard
- UModal
- USlideover
- UInput
- USelect
- UTextarea
- UBadge
- UAlert
- USkeleton

Forbidden:

- <button>, <input>, <nav> when Nuxt UI equivalent exists
- Rebuilding accessibility logic
- Overriding Nuxt UI core styles

---

## Layout Rules

Global layout must live in app/layouts/default.vue

Structure:

1. UHeader
2. <slot />
3. UFooter

Do NOT implement custom header/footer when Nuxt UI provides them.

---

## Data Fetching Rules (SSR-Safe Only)

- Use useFetch or useAsyncData exclusively
- Do NOT fetch in onMounted
- Handle errors with createError
- Heavy logic must be server-side

---

## Supabase Rules (Mandatory Backend)

Supabase is required.

Rules:

- PostgreSQL as primary database
- All sensitive logic must run server-side
- Row Level Security enabled
- Never expose service role key to client
- Use typed queries

Minimum required tables:

- users
- birth_charts
- reports
- payments
- subscriptions (if recurring enabled)

All schema changes must use migrations.

---

## Telegram Mini App Rules

App runs inside Telegram WebApp environment.

Mandatory:

- Use Telegram initData
- Validate initData on server
- Never trust client Telegram ID
- Support Telegram theme variables
- Optimize for in-app browser

Forbidden:

- Redirect-based authentication
- External popup auth
- Assuming full browser APIs

---

## Astrology Engine Rules

- All astrology calculations must run server-side
- No planetary calculations in client bundle
- Chart data stored as JSON in database
- AI interpretation must consume structured planetary data

---

## State Management (Pinia)

- One store per domain
- No direct state mutation outside actions
- No async logic inside getters
- Fully typed stores

---

## Routing & Middleware

- Use Nuxt route middleware
- Prefer synchronous middleware
- No side effects in middleware

---

## Performance Rules

- First paint under 1.5s target
- Lazy-load heavy components
- Avoid large libraries in client bundle
- Use routeRules for rendering strategy
- Use NuxtImg for images

---

## UX/UI PRO Skill Rules (Mandatory)

UX Principles:

- Onboarding max 3 steps
- Progressive disclosure
- Clear CTA hierarchy
- Visible loading states
- Friendly error states

UI Principles:

- Card-based layout
- Consistent spacing
- No clutter
- Mobile-first

Microinteractions Required:

- Skeleton loaders
- Smooth modal transitions
- Feedback after payment
- Animated chart reveal

---

## Monetization Rules

- Free tier must exist
- Paid content must be server-validated
- Never unlock paid content client-side
- Payment verification must use webhook

---

## Security Rules

- Validate Telegram initData hash server-side
- Validate all Supabase mutations server-side
- Never trust client-provided prices
- Use secure cookies (httpOnly, secure, sameSite)

---

## Analytics Rules

Track:

- onboarding_started
- onboarding_completed
- report_generated
- payment_started
- payment_completed

Analytics must be stored server-side.

---

## Forbidden Patterns (Never Generate)

- Options API
- Mixins
- Manual DOM manipulation
- Client-side planetary calculations
- Raw HTML UI when Nuxt UI exists
- Skipping server validation
- Unlocking paid content client-side

---

## Final Rule

If uncertain:

1. Check Nuxt 4 documentation
2. Check Nuxt UI 4 documentation
3. Check Supabase documentation
4. Check Telegram WebApp documentation

If a built-in solution exists — use it.

Custom implementation is last resort.