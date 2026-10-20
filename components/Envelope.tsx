"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Envelope({
  hint,
  names,
  onOpen,
  onDone,
}: {
  hint: string;
  names: string;
  onOpen: () => void;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const busy = useRef(false);

  const go = () => {
    if (busy.current) return;
    busy.current = true;
    setOpen(true);
    onOpen(); // runs inside the tap, so the browser allows music to start
    setTimeout(onDone, 2900);
  };

  return (
    <motion.div
      className="env-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <div className="env-scene">
        <div className={`env ${open ? "open" : ""}`}>
          <div className="env-back" />
          <div className="env-slot">
          <div className="env-letter">
            <span className="env-letter-names">{names}</span>
          </div></div>
          <div className="env-front" />
          <div className="env-flap" />
          <button
            type="button"
            className="env-seal"
            onClick={go}
            aria-label={hint}
          >
            A&amp;A
          </button>
        </div>
        <p className={`env-hint t ${open ? "gone" : ""}`}>{hint}</p>
      </div>
    </motion.div>
  );
}
