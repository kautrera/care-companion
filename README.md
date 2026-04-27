# Care Companion

A mobile-first PWA for a shared device used by a stroke / cognitive‑impairment
patient and their caretaker.

- **Patient mode** — large simple drawings the patient can tap to communicate
  needs (food, water, bathroom, diaper, pain, tired, cold, hot).
- **Caretaker mode** (PIN‑gated) — ask the patient yes/no questions and review
  a timestamped history with search and filters.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Router v7
- Zustand
- Supabase (Auth, Postgres, Realtime, RLS)
- `vite-plugin-pwa` (installable on iOS / Android home screen)

## Quick start

```bash
npm install
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project
npm run dev
```

Then open the dev URL on your phone (same Wi‑Fi) and tap "Add to Home Screen"
to install the PWA.

## Supabase setup

1. Create a new project at <https://supabase.com>.
2. In the SQL editor, paste and run [`supabase/schema.sql`](supabase/schema.sql).
3. In **Authentication → Providers**, enable Email. For development you can
   disable "Confirm email" so sign‑up is instant.
4. Copy the project URL and the `anon` public API key into your `.env`.

## First‑run flow

1. Caretaker signs up (or signs in).
2. Setup screen: enter patient name + a 4‑digit PIN.
3. Lands in caretaker mode. Tap **Hand to patient** to switch the device into
   patient mode. Tap and hold the small lock icon (top‑left) for 1 s in
   patient mode and enter the PIN to come back.

## Build

```bash
npm run build
npm run preview
```
