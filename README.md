# Ashna & Anoop — wedding invitation

Next.js (App Router) + TypeScript + Framer Motion. Built for Vercel.

## Before you deploy

Add two files to `public/assets/`:

- `couple.jpg` — the portrait (4:5 works best, ~1200x1500). Also used as the WhatsApp/iMessage link preview.
- `music.mp3` — the background track. If it's missing, the music button hides itself.

## Run locally

    npm install
    npm run dev

## Deploy to Vercel

1. Push this folder to a GitHub repo and import it in Vercel (framework is auto-detected).
2. Optional env vars (Project → Settings → Environment Variables):
   - `RSVP_ENDPOINT` — your Google Apps Script URL. If unset, the original URL baked into `app/api/rsvp/route.ts` is used.
   - `NEXT_PUBLIC_SITE_URL` — your final domain, for link previews.

## Where things are

- `lib/content.ts` — all English and Malayalam text, date, venue, contacts.
- `components/` — Envelope intro, Petals, Countdown, RsvpModal, Reveal.
- `app/api/rsvp/route.ts` — validates the RSVP and forwards it to the sheet server-side.
- `app/globals.css` — all styling.
