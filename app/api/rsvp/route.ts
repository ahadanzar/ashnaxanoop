import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzkR8aTTSfTRkeUq3U9m5RgjKrPEya2iek5f-dScJ4VlL6TfAV-NalrvrM5g1eovKQ_/exec";

type RsvpBody = {
  name?: unknown;
  count?: unknown;
  pref?: unknown;
};

export async function POST(request: Request) {
  let body: RsvpBody;
  try {
    body = (await request.json()) as RsvpBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const count =
    typeof body.count === "number"
      ? body.count
      : typeof body.count === "string" && /^\d+$/.test(body.count)
        ? Number(body.count)
        : NaN;
  const pref = body.pref === "Veg" || body.pref === "Non-veg" ? body.pref : "";

  if (!name || !Number.isInteger(count) || count < 1 || count > 10 || !pref) {
    return NextResponse.json({ ok: false, error: "Please check your RSVP details and try again." }, { status: 400 });
  }

  const endpoint = process.env.RSVP_ENDPOINT || FALLBACK_ENDPOINT;
  const params = new URLSearchParams({ name, count: String(count), pref });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      redirect: "follow",
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Google Sheets endpoint returned ${response.status}`);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to submit Mehndi RSVP to Google Sheets:", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't record your RSVP. Please try again or contact us." },
      { status: 502 },
    );
  }
}
