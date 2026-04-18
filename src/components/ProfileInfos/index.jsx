"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, where } from "firebase/firestore";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import { auth, db } from "../../config/firebase";
import T from "../ui/DesignTokens";
import inputStyle from "../ui/Input";
import { Ic } from "../ui/Icons";
import UserAvatar from "../../components/ui/UserAvatar";
import useCollection from "../../utils/hooks/useCollection";
import userTimestampToDate from "../../utils/functions/userTimestampToDate";

/* ─── Mock user data (replace with Firebase) ───────────────────────────────*/
const MOCK_USER = {
  id: "usr_e92bf4a1",
  displayName: "Élise Moreau",
  email: "elise.moreau@exemple.fr",
  location: "Paris, France",
  bio: "Passionnée d'études bibliques depuis 12 ans. Membre active de la communauté depuis le premier jour.",
  avatarColor: "#10b981",
  role: "Érudit confirmé",
  createdAt: new Date("2024-01-14"),
  lastLoginAt: new Date(Date.now() - 1000 * 60 * 47),
  totalScore: 38_410,
  rank: 1,
  rankDelta: +3,
  quizzesCompleted: 147,
  quizzesSucceeded: 128,
  streak: 19,
  avgTimePerQuestion: 14.3,
  totalAnswers: 2_204,
  correctAnswers: 1_891,
  favoriteCategories: [
    { name: "Évangiles", score: 9_240, pct: 94 },
    { name: "Prophètes", score: 8_105, pct: 87 },
    { name: "Torah & Loi", score: 7_630, pct: 82 },
    { name: "Psaumes", score: 6_890, pct: 79 },
    { name: "Épîtres", score: 4_320, pct: 71 },
  ],
  recentQuizzes: [
    {
      id: "s1",
      category: "Évangiles",
      score: 290,
      maxScore: 300,
      date: new Date(Date.now() - 3_600_000),
      passed: true,
    },
    {
      id: "s2",
      category: "Prophètes",
      score: 240,
      maxScore: 300,
      date: new Date(Date.now() - 86_400_000),
      passed: true,
    },
    {
      id: "s3",
      category: "Torah & Loi",
      score: 170,
      maxScore: 300,
      date: new Date(Date.now() - 172_800_000),
      passed: false,
    },
    {
      id: "s4",
      category: "Psaumes",
      score: 280,
      maxScore: 300,
      date: new Date(Date.now() - 259_200_000),
      passed: true,
    },
    {
      id: "s5",
      category: "Épîtres",
      score: 210,
      maxScore: 300,
      date: new Date(Date.now() - 345_600_000),
      passed: true,
    },
  ],
  activity: Array.from({ length: 52 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const rand = Math.random();
      if (w > 46) return rand > 0.3 ? Math.floor(rand * 5 + 1) : 0;
      return rand > 0.55 ? Math.floor(rand * 4 + 1) : 0;
    }),
  ),
};

const ACHIEVEMENTS = [
  {
    id: "a1",
    title: "Premier pas",
    desc: "Terminer son premier quiz",
    unlocked: true,
    color: T.em,
    icon: Ic.Book,
  },
  {
    id: "a2",
    title: "Série de 7",
    desc: "7 jours consécutifs de jeu",
    unlocked: true,
    color: T.warn,
    icon: Ic.Fire,
  },
  {
    id: "a3",
    title: "Centurion",
    desc: "100 quiz complétés",
    unlocked: true,
    color: T.em,
    icon: Ic.Trophy,
  },
  {
    id: "a4",
    title: "Foudre divine",
    desc: "Répondre en moins de 5s 10 fois",
    unlocked: true,
    color: "#f97316",
    icon: Ic.Lightning,
  },
  {
    id: "a5",
    title: "Parfait",
    desc: "Score 100% sur un quiz",
    unlocked: true,
    color: "#ec4899",
    icon: Ic.Star,
  },
  {
    id: "a6",
    title: "Érudit des Évangiles",
    desc: "Maîtriser la catégorie Évangiles",
    unlocked: true,
    color: T.info,
    icon: Ic.Shield,
  },
  {
    id: "a7",
    title: "Série de 30",
    desc: "30 jours consécutifs de jeu",
    unlocked: false,
    color: T.warn,
    icon: Ic.Fire,
  },
  {
    id: "a8",
    title: "Sage des prophètes",
    desc: "Maîtriser la catégorie Prophètes",
    unlocked: false,
    color: "#14b8a6",
    icon: Ic.Target,
  },
  {
    id: "a9",
    title: "Champion",
    desc: "Atteindre le rang 1 mondial",
    unlocked: false,
    color: T.warn,
    icon: Ic.Trophy,
  },
  {
    id: "a10",
    title: "500 quiz",
    desc: "500 sessions complétées",
    unlocked: false,
    color: T.em,
    icon: Ic.Medal,
  },
  {
    id: "a11",
    title: "Maître du temps",
    desc: "Moy. < 10s par question (50 quiz)",
    unlocked: false,
    color: T.info,
    icon: Ic.Clock,
  },
  {
    id: "a12",
    title: "Toutes catégories",
    desc: "Score 90%+ dans les 6 catégories",
    unlocked: false,
    color: "#ec4899",
    icon: Ic.Globe,
  },
];

/* ─── Helpers ──────────────────────────────────────────────────────────────*/
const fmt = {
  date: (d) =>
    d?.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  rel: (d) => {
    const s = Math.floor((Date.now() - d) / 1000);
    if (s < 60) return "à l'instant";
    if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
    if (s < 86400) return `il y a ${Math.floor(s / 3600)}h`;
    return fmt.date(d);
  },
  num: (n) => n?.toLocaleString("fr-FR"),
  pct: (a, b) => (b ? Math.round((a / b) * 100) : 0),
};

/* ─── Animated counter ─────────────────────────────────────────────────────*/
function Counter({ to, duration = 1400, suffix = "" }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * to));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration]);
  return (
    <>
      {val.toLocaleString("fr-FR")}
      {suffix}
    </>
  );
}

/* ─── Skeleton shimmer ─────────────────────────────────────────────────────*/
function Sk({ w = "100%", h = 14, r = 8 }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background:
          "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
    />
  );
}

/* ─── Scroll reveal ────────────────────────────────────────────────────────*/
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(22px)",
        transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Spotlight card ───────────────────────────────────────────────────────*/
function SpotCard({ children, style = {} }) {
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
      style={{
        position: "relative",
        overflow: "hidden",
        background: T.surf,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
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
            "radial-gradient(180px at var(--mx,50%) var(--my,50%), rgba(16,185,129,0.06), transparent 80%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ─── Activity heatmap ─────────────────────────────────────────────────────*/
function ActivityHeatmap({ weeks }) {
  const maxVal = 4;
  const em = T.em;
  const months = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const now = new Date();
  const startMonth = new Date(now);
  startMonth.setDate(startMonth.getDate() - 52 * 7);
  const monthLabels = [];
  for (let m = 0; m < 12; m++) {
    const d = new Date(startMonth);
    d.setMonth(startMonth.getMonth() + m);
    monthLabels.push({
      label: months[d.getMonth()],
      col: Math.floor(m * (52 / 12)),
    });
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 600 }}>
        {/* Month labels */}
        <div
          style={{ display: "flex", gap: 3, marginBottom: 6, paddingLeft: 0 }}
        >
          {weeks.map((_, wi) => {
            const ml = monthLabels.find((m) => m.col === wi);
            return (
              <div
                key={wi}
                style={{
                  width: 11,
                  flexShrink: 0,
                  fontFamily: T.mono,
                  fontSize: 9,
                  color: ml ? "rgba(255,255,255,0.28)" : "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {ml?.label || ""}
              </div>
            );
          })}
        </div>
        {/* Grid */}
        <div style={{ display: "flex", gap: 3 }}>
          {weeks.map((week, wi) => (
            <div
              key={wi}
              style={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {week.map((val, di) => {
                const intensity = val === 0 ? 0 : Math.min(val / maxVal, 1);
                const bg =
                  val === 0
                    ? "rgba(255,255,255,0.05)"
                    : `rgba(16,185,129,${0.15 + intensity * 0.75})`;
                return (
                  <div
                    key={di}
                    title={val ? `${val} quiz` : "Aucun"}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 3,
                      background: bg,
                      transition: "transform 0.15s",
                      cursor: val ? "pointer" : "default",
                    }}
                    onMouseEnter={(e) => {
                      if (val) e.currentTarget.style.transform = "scale(1.4)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Moins
          </span>
          {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background:
                  v === 0
                    ? "rgba(255,255,255,0.05)"
                    : `rgba(16,185,129,${0.15 + v * 0.75})`,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Plus
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Radial score ring ────────────────────────────────────────────────────*/
function ScoreRing({ pct, size = 80, color = T.em, label }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: T.mono,
            fontSize: size * 0.2,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {pct}%
        </span>
        {label && (
          <span
            style={{
              fontFamily: T.sans,
              fontSize: 9,
              color: T.muted,
              marginTop: 2,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Achievement badge ────────────────────────────────────────────────────*/
function AchievementBadge({ a, index }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        padding: "18px 16px",
        borderRadius: 16,
        background: a.unlocked
          ? hov
            ? `${a.color}15`
            : T.emDim
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${a.unlocked ? (hov ? `${a.color}50` : `${a.color}25`) : T.border}`,
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        transform: hov && a.unlocked ? "translateY(-3px)" : "none",
        opacity: a.unlocked ? 1 : 0.45,
        cursor: "default",
        animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 0.05}s both`,
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: a.unlocked ? `${a.color}20` : "rgba(255,255,255,0.04)",
          border: `1px solid ${a.unlocked ? `${a.color}35` : T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: a.unlocked ? a.color : "rgba(255,255,255,0.2)",
          marginBottom: 12,
        }}
      >
        {a.unlocked ? <a.icon /> : <Ic.Lock />}
      </div>
      <div
        style={{
          fontFamily: T.sans,
          fontSize: 12,
          fontWeight: 700,
          color: a.unlocked ? T.text : "rgba(255,255,255,0.35)",
          marginBottom: 4,
          letterSpacing: "-0.01em",
        }}
      >
        {a.title}
      </div>
      <div
        style={{
          fontFamily: T.sans,
          fontSize: 11,
          color: T.muted,
          lineHeight: 1.45,
        }}
      >
        {a.desc}
      </div>
      {a.unlocked && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: `${a.color}20`,
            border: `1px solid ${a.color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: a.color,
          }}
        >
          <Ic.Check />
        </div>
      )}
    </div>
  );
}

/* ─── Loading skeleton ─────────────────────────────────────────────────────*/
function ProfileSkeleton() {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "80px 0",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}
      >
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
          }}
        >
          <Sk w={96} h={96} r={99} />
          <Sk w="70%" h={18} r={8} />
          <Sk w="55%" h={12} r={6} />
          <Sk w="100%" h={40} r={10} />
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: T.surf,
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                padding: 24,
              }}
            >
              <Sk h={28} w="55%" style={{ marginBottom: 8 }} />
              <Sk h={12} w="70%" />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: 24,
            height: 200,
          }}
        >
          <Sk h={12} w="40%" style={{ marginBottom: 16 }} />
          {[0, 1, 2, 3].map((i) => (
            <Sk key={i} h={8} r={4} style={{ marginBottom: 12 }} />
          ))}
        </div>
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: 24,
            height: 200,
          }}
        >
          <Sk h={12} w="40%" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function ProfileInfos({ firebaseApp }) {
  const [userS] = useAuthState(auth);
  const [user, setUser] = useState();
  const db = firebaseApp ? getFirestore(firebaseApp) : null;
  const { data: userFromDatabase } = useCollection(db, "users", [
    where("id", "==", userS?.uid),
  ]);
  console.log("userFromDatabase : ", userFromDatabase);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("history"); // "history" | "achievements"

  useEffect(() => {
    // Simulate Firebase fetch
    const t = setTimeout(() => {
      setUser(MOCK_USER);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, [user?.uid]);

  const overallPct = user ? fmt.pct(user.correctAnswers, user.totalAnswers) : 0;
  const successPct = user
    ? fmt.pct(user.quizzesSucceeded, user.quizzesCompleted)
    : 0;
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <div style={{ background: T.bg, minHeight: "100dvh", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes haloRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.2);border-radius:99px}
        ::selection{background:rgba(16,185,129,.3)}
      `}</style>

      {/* Fixed ambient glow — performance guard */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          borderRadius: "0 0 50% 50%",
          background:
            "radial-gradient(ellipse,rgba(16,185,129,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 0",
          }}
        >
          {/* ── SECTION 1: HERO ──────────────────────────────────────────────*/}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: 20,
              marginBottom: 20,
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <style>{`
              @media(max-width:767px){ .hero-grid{grid-template-columns:1fr!important} .kpi-grid{grid-template-columns:1fr 1fr!important} }
              @media(max-width:480px){ .kpi-grid{grid-template-columns:1fr!important} }
            `}</style>

            {/* Left: Identity card */}
            <SpotCard style={{ padding: "28px 24px", textAlign: "center" }}>
              {/* Avatar with halo */}
              <div
                style={{
                  position: "relative",
                  width: 96,
                  height: 96,
                  margin: "0 auto 16px",
                }}
              >
                {/* Avatar circle */}
                <UserAvatar userId={userS?.uid} width={96} height={96} />
                {/* Online dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: T.em,
                    border: `2px solid ${T.bg}`,
                    animation: "pulse 2.5s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Name & role */}
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 20,
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-0.03em",
                  marginBottom: 4,
                }}
              >
                {userS?.displayName}
              </div>
              {/* <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 99,
                  background: T.emDim,
                  border: `1px solid ${T.emBrd}`,
                  fontFamily: T.sans,
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.em,
                  marginBottom: 12,
                }}
              >
                <Ic.Shield /> {user.role}
              </div> */}

              {/* Bio */}
              <p
                style={{
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: T.muted,
                  lineHeight: 1.65,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                {userFromDatabase[0]?.description}
              </p>

              {/* Meta info — divide-y (anti-card-overuse Rule 4) */}
              <div
                style={{
                  borderTop: `1px solid ${T.border}`,
                  paddingTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                {[
                  { icon: Ic.Globe, label: user.location },
                  {
                    icon: Ic.Calendar,
                    label: `Membre depuis le ${userFromDatabase.length > 0 && format(new Date(userFromDatabase[0]?.createdAt?.seconds * 1000), "dd/MM/yyyy")}`,
                  },
                  {
                    icon: Ic.Clock,
                    label: `Vu il y a ${
                      userFromDatabase.length > 0 &&
                      formatDistanceToNow(
                        new Date(userFromDatabase[0]?.lastSeen?.seconds * 1000),
                        { locale: fr },
                      )
                    }`,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "9px 0",
                      borderBottom: i < 2 ? `1px solid ${T.border}` : "none",
                    }}
                  >
                    <span
                      style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}
                    >
                      <item.icon />
                    </span>
                    <span
                      style={{
                        fontFamily: T.sans,
                        fontSize: 12,
                        color: T.muted,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ID */}
              <div
                style={{
                  marginTop: 14,
                  padding: "7px 10px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${T.border}`,
                }}
              >
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {userFromDatabase[0]?.id}
                </span>
              </div>
            </SpotCard>

            {/* Right: KPI Bento (asymmetric 2×2 + streak spanning) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gridTemplateRows: "auto auto",
                gap: 12,
                alignItems: "stretch",
              }}
              className="kpi-grid"
            >
              {/* Score total — spans 2 rows left */}
              <SpotCard
                style={{
                  gridRow: "span 2",
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.35)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 12,
                    }}
                  >
                    Score total
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: "clamp(28px,3vw,42px)",
                      fontWeight: 800,
                      color: T.warn,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    <Counter to={user.totalScore} duration={1600} />
                  </div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 12,
                      color: T.muted,
                      marginTop: 6,
                    }}
                  >
                    points accumulés
                  </div>
                </div>
                <div style={{ marginTop: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: T.sans,
                        fontSize: 12,
                        color: T.muted,
                      }}
                    >
                      Rang mondial
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 8px",
                        borderRadius: 99,
                        background:
                          user.rankDelta > 0 ? T.emDim : "rgba(239,68,68,0.1)",
                        border: `1px solid ${user.rankDelta > 0 ? T.emBrd : "rgba(239,68,68,0.25)"}`,
                        color: user.rankDelta > 0 ? T.em : T.err,
                      }}
                    >
                      {user.rankDelta > 0 ? <Ic.ArrowUp /> : <Ic.ArrowDn />}
                      <span style={{ fontFamily: T.mono, fontSize: 10 }}>
                        {Math.abs(user.rankDelta)}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 32,
                      fontWeight: 800,
                      color: T.em,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    #{user.rank}
                  </div>
                </div>
              </SpotCard>

              {/* Quiz réussis */}
              <SpotCard style={{ padding: "20px 20px" }}>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 10,
                  }}
                >
                  Quiz réussis
                </div>
                <div
                  style={{ display: "flex", alignItems: "flex-end", gap: 10 }}
                >
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 30,
                      fontWeight: 800,
                      color: T.em,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    <Counter to={user.quizzesSucceeded} duration={1200} />
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.28)",
                      marginBottom: 2,
                    }}
                  >
                    / {user.quizzesCompleted}
                  </div>
                </div>
                <div
                  style={{
                    height: 4,
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 99,
                    marginTop: 10,
                  }}
                >
                  <div
                    style={{
                      width: `${successPct}%`,
                      height: "100%",
                      background: `linear-gradient(90deg,${T.em},#34d399)`,
                      borderRadius: 99,
                      transition: "width 1s cubic-bezier(0.16,1,0.3,1) 0.4s",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 11,
                    color: T.muted,
                    marginTop: 5,
                  }}
                >
                  {successPct}% de réussite
                </div>
              </SpotCard>

              {/* Streak */}
              <SpotCard style={{ padding: "20px 20px" }}>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 10,
                  }}
                >
                  Série active
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      color: "#f97316",
                      animation:
                        user.streak >= 7
                          ? "pulse 2s ease-in-out infinite"
                          : "none",
                    }}
                  >
                    <Ic.Fire />
                  </span>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 30,
                      fontWeight: 800,
                      color: "#f97316",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    <Counter to={user.streak} duration={1000} />
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 12,
                    color: T.muted,
                    marginTop: 6,
                  }}
                >
                  jours consécutifs
                </div>
              </SpotCard>

              {/* Taux de réussite global */}
              <SpotCard style={{ padding: "20px 20px" }}>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 10,
                  }}
                >
                  Précision globale
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <ScoreRing pct={overallPct} size={64} color={T.em} />
                  <div>
                    <div
                      style={{ fontFamily: T.mono, fontSize: 12, color: T.em }}
                    >
                      {fmt.num(user.correctAnswers)}
                    </div>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 11,
                        color: T.muted,
                      }}
                    >
                      bonnes / {fmt.num(user.totalAnswers)}
                    </div>
                    <div
                      style={{
                        fontFamily: T.mono,
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                        marginTop: 4,
                      }}
                    >
                      ~{user.avgTimePerQuestion}s moy.
                    </div>
                  </div>
                </div>
              </SpotCard>
            </div>
          </div>

          {/* ── SECTION 2: ACTIVITY + CATEGORIES ─────────────────────────────*/}
          <Reveal delay={0.1}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 320px",
                gap: 20,
                marginBottom: 20,
              }}
              className="mid-grid"
            >
              <style>{`@media(max-width:767px){.mid-grid{grid-template-columns:1fr!important}}`}</style>

              {/* Activity heatmap */}
              <SpotCard style={{ padding: "24px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 14,
                        fontWeight: 700,
                        color: T.text,
                        letterSpacing: "-0.015em",
                        marginBottom: 2,
                      }}
                    >
                      Activité
                    </div>
                    <div
                      style={{
                        fontFamily: T.mono,
                        fontSize: 11,
                        color: T.muted,
                      }}
                    >
                      {user.activity.flat().filter((v) => v > 0).length} jours
                      actifs · 52 semaines
                    </div>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 10px",
                      borderRadius: 99,
                      background: T.emDim,
                      border: `1px solid ${T.emBrd}`,
                      fontFamily: T.mono,
                      fontSize: 10,
                      color: T.em,
                    }}
                  >
                    <Ic.Lightning /> {user.streak} j.
                  </div>
                </div>
                <ActivityHeatmap weeks={user.activity} />
              </SpotCard>

              {/* Favorite categories */}
              <SpotCard style={{ padding: "24px 22px" }}>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.text,
                    letterSpacing: "-0.015em",
                    marginBottom: 18,
                  }}
                >
                  Catégories favorites
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 0 }}
                >
                  {user.favoriteCategories.map((cat, i) => (
                    <div
                      key={cat.name}
                      style={{
                        padding: "11px 0",
                        borderBottom:
                          i < user.favoriteCategories.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                          }}
                        >
                          <span style={{ color: T.em }}>
                            <Ic.Book />
                          </span>
                          <span
                            style={{
                              fontFamily: T.sans,
                              fontSize: 13,
                              color: T.text,
                              fontWeight: 500,
                            }}
                          >
                            {cat.name}
                          </span>
                        </div>
                        <div
                          style={{ display: "flex", items: "center", gap: 8 }}
                        >
                          <span
                            style={{
                              fontFamily: T.mono,
                              fontSize: 10,
                              color: T.em,
                            }}
                          >
                            {cat.pct}%
                          </span>
                          <span
                            style={{
                              fontFamily: T.mono,
                              fontSize: 10,
                              color: "rgba(255,255,255,0.25)",
                            }}
                          >
                            {fmt.num(cat.score)} pts
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          height: 3,
                          background: "rgba(255,255,255,0.07)",
                          borderRadius: 99,
                        }}
                      >
                        <div
                          style={{
                            width: `${cat.pct}%`,
                            height: "100%",
                            background: `linear-gradient(90deg,${T.em},#34d399)`,
                            borderRadius: 99,
                            transition:
                              "width 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SpotCard>
            </div>
          </Reveal>

          {/* ── SECTION 3: TABS — HISTORY / ACHIEVEMENTS ─────────────────────*/}
          <Reveal delay={0.18}>
            {/* Tab bar */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 16,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: 4,
                width: "fit-content",
              }}
            >
              {[
                { id: "history", label: "Historique des quiz" },
                {
                  id: "achievements",
                  label: `Réalisations (${unlockedCount}/${ACHIEVEMENTS.length})`,
                },
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "9px 18px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: active ? T.emDim : "transparent",
                      outline: active ? `1px solid ${T.emBrd}` : "none",
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? T.em : T.muted,
                      transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.97)")
                    }
                    onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* History tab */}
            {activeTab === "history" && (
              <SpotCard style={{ overflow: "hidden" }}>
                {/* Table header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 120px 100px 100px 80px",
                    padding: "11px 22px",
                    borderBottom: `1px solid ${T.border}`,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {["Catégorie", "Score", "Précision", "Date", "Statut"].map(
                    (h) => (
                      <div
                        key={h}
                        style={{
                          fontFamily: T.sans,
                          fontSize: 11,
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {h}
                      </div>
                    ),
                  )}
                </div>
                {user.recentQuizzes.map((q, i) => {
                  const pct = fmt.pct(q.score, q.maxScore);
                  return (
                    <div
                      key={q.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 120px 100px 100px 80px",
                        padding: "14px 22px",
                        borderBottom:
                          i < user.recentQuizzes.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                        alignItems: "center",
                        transition: "background 0.15s",
                        animation: `fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both`,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: T.emDim,
                            border: `1px solid ${T.emBrd}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: T.em,
                            flexShrink: 0,
                          }}
                        >
                          <Ic.Book />
                        </div>
                        <span
                          style={{
                            fontFamily: T.sans,
                            fontSize: 14,
                            fontWeight: 500,
                            color: T.text,
                          }}
                        >
                          {q.category}
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: T.mono,
                          fontSize: 13,
                          fontWeight: 700,
                          color: T.warn,
                        }}
                      >
                        {q.score}{" "}
                        <span
                          style={{
                            color: "rgba(255,255,255,0.2)",
                            fontWeight: 400,
                          }}
                        >
                          / {q.maxScore}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 3,
                            background: "rgba(255,255,255,0.07)",
                            borderRadius: 99,
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background:
                                pct >= 80 ? T.em : pct >= 60 ? T.warn : T.err,
                              borderRadius: 99,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: T.mono,
                            fontSize: 11,
                            color:
                              pct >= 80 ? T.em : pct >= 60 ? T.warn : T.err,
                          }}
                        >
                          {pct}%
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: T.mono,
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        {fmt.rel(q.date)}
                      </div>

                      <div>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 9px",
                            borderRadius: 99,
                            background: q.passed
                              ? T.emDim
                              : "rgba(239,68,68,0.1)",
                            border: `1px solid ${q.passed ? T.emBrd : "rgba(239,68,68,0.25)"}`,
                            fontFamily: T.mono,
                            fontSize: 10,
                            color: q.passed ? T.em : T.err,
                          }}
                        >
                          {q.passed ? <Ic.Check /> : null}
                          {q.passed ? "Réussi" : "Échoué"}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div
                  style={{
                    padding: "14px 22px",
                    borderTop: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}
                  >
                    Affichage des 5 derniers quiz
                  </span>
                  <button
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontFamily: T.sans,
                      fontSize: 12,
                      color: T.em,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Voir tout l'historique <Ic.ChevR />
                  </button>
                </div>
              </SpotCard>
            )}

            {/* Achievements tab */}
            {activeTab === "achievements" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: T.emDim,
                    border: `1px solid ${T.emBrd}`,
                    width: "fit-content",
                  }}
                >
                  <Ic.Trophy />
                  <span
                    style={{
                      fontFamily: T.sans,
                      fontSize: 13,
                      color: T.em,
                      fontWeight: 600,
                    }}
                  >
                    {unlockedCount} réalisations débloquées sur{" "}
                    {ACHIEVEMENTS.length}
                  </span>
                  <div style={{ height: 14, width: 1, background: T.emBrd }} />
                  <div
                    style={{
                      width: 80,
                      height: 4,
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 99,
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%`,
                        height: "100%",
                        background: `linear-gradient(90deg,${T.em},#34d399)`,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                  <span
                    style={{ fontFamily: T.mono, fontSize: 11, color: T.em }}
                  >
                    {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
                    gap: 12,
                  }}
                >
                  {ACHIEVEMENTS.map((a, i) => (
                    <AchievementBadge key={a.id} a={a} index={i} />
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      )}
    </div>
  );
}
