"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { contacts, copy, event, type Lang } from "@/lib/content";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import Envelope from "./Envelope";
import Petals from "./Petals";
import Countdown from "./Countdown";
import RsvpModal from "./RsvpModal";
import Reveal from "./Reveal";
import Ornament from "./Ornament";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const heroV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2, delayChildren: 0.15 } },
};
const itemV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } },
};

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <path d="M12 13.2c1.2-1.4 3.2-.4 2.6 1.2-.5 1.2-2.6 2.4-2.6 2.4s-2.1-1.2-2.6-2.4c-.6-1.6 1.4-2.6 2.6-1.2Z" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.2 2" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export default function Invitation() {
  const [lang, setLang] = useState<Lang>("en");
  const [entered, setEntered] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [musicOk, setMusicOk] = useState(true);
  const [photoOk, setPhotoOk] = useState(true);

  const t = copy[lang];
  const audioRef = useRef<HTMLAudioElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Gentle parallax on the portrait
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  // Keep <html lang> in sync (drives the Malayalam font) and remember the choice
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("invite-lang", lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("invite-lang");
      if (saved === "ml" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  // Lock scroll while the envelope is closed
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  const startMusic = useCallback(() => {
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const closeRsvp = useCallback(() => setRsvpOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="stage" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <Petals active={entered} />

      <audio
        ref={audioRef}
        src="/assets/music.mp3"
        loop
        preload="none"
        playsInline
        onError={() => setMusicOk(false)}
      />

      <AnimatePresence>
        {!entered && (
          <Envelope
            key="envelope"
            hint={t.openHint}
            names={`${t.brideName} & ${t.groomName}`}
            onOpen={startMusic}
            onDone={() => setEntered(true)}
          />
        )}
      </AnimatePresence>

      {/* Header: monogram left, controls right */}
      

      <main className="card">
        <motion.header
        className="topbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ pointerEvents: entered ? "auto" : "none" }}
      >
        <div className="topbar-inner">
          <span className="monogram script" aria-label="Ashna and Anoop">
            A &amp; A
          </span>

          <div className="controls">
            {musicOk && (
              <button
                type="button"
                className={`ctl music ${playing ? "on" : ""}`}
                onClick={toggleMusic}
                aria-label={t.music}
                aria-pressed={playing}
              >
                <span className="eq" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </button>
            )}
            <div className="ctl lang" role="group" aria-label="Language">
              <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
                EN
              </button>
              <button type="button" className={lang === "ml" ? "active" : ""} onClick={() => setLang("ml")}>
                മല
              </button>
            </div>
          </div>
        </div>
      </motion.header>
        
        <div className="card-frame" aria-hidden="true" />

        {/* HERO */}
        <motion.header
          ref={heroRef}
          className="hero"
          variants={heroV}
          initial="hidden"
          animate={entered ? "show" : "hidden"}
        >
          <span className="corner tl" aria-hidden="true">❧</span>
          <span className="corner tr" aria-hidden="true">❧</span>

          <motion.p variants={itemV} className="eyebrow t">
            {t.familyLine}
          </motion.p>

          <motion.div variants={itemV} className="photo-wrap">
            <motion.div className="photo-frame" style={{ y: photoY }}>
              <div className="inner">
                {photoOk ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/assets/couple.jpg"
                    alt="Ashna and Anoop"
                    decoding="async"
                    fetchPriority="high"
                    onError={() => setPhotoOk(false)}
                  />
                ) : (
                  <span className="photo-placeholder script">Ashna &amp; Anoop</span>
                )}
              </div>
            </motion.div>
          </motion.div>

          <motion.p variants={itemV} className="eyebrow invitation-line t">
            {t.invitationLine}
          </motion.p>

          <motion.div variants={itemV}>
            <Ornament />
          </motion.div>

          <motion.h1 variants={itemV} className="names t">
            {t.brideName}
          </motion.h1>
          <motion.div variants={itemV} className="amp" aria-hidden="true">
            &amp;
          </motion.div>
          <motion.h1 variants={itemV} className="names t">
            {t.groomName}
          </motion.h1>

          <motion.div variants={itemV}>
            <Ornament />
          </motion.div>

          <motion.div variants={itemV} className="date t">
            {t.heroDate}
          </motion.div>

          {/* <motion.div variants={itemV} className="scroll-cue" aria-hidden="true">
            <span className="t">{t.scroll}</span>
            <i />
          </motion.div> */}
        </motion.header>

        {/* DETAILS */}
        <section className="sec">
          <div className="details">
            {[
              { icon: <IconCalendar />, label: t.dateLabel, value: t.dateValue },
              { icon: <IconClock />, label: t.timeLabel, value: t.timeValue },
              { icon: <IconPin />, label: t.venueLabel, value: t.venueValue },
            ].map((d, i) => (
              <Reveal key={d.label} delay={i * 0.12} className="detail">
                <div className="icon">{d.icon}</div>
                <strong className="t">{d.label}</strong>
                <span className="t">{d.value}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* QUOTE */}
        <section className="sec">
          <Reveal>
            <p className="quote t">&ldquo;{t.quote}&rdquo;</p>
          </Reveal>
        </section>

        {/* COUNTDOWN */}
        <section className="sec">
          <Reveal>
            <h2 className="section-title t">{t.countdownHeading}</h2>
            <Countdown
              target={event.startMs}
              labels={{ days: t.days, hours: t.hours, minutes: t.minutes, seconds: t.seconds }}
            />
          </Reveal>
        </section>

        {/* VENUE */}
        <section className="sec">
          <Reveal>
            <div className="venue-box">
              <div className="venue-name t">{t.venueName}</div>
              <div className="venue-address">
                <span className="t">{t.venueAddress}</span>
                <br />
                <span className="t">{t.venueSchedule}</span>
              </div>

              <a className="pill" href={event.mapsUrl} target="_blank" rel="noopener noreferrer">
                <span className="t">{t.openMaps}</span>
              </a>

              <div className="cal-row">
                <button type="button" className="pill small" onClick={downloadIcs}>
                  <span className="t">{t.addToCalendar}</span>
                </button>
                <a className="pill small" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">
                  <span className="t">{t.googleCalendar}</span>
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* RSVP */}
        <section className="sec rsvp">
          <Reveal>
            <p className="message t">{t.presenceNote}</p>
            <button type="button" className="pill rsvp-btn" onClick={() => setRsvpOpen(true)}>
              <span className="t">{t.rsvpButton}</span>
            </button>
            <p className="rsvp-note t">{t.rsvpNote}</p>
          </Reveal>
        </section>

        {/* CONTACTS */}
        <section className="sec">
          <Reveal>
            <h2 className="section-title t">{t.contactsHeading}</h2>
            <div className="contact-list">
              {contacts.map((c) => (
                <div className="contact" key={c.name}>
                  <span className="contact-name">{c.name}</span>
                  <a className="contact-phone" href={`tel:${c.phone}`}>
                    {c.display}
                  </a>
                  <a
                    className="whatsapp-link t"
                    href={`https://wa.me/${c.wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.whatsapp}
                  </a>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <footer className="footer">
          <Ornament />
          <div>
            <span className="t">{t.footerNames}</span> · 2026
          </div>
        </footer>
      </main>

      <RsvpModal open={rsvpOpen} onClose={closeRsvp} t={t.rsvp} />
    </MotionConfig>
  );
}
