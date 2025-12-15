# B7W Project Management App

## Overview
A Next.js project management dashboard for tracking a 10-week development phase. Features progress tracking, weekly updates, changelog, and feedback management.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Auth**: Supabase Auth

## Project Structure
```
src/
├── app/
│   ├── admin/           # Protected admin dashboard
│   │   ├── changelog/   # Ship log entries
│   │   ├── feedback/    # User feedback management
│   │   ├── timeline/    # Project timeline view
│   │   ├── updates/     # Weekly status updates
│   │   └── layout.tsx   # Admin layout with nav + auth guard
│   ├── auth/callback/   # Supabase auth callback
│   ├── login/           # Login page
│   └── page.tsx         # Root redirect (→ admin or login)
├── components/          # Shared UI components
├── lib/
│   ├── database.types.ts  # Supabase generated types
│   └── supabase/          # Supabase client helpers
└── middleware.ts        # Session refresh middleware
```

## Database Schema
- **epics**: High-level feature groups
- **stories**: Individual work items (linked to epics)
- **weekly_updates**: Weekly progress summaries with blockers
- **changelog**: Shipped features/fixes/improvements
- **feedback**: User feedback with threading support
- **project_meta**: Single row with project status, week info, dates

## Common Commands
```bash
npm run dev    # Start development server
npm run build  # Production build
npm run lint   # Run ESLint
```

## Key Patterns
- Server components by default (data fetching in components)
- Supabase SSR client pattern (`createClient()` from server.ts)
- Protected routes via layout-level auth checks
- TypeScript types generated from Supabase schema

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
