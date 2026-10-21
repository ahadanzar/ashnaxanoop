"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Copy } from "@/lib/content";

type Status = "idle" | "sending" | "ok" | "error";

export default function RsvpModal({
  open,
  onClose,
  t,
}: {
  open: boolean;
  onClose: () => void;
  t: Copy["rsvp"];
}) {
  const [name, setName] = useState("");
  const [count, setCount] = useState("1");
  const [pref, setPref] = useState<"Veg" | "Non-veg">("Non-veg");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [thanksName, setThanksName] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const countExceedsLimit = Number(count) > 10;
  const countIsValid = /^\d+$/.test(count) && Number(count) >= 1 && !countExceedsLimit;

  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    const id = setTimeout(() => nameRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const clean = name.trim();
    if (!clean || status === "sending") return;
    const headcount = Number(count);
    if (!/^\d+$/.test(count) || headcount < 1 || headcount > 10) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clean, count: headcount, pref, website }),
      });
      if (!res.ok) throw new Error("failed");
      setThanksName(clean);
      setStatus("ok");
      setName("");
      setCount("1");
      setPref("Non-veg");
      setTimeout(onClose, 2400);
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="script">{t.title}</h3>

            {status === "ok" ? (
              <p className="modal-thanks t">{t.thanks.replace("{name}", thanksName)}</p>
            ) : (
              <form onSubmit={submit}>
                <label htmlFor="rsvpName" className="t">
                  {t.name}
                </label>
                <input
                  ref={nameRef}
                  id="rsvpName"
                  type="text"
                  required
                  maxLength={80}
                  autoComplete="name"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="rsvpCount" className="t">
                  {t.count}
                </label>
                <input
                  id="rsvpCount"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  required
                  aria-invalid={countExceedsLimit}
                  aria-describedby={countExceedsLimit ? "rsvpCountError" : undefined}
                  value={count}
                  onChange={(e) => setCount(e.target.value.replace(/\D/g, "").slice(0, 2))}
                />
                {countExceedsLimit && (
                  <p id="rsvpCountError" className="count-error t" role="alert">
                    {t.countLimit}
                  </p>
                )}

                <span className="field-label t">{t.food}</span>
                <div className="pref-options">
                  {(["Veg", "Non-veg"] as const).map((v) => (
                    <label key={v} className={`pref ${pref === v ? "on" : ""} t`}>
                      <input
                        type="radio"
                        name="foodPref"
                        value={v}
                        checked={pref === v}
                        onChange={() => setPref(v)}
                      />
                      {v === "Veg" ? t.veg : t.nonveg}
                    </label>
                  ))}
                </div>

                {/* Honeypot, hidden from people */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hp"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />

                <div className="modal-actions">
                  <button type="button" className="modal-cancel t" onClick={onClose}>
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="modal-submit t"
                    disabled={status === "sending" || !name.trim() || !countIsValid}
                  >
                    {status === "sending" ? t.sending : t.submit}
                  </button>
                </div>

                <div className="modal-status t" aria-live="polite">
                  {status === "error" ? t.error : ""}
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
