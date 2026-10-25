"use client";

import { useEffect, useState, type FormEvent } from "react";

const couple = "Ashna & Anoop";
const eventTitle = `${couple} · Mehndi`;
const eventDescription = "An evening of henna, music, and celebration.";
const eventLocation = "Luminara Hotel";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation)}`;
const contacts = [
  { name: "Anzar", phone: "+918138809052", display: "+91 81388 09052" },
  { name: "Ahad", phone: "+919633275297", display: "+91 96332 75297" },
];

function calendarDates() {
  // 6:00–9:00 PM IST (UTC+05:30), 5 December 2026.
  return "20261205T123000Z/20261205T153000Z";
}

function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle,
    dates: calendarDates(),
    details: eventDescription,
    location: eventLocation,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadCalendarFile() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escapeIcs = (value: string) => value.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ashna & Anoop//Mehndi Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:ashna-anoop-mehndi-20261205@invitation`,
    `DTSTAMP:${stamp}`,
    "DTSTART:20261205T123000Z",
    "DTEND:20261205T153000Z",
    `SUMMARY:${escapeIcs(eventTitle)}`,
    `DESCRIPTION:${escapeIcs(eventDescription)}`,
    `LOCATION:${escapeIcs(eventLocation)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Ashna-and-Anoop-Mehndi.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3v4m8-4v4M3.5 10h17" />
    </svg>
  );
}

export default function MehndiInvitation() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [foodPreference, setFoodPreference] = useState<"Veg" | "Non-veg">("Veg");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    document.documentElement.dataset.motionReady = "true";
    const targets = document.querySelectorAll<HTMLElement>(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.motionReady;
    };
  }, []);

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const guestCount = Number(guests);
    if (!trimmedName || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
      setRsvpMessage("Please enter your name and a guest count from 1 to 10.");
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");
    setRsvpMessage("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, count: guestCount, pref: foodPreference }),
      });
      const result: { ok?: boolean; error?: string } | null = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setRsvpStatus("error");
        setRsvpMessage(result?.error || "We couldn't record your RSVP. Please try again or contact us.");
        return;
      }
      setRsvpStatus("success");
      setRsvpMessage(`Thank you, ${trimmedName}. Your RSVP has been recorded.`);
      setName("");
      setGuests("1");
      setFoodPreference("Veg");
    } catch {
      setRsvpStatus("error");
      setRsvpMessage("We couldn't record your RSVP. Please try again or contact us.");
    }
  }

  return (
    <main className="page-shell">
      <div className="topline">
        <span>A &amp; A</span>
      </div>

      <section className="hero" aria-labelledby="invitation-title">
        <span className="doodle doodle-spark" aria-hidden="true">✳</span>
        <span className="doodle doodle-flower" aria-hidden="true">✿</span>
        <span className="doodle doodle-dot" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">MEHNDI</p>
          <h1 id="invitation-title">{couple}</h1>
          <p className="hero-intro">Join us for an evening of henna and celebration.</p>
        </div>
        <a className="primary-link" href="#rsvp">Save us a spot <span aria-hidden="true">↓</span></a>
      </section>

      <section className="event-section reveal-on-scroll" aria-label="Event details">
        <div className="section-heading">
          <span className="eyebrow">MEHNDI</span>
          <h2>The celebration</h2>
        </div>
        <div className="details-grid">
          <article className="detail-card date-card">
            <span className="card-doodle" aria-hidden="true">✳</span>
            <p className="detail-index">THE WHEN</p>
            <h3>Saturday,<br />5 December</h3>
            <p className="detail-secondary">From 6:00 PM onwards</p>
          </article>
          <article className="detail-card venue-card">
            <span className="card-doodle" aria-hidden="true">✿</span>
            <p className="detail-index">THE WHERE</p>
            <h3>Luminara Hotel</h3>
            <p className="detail-secondary">Luminara Hotel</p>
            <a className="text-link" href={mapsUrl} target="_blank" rel="noreferrer">
              Find us on Google Maps <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
      </section>

      <section className="calendar-band reveal-on-scroll" aria-labelledby="calendar-title">
        <div>
          <p className="eyebrow">DON&apos;T FORGET!</p>
          <h2 id="calendar-title">Save the date</h2>
          <p>Saturday, 5 December · 6:00 PM</p>
        </div>
        <div className="calendar-actions">
          <a className="button button-light" href={googleCalendarUrl()} target="_blank" rel="noreferrer">
            <CalendarIcon /> Google Calendar
          </a>
          <button className="button button-outline" type="button" onClick={downloadCalendarFile}>
            Download .ics
          </button>
        </div>
      </section>

      <section className="rsvp-section reveal-on-scroll" id="rsvp" aria-labelledby="rsvp-title">
        <div className="rsvp-intro">
          <span className="eyebrow">LET US KNOW</span>
          <h2 id="rsvp-title">RSVP</h2>
          <p>Please share your guest count and food preference.</p>
        </div>
        <form className="rsvp-form" onSubmit={submitRsvp}>
          <label htmlFor="guest-name">Your name</label>
          <input
            id="guest-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            placeholder="Full name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <div className="form-row">
            <div>
              <label htmlFor="guest-count">Guest number</label>
              <input
                id="guest-count"
                name="count"
                type="number"
                min="1"
                max="10"
                required
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="food-preference">Food preference</label>
              <select
                id="food-preference"
                name="pref"
                value={foodPreference}
                onChange={(event) =>
                  setFoodPreference(event.target.value === "Non-veg" ? "Non-veg" : "Veg")
                }
              >
                <option value="Veg">Vegetarian</option>
                <option value="Non-veg">Non-vegetarian</option>
              </select>
            </div>
          </div>
          <button className="button button-green" type="submit" disabled={rsvpStatus === "sending"}>
            {rsvpStatus === "sending" ? "Submitting…" : "Submit RSVP"}
          </button>
          <p className={`form-status ${rsvpStatus}`} aria-live="polite">{rsvpMessage}</p>
        </form>
      </section>

      <footer className="footer reveal-on-scroll">
        <p className="eyebrow">CONTACT DETAILS</p>
        <h2>Get in touch</h2>
        <div className="contact-links">
          {contacts.map((contact) => (
            <a className="contact-card" href={`tel:${contact.phone}`} key={contact.name}>
              <span>{contact.name}</span>
              <strong>{contact.display}</strong>
              <small>Call us ↗</small>
            </a>
          ))}
        </div>
        <p className="footer-signoff">Can&apos;t wait to celebrate with you!</p>
        <p className="footer-names">{couple}</p>
      </footer>
    </main>
  );
}
