# Ashna & Anoop — Mehndi invitation

A small, standalone Next.js invitation card for the Mehndi celebration.

## Run locally

```powershell
npm install
npm run dev
```

## Update event details

Edit `app/page.tsx` to change the names, date/time, venue, map search, contacts, or calendar duration. The RSVP form submits the guest name, party size, and food preference to a Google Apps Script web app, which should append the values to a Google Sheet.

Set `RSVP_ENDPOINT` to the Apps Script web app URL in your deployment environment. If unset, the app uses the endpoint already configured in the neighboring wedding invitation project. Use a separate endpoint if Mehndi responses should be written to a different spreadsheet.

The card currently lists Saturday, 5 December 2026 at 6:00 PM, at Luminara Hotel. Calendar links are set for 6:00–9:00 PM IST.
