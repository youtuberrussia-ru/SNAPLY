# SNAPLY 0.2 — Visual Memory

Responsive PWA built with React, TypeScript, Vite, Supabase Auth, Supabase PostgreSQL/Storage, IndexedDB and Tesseract.js.

## Included
- Email/password sign-up and sign-in (Supabase Auth)
- Per-user cloud records and private image storage
- Row Level Security policies in `supabase/schema.sql`
- Local OCR (Russian + English), categories, search and favorites
- PWA manifest and 192/512 PNG app icons
- Responsive desktop/mobile interface

## 1. Create Supabase backend (free tier)
1. Create a project at https://supabase.com and wait until it is ready.
2. Open **SQL Editor → New query**.
3. Paste and run the complete contents of `supabase/schema.sql`.
4. Open **Project Settings → API** (or API Keys).
5. Copy the Project URL and the publishable/anon public key. Never use a `service_role` or secret key in a browser app.

## 2. Configure local development
Copy `.env.example` to `.env` and fill in:
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
```
Then:
```bash
npm install
npm run dev
```

## 3. GitHub Pages configuration
In repository **Settings → Secrets and variables → Actions**, create repository secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Set **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The included workflow installs dependencies, builds the app and deploys `dist`.

## 4. Email confirmation
In Supabase open **Authentication → URL Configuration**:
- Set Site URL to your eventual GitHub Pages URL.
- Add that same URL to Redirect URLs.
For first testing, email confirmation can remain enabled. New users must click the confirmation link before signing in if confirmation is enabled. Configure SMTP/custom email delivery before public launch if needed; default email sending has provider limits.

## Data and privacy
- Auth passwords are managed by Supabase Auth; SNAPLY does not store raw passwords.
- Each user's rows are protected by RLS policies.
- Images are uploaded to a private Storage bucket under the user's ID and accessed with temporary signed URLs.
- OCR runs in the browser; images are uploaded to the user's private cloud account only after successful import when signed in.
- Browser IndexedDB also caches local records. Clearing browser data can remove the local cache; cloud account data remains in Supabase.
- The app does not yet implement account deletion UI, password reset UI, export/restore, conflict resolution, or a production-grade privacy policy. Add and test these before public commercial release.
- Supabase free-tier quotas and availability apply. A free tier is not a promise of unlimited free operation.

## Important
This is a working development release, not a claim that a live hosted service has already been configured. The owner must create the Supabase project, apply the SQL, configure GitHub secrets and test signup/login before public use.
