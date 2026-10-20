import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fallback keeps the original sheet working if the env var isn't set yet.
const FALLBACK_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzkR8aTTSfTRkeUq3U9m5RgjKrPEya2iek5f-dScJ4VlL6TfAV-NalrvrM5g1eovKQ_/exec";

type Body = { name?: unknown; count?: unknown; pref?: unknown; website?: unknown };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real guests never fill this hidden field. Pretend success to bots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const count = Number(body.count);
  const pref = body.pref === "Non-veg" ? "Non-veg" : body.pref === "Veg" ? "Veg" : "";

  if (!name || !Number.isInteger(count) || count < 1 || count > 20 || !pref) {
    return NextResponse.json({ ok: false, error: "Invalid details" }, { status: 400 });
  }

  const endpoint = process.env.RSVP_ENDPOINT || FALLBACK_ENDPOINT;
  const params = new URLSearchParams({ name, count: String(count), pref });

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      redirect: "follow",
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not record RSVP" }, { status: 502 });
  }
}
