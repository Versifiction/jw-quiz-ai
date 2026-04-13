"use client";
import { useState, useEffect, useRef, useCallback } from "react";

import HomePhoneMockup from "../HomePhoneMockup";

/* ─── Inline SVG icons (Phosphor-style, strokeWidth 1.5) ──────────────────*/
const Ic = {
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
      <path d="m234.5 114.38-45.1 39.36 13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31-51 31a16 16 0 0 1-23.84-17.34l13.49-58.54-45.11-39.42a16 16 0 0 1 9.12-28.06l59.46-5.15 23.21-55.36a15.95 15.95 0 0 1 29.44 0L166 81.17l59.44 5.15a16 16 0 0 1 9.11 28.06Z" />
    </svg>
  ),
  Trophy: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M56 56v56a72 72 0 0 0 144 0V56Z" />
      <path d="M56 80H24a8 8 0 0 0-8 8v24a48 48 0 0 0 48 48h0M200 80h32a8 8 0 0 1 8 8v24a48 48 0 0 1-48 48h0" />
      <path d="M128 184v40M96 224h64" />
    </svg>
  ),
  Lightning: () => (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
      <path d="m213.85 125.46-112 120a8 8 0 0 1-13.69-7l14.66-76.34-57.6-21.74a8 8 0 0 1-2.47-13.18l112-120a8 8 0 0 1 13.69 7l-14.66 76.34 57.6 21.74a8 8 0 0 1 2.47 13.18Z" />
    </svg>
  ),
  Users: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M84 168c0-33.14 19.6-60 44-60s44 26.86 44 60" />
      <circle cx="128" cy="72" r="36" />
      <path d="M196 184c0-28.37 12.54-52 30-60" />
      <circle cx="196" cy="100" r="28" />
      <path d="M60 184c0-28.37-12.54-52-30-60" />
      <circle cx="60" cy="100" r="28" />
    </svg>
  ),
  Book: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M48 80a96 96 0 0 1 80-16 96 96 0 0 1 80 16" />
      <path d="M48 80v128a96 96 0 0 1 80-16 96 96 0 0 1 80 16V80" />
      <path d="M128 64v176" />
    </svg>
  ),
  ChevR: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m96 48 96 80-96 80" />
    </svg>
  ),
  Check: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m40 128 72 72L216 56" />
    </svg>
  ),
  Play: () => (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-24.32-13.65V40a16 16 0 0 1 24.32-13.65l144.08 88.14A15.74 15.74 0 0 1 240 128Z" />
    </svg>
  ),
  Shield: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M40 114.79V56a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8v58.77c0 84.18-71.31 112.42-87.41 117.91a8 8 0 0 1-5.18 0C107.31 227.21 40 199 40 114.79Z" />
      <path d="m96 132 24 24 40-48" />
    </svg>
  ),
  Quote: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 256 256"
      fill="currentColor"
      opacity=".15"
    >
      <path d="M100 56H52a12 12 0 0 0-12 12v48a12 12 0 0 0 12 12h36v4a36 36 0 0 1-36 36 12 12 0 0 0 0 24 60 60 0 0 0 60-60V68a12 12 0 0 0-12-12Zm104 0h-48a12 12 0 0 0-12 12v48a12 12 0 0 0 12 12h36v4a36 36 0 0 1-36 36 12 12 0 0 0 0 24 60 60 0 0 0 60-60V68a12 12 0 0 0-12-12Z" />
    </svg>
  ),
  Globe: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="128" cy="128" r="104" />
      <path d="M168 128c0 40-18 80-40 104M88 128c0 40 18 80 40 104M168 128c0-40-18-80-40-104M88 128c0-40 18-80 40-104M24 128h208" />
    </svg>
  ),
  MenuX: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
    >
      <path d="M40 128h176M40 64h176M40 192h176" />
    </svg>
  ),
};

/* ─── Data ────────────────────────────────────────────────────────────────*/
const CATEGORIES = [
  {
    id: 1,
    title: "Torah & Pentateuque",
    sub: "Genèse — Deutéronome",
    count: 48,
    col: "span 1",
  },
  {
    id: 2,
    title: "Évangiles & Actes",
    sub: "Nouveau Testament",
    count: 62,
    col: "span 1",
  },
  {
    id: 3,
    title: "Prophètes",
    sub: "Majeurs & Mineurs",
    count: 55,
    col: "span 2",
  },
  {
    id: 4,
    title: "Psaumes & Sagesse",
    sub: "Poésie hébraïque",
    count: 40,
    col: "span 1",
  },
  {
    id: 5,
    title: "Épîtres & Révélation",
    sub: "Paul & Jean",
    count: 37,
    col: "span 1",
  },
];

const LEADERBOARD = [
  {
    rank: 1,
    name: "Élise Moreau",
    loc: "Paris",
    pts: 3840,
    time: "00:47",
    avatar: "EM",
    accent: "#10b981",
  },
  {
    rank: 2,
    name: "Samuel Brandt",
    loc: "Genève",
    pts: 3610,
    time: "01:03",
    avatar: "SB",
    accent: "#6366f1",
  },
  {
    rank: 3,
    name: "Mariam Ouédraogo",
    loc: "Abidjan",
    pts: 3590,
    time: "01:11",
    avatar: "MO",
    accent: "#f59e0b",
  },
  {
    rank: 4,
    name: "Théo Lefèvre",
    loc: "Bruxelles",
    pts: 3270,
    time: "01:28",
    avatar: "TL",
    accent: "#ec4899",
  },
  {
    rank: 5,
    name: "Aya Nakamura",
    loc: "Lyon",
    pts: 3145,
    time: "01:39",
    avatar: "AN",
    accent: "#14b8a6",
  },
];

const TESTIMONIALS = [
  {
    text: "Une approche rigoureuse et ludique. J'ai progressé plus en deux semaines qu'en un an de lecture passée.",
    author: "Pasteur V. Leconte",
    role: "Théologien, Strasbourg",
  },
  {
    text: "Les explications après chaque réponse sont d'une précision rare. On sent l'expertise derrière chaque question.",
    author: "Sœur Cécile Arnaud",
    role: "Catéchiste, Nantes",
  },
  {
    text: "Le classement en temps réel m'a redonné envie d'étudier quotidiennement. La compétition saine, ça change tout.",
    author: "Diacre J.-P. Mbuyi",
    role: "Communauté évangélique, Kinshasa",
  },
];

const STATS = [
  { val: "12 400+", label: "Membres actifs" },
  { val: "295", label: "Questions vérifiées" },
  { val: "6", label: "Catégories bibliques" },
  { val: "98.3%", label: "Taux de satisfaction" },
];

/* ─── Spotlight card ─────────────────────────────────────────────────────*/
function SpotCard({ children, style = {}, onClick }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(200px at var(--mx,50%) var(--my,50%), rgba(16,185,129,0.07), transparent 80%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────────────────*/
function Avatar({ initials, accent, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: `${accent}22`,
        border: `1.5px solid ${accent}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Outfit',sans-serif",
        fontSize: size * 0.33,
        fontWeight: 700,
        color: accent,
        letterSpacing: "-0.02em",
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Kinetic marquee (infinite) ─────────────────────────────────────────*/
function Marquee({ items }) {
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div
        style={{
          display: "flex",
          gap: 32,
          animation: "marquee 28s linear infinite",
          width: "max-content",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 99,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#10b981" }}>
              <Ic.Check />
            </span>
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Scroll-reveal hook ─────────────────────────────────────────────────*/
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   LANDING PAGE
════════════════════════════════════════════════════════════════════════ */
export default function QuizLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Palette: deep indigo base, emerald accent ── */
  const bg = "#07050f";
  const surf = "#0f0a1e";
  const em = "#10b981"; /* emerald accent — single accent rule */
  const emDim = "rgba(16,185,129,0.12)";

  const navLinks = ["Catégories", "Classement", "À propos", "Rejoindre"];

  return (
    <div
      style={{
        background: bg,
        color: "#f1f5f9",
        minHeight: "100dvh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        @keyframes phoneFloat { 0%,100%{transform:translateY(0) rotate(1.5deg)} 50%{transform:translateY(-16px) rotate(-1deg)} }
        @keyframes marquee    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pulse      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
        @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadeIn     { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.25);border-radius:99px}
        ::selection{background:rgba(16,185,129,.3)}
        img{display:block;max-width:100%}
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "0 clamp(20px,4vw,48px)",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: navScrolled ? `rgba(7,5,15,0.92)` : "transparent",
          borderBottom: navScrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "none",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: `linear-gradient(135deg,${em},#059669)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 14px rgba(16,185,129,.35)`,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 22 22"
              fill="none"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 1 L13.5 8 L21 11 L13.5 14 L11 21 L8.5 14 L1 11 L8.5 8 Z" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Scriptura
          </span>
        </div>

        {/* Desktop links */}
        <div
          className="nav-links"
          style={{ display: "flex", alignItems: "center", gap: 32 }}
        >
          {navLinks.slice(0, -1).map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.5)")
              }
            >
              {l}
            </a>
          ))}
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 20px",
              borderRadius: 99,
              background: `linear-gradient(135deg,${em},#059669)`,
              fontFamily: "'Outfit',sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              boxShadow: `0 4px 20px rgba(16,185,129,.3)`,
              transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04) translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 8px 28px rgba(16,185,129,.4)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = `0 4px 20px rgba(16,185,129,.3)`;
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.97)")
            }
          >
            Commencer
            <Ic.ChevR />
          </a>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen((m) => !m)}
          className="burger"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.7)",
            display: "none",
          }}
        >
          <Ic.MenuX />
        </button>

        <style>{`
          @media(max-width:767px){.nav-links{display:none!important}.burger{display:flex!important}}
        `}</style>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            background: "rgba(7,5,15,0.97)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            animation: "fadeIn 0.25s ease",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              fontSize: 24,
            }}
          >
            ✕
          </button>
          {navLinks.map((l) => (
            <a
              key={l}
              href="#"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
              }}
            >
              {l}
            </a>
          ))}
        </div>
      )}

      {/* ── HERO (split-screen, anti-center rule) ───────────────────────── */}
      <section
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          padding: "80px clamp(20px,6vw,80px) 60px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          <style>{`@media(max-width:767px){.hero-grid{grid-template-columns:1fr!important}.phone-col{display:none!important}}`}</style>

          {/* Left — text */}
          <div>
            {/* Pill tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 14px 6px 8px",
                borderRadius: 99,
                background: emDim,
                border: `1px solid rgba(16,185,129,.25)`,
                marginBottom: 28,
                animation: "fadeIn 0.5s 0.1s both",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: em,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic.Lightning />
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#34d399",
                  letterSpacing: "0.02em",
                }}
              >
                12 400 membres actifs ce mois
              </span>
            </div>

            {/* H1 — left-aligned, tracking-tighter */}
            <h1
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: "clamp(36px,5vw,64px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: "#fff",
                marginBottom: 20,
                animation: "fadeIn 0.55s 0.18s both",
              }}
            >
              Testez vos
              <br />
              <span
                style={{
                  background: `linear-gradient(90deg, ${em}, #34d399, ${em})`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shimmer 4s linear infinite",
                }}
              >
                connaissances
              </span>
              <br />
              bibliques.
            </h1>

            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 16,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.7,
                maxWidth: "48ch",
                marginBottom: 36,
                animation: "fadeIn 0.55s 0.26s both",
              }}
            >
              295 questions théocratiques vérifiées par des experts. Six
              catégories, trois niveaux. Apprenez en jouant — chaque erreur
              devient une leçon.
            </p>

            {/* CTA row */}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                animation: "fadeIn 0.55s 0.34s both",
              }}
            >
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  borderRadius: 14,
                  background: `linear-gradient(135deg,${em},#059669)`,
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  boxShadow: `0 6px 28px rgba(16,185,129,.35)`,
                  transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 12px 36px rgba(16,185,129,.45)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = `0 6px 28px rgba(16,185,129,.35)`;
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.97)")
                }
              >
                <span style={{ display: "flex" }}>
                  <Ic.Play />
                </span>
                Commencer gratuitement
              </a>
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 24px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                Voir les catégories
              </a>
            </div>

            {/* Trust badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginTop: 40,
                paddingTop: 32,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                animation: "fadeIn 0.55s 0.42s both",
              }}
            >
              <div style={{ display: "flex" }}>
                {["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#14b8a6"].map(
                  (c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: `${c}30`,
                        border: `2px solid ${bg}`,
                        marginLeft: i ? -8 : 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Outfit',sans-serif",
                          fontSize: 9,
                          fontWeight: 700,
                          color: c,
                        }}
                      >
                        {["EM", "SB", "MO", "TL", "AN"][i]}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Rejoint par{" "}
                <strong style={{ color: "rgba(255,255,255,0.75)" }}>
                  12 400
                </strong>{" "}
                membres cette année
              </span>
            </div>
          </div>

          {/* Right — floating phone */}
          <div
            className="phone-col"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Glow behind */}
            <div
              style={{
                position: "absolute",
                width: 280,
                height: 280,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
            <HomePhoneMockup />
          </div>
        </div>
      </section>

      {/* ── STATS MARQUEE ────────────────────────────────────────────────── */}
      <Reveal>
        <div style={{ padding: "0 0 64px" }}>
          <Marquee
            items={[
              "295 questions vérifiées",
              "6 catégories bibliques",
              "Explications experts",
              "Classement en temps réel",
              "3 niveaux de difficulté",
              "Bonus de rapidité",
              "Aucune inscription requise",
              "Accès mobile optimisé",
            ]}
          />
        </div>
      </Reveal>

      {/* ── STATS ROW ────────────────────────────────────────────────────── */}
      <Reveal>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(20px,4vw,48px) 80px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 2,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              overflow: "hidden",
            }}
            className="stat-grid"
          >
            <style>{`@media(max-width:600px){.stat-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 24px",
                  borderRight:
                    i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: "clamp(26px,3vw,38px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: em,
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── CATEGORIES BENTO ─────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px,4vw,48px) 100px",
        }}
      >
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 99,
                background: emDim,
                border: `1px solid rgba(16,185,129,.2)`,
                marginBottom: 16,
              }}
            >
              <Ic.Book />
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: em,
                }}
              >
                Catégories
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: "clamp(28px,4vw,44px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              Six domaines.
              <br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>
                Un seul objectif.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Bento grid — asymmetric */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "auto auto",
            gap: 12,
          }}
          className="bento-grid"
        >
          <style>{`
            @media(max-width:767px){.bento-grid{grid-template-columns:1fr!important}}
            @media(max-width:767px){.bento-span2{grid-column:span 1!important}}
          `}</style>

          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.07}>
              <SpotCard
                onClick={() =>
                  setActiveCat(activeCat === cat.id ? null : cat.id)
                }
                style={{
                  gridColumn: cat.id === 3 ? "span 2" : "span 1",
                  padding: "28px 24px",
                  height: "100%",
                  outline:
                    activeCat === cat.id
                      ? `1px solid rgba(16,185,129,.5)`
                      : "none",
                  background:
                    activeCat === cat.id
                      ? "rgba(16,185,129,0.06)"
                      : "rgba(255,255,255,0.03)",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  transform: "scale(1)",
                }}
                className={cat.id === 3 ? "bento-span2" : ""}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: emDim,
                      border: `1px solid rgba(16,185,129,.2)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: em,
                    }}
                  >
                    <Ic.Book />
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.3)",
                      background: "rgba(255,255,255,0.05)",
                      padding: "3px 10px",
                      borderRadius: 99,
                    }}
                  >
                    {cat.count} Q
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: cat.id === 3 ? 18 : 15,
                    fontWeight: 700,
                    color: activeCat === cat.id ? em : "#fff",
                    marginBottom: 5,
                    letterSpacing: "-0.02em",
                    transition: "color 0.2s",
                  }}
                >
                  {cat.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.5,
                  }}
                >
                  {cat.sub}
                </p>
                {activeCat === cat.id && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: emDim,
                      border: `1px solid rgba(16,185,129,.2)`,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: em }}>
                      <Ic.Play />
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: em,
                        fontWeight: 500,
                      }}
                    >
                      Commencer cette catégorie
                    </span>
                  </div>
                )}
              </SpotCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── LEADERBOARD ───────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px,4vw,48px) 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
          className="lb-grid"
        >
          <style>{`@media(max-width:767px){.lb-grid{grid-template-columns:1fr!important}}`}</style>

          {/* Left: text */}
          <Reveal>
            <div style={{ paddingTop: 8 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 99,
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  marginBottom: 16,
                }}
              >
                <span style={{ color: "#f59e0b" }}>
                  <Ic.Trophy />
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#f59e0b",
                  }}
                >
                  Classement
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: "clamp(28px,4vw,44px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: 20,
                }}
              >
                Comparez-vous
                <br />
                <span style={{ color: "rgba(255,255,255,0.35)" }}>
                  aux meilleurs.
                </span>
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                  maxWidth: "40ch",
                  marginBottom: 28,
                }}
              >
                Le classement se met à jour en temps réel. Chaque session compte
                — votre rang change à chaque question répondue.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  "Score total",
                  "Temps moyen",
                  "Catégorie",
                  "Hebdomadaire",
                ].map((f) => (
                  <span
                    key={f}
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      padding: "6px 14px",
                      borderRadius: 99,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: leaderboard card */}
          <Reveal delay={0.15}>
            <SpotCard style={{ padding: "4px 0", overflow: "visible" }}>
              {/* Top 3 podium */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr 1fr",
                  gap: 0,
                  padding: "24px 20px 0",
                  alignItems: "end",
                  marginBottom: 16,
                }}
              >
                {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map(
                  (p, col) => {
                    const podiumH = [80, 110, 70][col];
                    const rankLabel = [2, 1, 3][col];
                    return (
                      <div
                        key={p.rank}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Avatar
                          initials={p.avatar}
                          accent={p.accent}
                          size={col === 1 ? 48 : 38}
                        />
                        <span
                          style={{
                            fontFamily: "'Outfit',sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            color: col === 1 ? "#fff" : "rgba(255,255,255,0.6)",
                            textAlign: "center",
                            lineHeight: 1.3,
                          }}
                        >
                          {p.name.split(" ")[0]}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span style={{ color: "#f59e0b", display: "flex" }}>
                            <Ic.Trophy />
                          </span>
                          <span
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 11,
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            {p.pts.toLocaleString()}
                          </span>
                        </div>
                        {/* Podium bar */}
                        <div
                          style={{
                            width: "100%",
                            height: podiumH,
                            borderRadius: "10px 10px 0 0",
                            background:
                              col === 1
                                ? `rgba(245,158,11,0.25)`
                                : "rgba(255,255,255,0.05)",
                            border: `1px solid ${col === 1 ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.07)"}`,
                            borderBottom: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Outfit',sans-serif",
                              fontSize: col === 1 ? 22 : 16,
                              fontWeight: 800,
                              color:
                                col === 1 ? "#fbbf24" : "rgba(255,255,255,0.3)",
                            }}
                          >
                            {rankLabel}
                          </span>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                  marginBottom: 4,
                }}
              />

              {/* Ranks 4–5 */}
              {LEADERBOARD.slice(3).map((p) => (
                <div
                  key={p.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.25)",
                        minWidth: 14,
                        textAlign: "right",
                      }}
                    >
                      {p.rank}
                    </span>
                    <Avatar initials={p.avatar} accent={p.accent} size={30} />
                    <div>
                      <div
                        style={{
                          fontFamily: "'Outfit',sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.3)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Ic.Globe /> {p.loc}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: em,
                      }}
                    >
                      {p.pts.toLocaleString()} pts
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {p.time}
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ padding: "14px 20px", textAlign: "center" }}>
                <a
                  href="#"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    color: em,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  Voir le classement complet <Ic.ChevR />
                </a>
              </div>
            </SpotCard>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES zig-zag ──────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px,4vw,48px) 100px",
        }}
      >
        <Reveal>
          <div style={{ textAlign: "left", marginBottom: 60 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 99,
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                marginBottom: 16,
              }}
            >
              <Ic.Shield />
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#818cf8",
                }}
              >
                Conçu pour progresser
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: "clamp(28px,4vw,44px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              Pas seulement un quiz.
              <br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>
                Une méthode d'étude.
              </span>
            </h2>
          </div>
        </Reveal>

        {[
          {
            title: "Explications vérifiées par des experts",
            body: "Chaque réponse, correcte ou non, dévoile un contexte scripturaire rédigé par des théologiens. Vos erreurs deviennent des leçons durables.",
            tag: "Pédagogie",
            icon: Ic.Book,
          },
          {
            title: "Classement compétitif en temps réel",
            body: "Votre rang se recalcule à chaque session. Comparez vos résultats par catégorie, par semaine, ou sur la totalité de votre parcours.",
            tag: "Motivation",
            icon: Ic.Trophy,
          },
          {
            title: "Trois niveaux, un seul parcours",
            body: "Du débutant au lettré. Progressez à votre rythme — l'algorithme adapte la difficulté à vos réponses passées pour maximiser la rétention.",
            tag: "Progression",
            icon: Ic.Star,
          },
        ].map((f, i) => (
          <Reveal key={i} delay={0.08}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "3fr 2fr" : "2fr 3fr",
                gap: 24,
                marginBottom: 16,
                alignItems: "stretch",
              }}
              className="feat-row"
            >
              <style>{`@media(max-width:767px){.feat-row{grid-template-columns:1fr!important}}`}</style>

              {i % 2 !== 0 && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 20,
                  }}
                  className="feat-visual"
                />
              )}

              <SpotCard style={{ padding: "40px 36px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 12px",
                    borderRadius: 99,
                    background: emDim,
                    border: `1px solid rgba(16,185,129,.2)`,
                    marginBottom: 20,
                  }}
                >
                  <span style={{ color: em }}>
                    <f.icon />
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      color: em,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: "clamp(20px,2.5vw,26px)",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    color: "#fff",
                    marginBottom: 14,
                    lineHeight: 1.2,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 15,
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.7,
                  }}
                >
                  {f.body}
                </p>
              </SpotCard>

              {i % 2 === 0 && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="feat-visual"
                >
                  <div style={{ opacity: 0.2 }}>
                    <f.icon />
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px,4vw,48px) 100px",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: "clamp(24px,3.5vw,38px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#fff",
              marginBottom: 36,
              lineHeight: 1.1,
            }}
          >
            Ce qu'ils disent.
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 16,
          }}
          className="test-grid"
        >
          <style>{`@media(max-width:900px){.test-grid{grid-template-columns:1fr!important}}`}</style>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <SpotCard style={{ padding: "32px 28px", height: "100%" }}>
                <div style={{ marginBottom: 20 }}>
                  <Ic.Quote />
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 15,
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.72,
                    marginBottom: 24,
                    fontStyle: "italic",
                  }}
                >
                  {t.text}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: emDim,
                      border: `1.5px solid rgba(16,185,129,.3)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: em,
                    }}
                  >
                    {t.author
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {t.author}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </SpotCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <Reveal>
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(20px,4vw,48px) 80px",
          }}
        >
          <div
            style={{
              borderRadius: 28,
              padding: "clamp(48px,6vw,80px) clamp(32px,6vw,80px)",
              background: `linear-gradient(135deg, ${surf} 0%, rgba(16,185,129,0.06) 100%)`,
              border: "1px solid rgba(16,185,129,0.2)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "center",
            }}
            className="cta-box"
          >
            <style>{`@media(max-width:600px){.cta-box{grid-template-columns:1fr!important;text-align:center}}`}</style>

            <div>
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: "clamp(26px,3.5vw,42px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: 14,
                }}
              >
                Prêt à éprouver
                <br />
                <span
                  style={{
                    background: `linear-gradient(90deg,${em},#34d399,${em})`,
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmer 4s linear infinite",
                  }}
                >
                  vos connaissances ?
                </span>
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.65,
                }}
              >
                Inscription gratuite. Aucune carte bancaire. Commencez en 30
                secondes.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minWidth: 200,
              }}
            >
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "15px 28px",
                  borderRadius: 14,
                  background: `linear-gradient(135deg,${em},#059669)`,
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  boxShadow: `0 6px 28px rgba(16,185,129,.35)`,
                  transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 12px 36px rgba(16,185,129,.45)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = `0 6px 28px rgba(16,185,129,.35)`;
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.97)")
                }
              >
                <Ic.Play /> Commencer maintenant
              </a>
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 16px",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  borderRadius: 10,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.75)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.4)")
                }
              >
                Voir une démonstration
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px clamp(20px,4vw,48px)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: `linear-gradient(135deg,${em},#059669)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 22 22"
                fill="none"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M11 1 L13.5 8 L21 11 L13.5 14 L11 21 L8.5 14 L1 11 L8.5 8 Z" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Scriptura
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["Confidentialité", "Conditions", "Contact", "À propos"].map(
              (l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.3)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = "rgba(255,255,255,0.7)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(255,255,255,0.3)")
                  }
                >
                  {l}
                </a>
              ),
            )}
          </div>
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.2)",
            }}
          >
            © 2026 Scriptura · Tous droits réservés
          </span>
        </div>
      </footer>
    </div>
  );
}
