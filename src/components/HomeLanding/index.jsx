import { useState, useEffect, useRef } from "react";
import { getFirestore } from "firebase/firestore";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import HomePhoneMockup from "../HomePhoneMockup";
import useCollection from "../../utils/hooks/useCollection";
import { Ic } from "../ui/Icons";
import Logo from "../ui/Logo";
import SpotCard from "../ui/SpotCard";

/* ─── Data ────────────────────────────────────────────────────────────────*/
const CATEGORIES = [
  {
    id: 1,
    title: "Difficulté",
    slug: "difficulty",
    sub: "Facile, moyen ou difficile",
    count: 3,
    col: "span 1",
    icon: Ic.Target,
  },
  {
    id: 2,
    title: "Livres",
    slug: "books",
    sub: "De la Genèse à la Révélation",
    count: 66,
    col: "span 1",
    icon: Ic.Book,
  },
  {
    id: 3,
    title: "Personnages",
    slug: "characters",
    sub: "D'Adam & Eve à Jean",
    count: 16,
    col: "span 1",
    icon: Ic.Users,
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
    text: "Une façon amusante d'améliorer ses connaissances bibliques !",
    author: "Alpha Mobe",
    role: "Paris",
  },
  {
    text: "Un site moderne, bien conçu, agréable à utiliser.",
    author: "Armand Mobe",
    role: "Yvelines",
  },
  {
    text: "Une manière ludique de renforcer sa foi et son savoir.",
    author: "Jean-Marc Charpentier",
    role: "Yvelines",
  },
];

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
export default function QuizLanding({ firebaseApp }) {
  const [user] = useAuthState(auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(null);

  /* ── Palette: deep indigo base, emerald accent ── */
  const bg = "#07050f";
  const surf = "#0f0a1e";
  const em = "#10b981"; /* emerald accent — single accent rule */
  const emDim = "rgba(16,185,129,0.12)";

  const db = firebaseApp ? getFirestore(firebaseApp) : null;

  const { data: totalQuestions } = useCollection(db, "questions");
  const { data: totalUsers } = useCollection(db, "users");
  const { data: totalQuizzes } = useCollection(db, "quizzes");

  const STATS = [
    { val: totalQuestions.length, label: "Questions" },
    { val: totalUsers.length, label: "Utilisateurs" },
    { val: totalQuizzes.length, label: "Quiz" },
  ];

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
            {/* <div
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
            </div> */}
            <Logo width={60} height={60} />
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
              {totalQuestions.length} questions bibliques. 3 catégories, 3
              niveaux de difficulté.
              <br /> Apprenez en jouant — chaque erreur devient une leçon.
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
              `${totalQuestions.length} questions`,
              "66 livres bibliques",
              "Explications aux réponses",
              "Quiz réalisés sauvegardés",
              "3 niveaux de difficulté",
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
              gridTemplateColumns: "repeat(3,1fr)",
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
            <div style={{ display: "flex", justifyContent: "center" }}>
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
                  Types
                </span>
              </div>
            </div>
            <h2
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: "clamp(28px,4vw,44px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#fff",
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              Trois types de quiz.
              <br />
              <span
                style={{ color: "rgba(255,255,255,0.35)", textAlign: "center" }}
              >
                Un seul objectif.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Bento grid — asymmetric */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
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
              <Link to={`/quiz/${cat.slug}`}>
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
                      <cat.icon />
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
                      {cat.count} Quiz
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
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── LEADERBOARD ───────────────────────────────────────────────────── */}
      {/* <section
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
                  "Temps medium",
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

          <Reveal delay={0.15}>
            <SpotCard style={{ padding: "4px 0", overflow: "visible" }}>
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

              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                  marginBottom: 4,
                }}
              />
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
      </section> */}

      {/* ── FEATURES zig-zag ──────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px,4vw,48px) 100px",
        }}
      >
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
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
                  justifyContent: "center",
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
                    textAlign: "center",
                  }}
                >
                  Conçu pour progresser
                </span>
              </div>
            </div>
            <h2
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: "clamp(28px,4vw,44px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#fff",
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              Pas seulement des quiz.
              <br />
              <span
                style={{ color: "rgba(255,255,255,0.35)", textAlign: "center" }}
              >
                Une méthode d'étude.
              </span>
            </h2>
          </div>
        </Reveal>

        {[
          {
            title: "Des quiz divers et variés",
            body: "Vous pouvez choisir un quiz en fonction de sa difficulté, d'un livre de la Bible ou d'un personnage biblique",
            tag: "Pédagogie",
            icon: Ic.Book,
          },
          {
            title: "Sauvegarde de votre progression",
            body: "En jouant en étant connecté, votre progression dans les quiz est sauvegardée et vous pouvez reprendre aux quiz pas encore réalisés",
            tag: "Motivation",
            icon: Ic.Trophy,
          },
          {
            title: "Un mode multijoueur",
            body: "Vous pouvez faire des parties en direct avec un ou plusieurs amis afin de vous défier tout en vous amusant (bientôt)",
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
              textAlign: "center",
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
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
                Prêt à tester
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
                Toutes les fonctionnalités du site sont gratuites et prêtes à
                être utilisées
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
                <Ic.Play /> Jouer maintenant
              </a>
              {!user && (
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
                  Se connecter
                </a>
              )}
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
