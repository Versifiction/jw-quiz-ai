"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Inline SVG icons — strokeWidth 1.5 — zero emojis ──────────────────*/
const Ic = {
  Check: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="26"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m40 128 72 72L216 56" />
    </svg>
  ),
  X: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="26"
      strokeLinecap="round"
    >
      <path d="M200 56 56 200M56 56l144 144" />
    </svg>
  ),
  ArrowR: () => (
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
  Refresh: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M176 48h48v48" />
      <path d="M224 48A104 104 0 0 0 56 56.8" />
      <path d="M80 208H32v-48" />
      <path d="M32 208a104 104 0 0 0 168-8.8" />
    </svg>
  ),
  Trophy: () => (
    <svg
      width="14"
      height="14"
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
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
      <path d="m213.85 125.46-112 120a8 8 0 0 1-13.69-7l14.66-76.34-57.6-21.74a8 8 0 0 1-2.47-13.18l112-120a8 8 0 0 1 13.69 7l-14.66 76.34 57.6 21.74a8 8 0 0 1 2.47 13.18Z" />
    </svg>
  ),
  Book: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M48 80a96 96 0 0 1 80-16 96 96 0 0 1 80 16v128a96 96 0 0 0-80-16 96 96 0 0 0-80 16Z" />
      <path d="M128 64v176" />
    </svg>
  ),
  Star: () => (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
      <path d="m234.5 114.38-45.1 39.36 13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31-51 31a16 16 0 0 1-23.84-17.34l13.49-58.54-45.11-39.42a16 16 0 0 1 9.12-28.06l59.46-5.15 23.21-55.36a15.95 15.95 0 0 1 29.44 0L166 81.17l59.44 5.15a16 16 0 0 1 9.11 28.06Z" />
    </svg>
  ),
  Skip: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M48 208V48l128 80L48 208Z" />
      <path d="M208 48v160" />
    </svg>
  ),
  Info: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
    >
      <circle cx="128" cy="128" r="104" />
      <path d="M128 120v56" />
      <circle cx="128" cy="88" r="4" fill="currentColor" />
    </svg>
  ),
  Home: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M208 222H48a8 8 0 0 1-8-8v-96l88-80 88 80v96a8 8 0 0 1-8 8Z" />
      <path d="M104 222v-88h48v88" />
    </svg>
  ),
};

/* ─── Design tokens — exact match with landing page ──────────────────────*/
const T = {
  bg: "#07050f",
  surf: "#0f0a1e",
  em: "#10b981",
  emDim: "rgba(16,185,129,0.10)",
  emBrd: "rgba(16,185,129,0.25)",
  err: "#ef4444",
  errDim: "rgba(239,68,68,0.10)",
  errBrd: "rgba(239,68,68,0.25)",
  text: "#f1f5f9",
  muted: "rgba(241,245,249,0.45)",
  border: "rgba(255,255,255,0.08)",
  gold: "#f59e0b",
};

/* ─── Sample questions (replace with Firebase) ───────────────────────────*/
const SAMPLE_QUESTIONS = [
  {
    id: "q1",
    category: "Évangiles",
    difficulty: "easy",
    points: 10,
    text: "Quel livre de la Bible rapporte le Sermon sur la montagne ?",
    options: ["Marc", "Luc", "Matthieu", "Jean"],
    correctIndex: 2,
    explanation:
      "Le Sermon sur la montagne est rapporté dans Matthieu chapitres 5 à 7. C'est l'un des discours les plus longs de Jésus, incluant les Béatitudes et le Notre Père.",
  },
  {
    id: "q2",
    category: "Torah",
    difficulty: "medium",
    points: 20,
    text: "Combien de livres compte la Bible hébraïque, également appelée Tanakh ?",
    options: ["24", "27", "39", "66"],
    correctIndex: 0,
    explanation:
      "Le Tanakh comprend 24 livres regroupés en trois sections : Torah (5), Nevi'im (8) et Ketouvim (11). Le canon chrétien protestant en dénombre 39 car certains livres y sont divisés.",
  },
  {
    id: "q3",
    category: "Prophètes",
    difficulty: "easy",
    points: 10,
    text: "Quel prophète fut envoyé par Dieu à Ninive pour appeler ses habitants à la repentance ?",
    options: ["Élie", "Jonas", "Amos", "Michée"],
    correctIndex: 1,
    explanation:
      "Jonas reçut la mission d'aller à Ninive. Après sa réticence initiale et son séjour dans le ventre d'un grand poisson, il accomplit finalement sa mission avec succès.",
  },
  {
    id: "q4",
    category: "Psaumes",
    difficulty: "hard",
    points: 30,
    text: "Quel psaume commence par les mots « Que le Seigneur te réponde au jour de la détresse » ?",
    options: ["Psaume 20", "Psaume 22", "Psaume 46", "Psaume 91"],
    correctIndex: 0,
    explanation:
      "Le Psaume 20 est une prière pour le roi avant la bataille. Son premier verset affirme la confiance en la protection divine face à toute adversité.",
  },
  {
    id: "q5",
    category: "Épîtres",
    difficulty: "medium",
    points: 20,
    text: "Dans quelle épître Paul écrit-il : « Je puis tout par celui qui me fortifie » ?",
    options: ["Romains", "Galates", "Philippiens", "Colossiens"],
    correctIndex: 2,
    explanation:
      "Cette citation célèbre se trouve en Philippiens 4:13. Paul l'écrit depuis sa prison, exprimant que sa force vient du Christ et non de ses circonstances extérieures.",
  },
];

/* ─── Timer SVG ring ─────────────────────────────────────────────────────*/
function TimerRing({ time, total, size = 60 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = time / total;
  const danger = time <= 10;
  const stroke = danger ? T.err : T.em;
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
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.35s" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: danger ? T.err : T.text,
          transition: "color 0.35s",
        }}
      >
        {time}
      </div>
    </div>
  );
}

/* ─── Skeleton shimmer — loading state (Rule 5) ──────────────────────────*/
function Sk({ w = "100%", h = 16, r = 8 }) {
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

function LoadingSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        animation: "fadeUp 0.3s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <Sk w={90} h={24} r={99} />
          <Sk w={60} h={24} r={99} />
        </div>
        <Sk w={60} h={60} r={99} />
      </div>
      <Sk h={12} w="35%" />
      <Sk h={26} w="95%" />
      <Sk h={26} w="78%" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          marginTop: 8,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <Sk key={i} h={52} r={14} />
        ))}
      </div>
    </div>
  );
}

/* ─── Option button with ripple + stagger ────────────────────────────────*/
function OptionBtn({ label, index, status, onClick, delay }) {
  const letters = ["A", "B", "C", "D"];
  const rippleRef = useRef(null);

  const colors = {
    idle: {
      bg: "rgba(255,255,255,0.04)",
      border: T.border,
      text: "rgba(255,255,255,0.78)",
      badge: "rgba(255,255,255,0.07)",
      badgeText: "rgba(255,255,255,0.5)",
    },
    correct: {
      bg: T.emDim,
      border: T.emBrd,
      text: T.em,
      badge: "rgba(16,185,129,0.18)",
      badgeText: T.em,
    },
    wrong: {
      bg: T.errDim,
      border: T.errBrd,
      text: T.err,
      badge: "rgba(239,68,68,0.18)",
      badgeText: T.err,
    },
    missed: {
      bg: T.emDim,
      border: T.emBrd,
      text: T.em,
      badge: "rgba(16,185,129,0.15)",
      badgeText: T.em,
    },
  }[status];

  const handleClick = (e) => {
    if (status !== "idle") return;
    // Ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const rp = rippleRef.current;
    if (rp) {
      rp.style.left = `${e.clientX - rect.left}px`;
      rp.style.top = `${e.clientY - rect.top}px`;
      rp.style.animation = "none";
      void rp.offsetWidth;
      rp.style.animation =
        "rippleOut 0.55s cubic-bezier(0.16,1,0.3,1) forwards";
    }
    onClick();
  };

  const iconEl = {
    correct: <Ic.Check />,
    wrong: <Ic.X />,
    missed: <Ic.Check />,
    idle: null,
  }[status];

  return (
    <button
      onClick={handleClick}
      disabled={status !== "idle"}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 13,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        cursor: status === "idle" ? "pointer" : "default",
        textAlign: "left",
        transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
        transform: "scale(1)",
        animation: `fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) ${delay}s both`,
      }}
      onMouseEnter={(e) => {
        if (status === "idle")
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
      }}
      onMouseLeave={(e) => {
        if (status === "idle")
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseDown={(e) => {
        if (status === "idle") e.currentTarget.style.transform = "scale(0.975)";
      }}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Ripple element */}
      <div
        ref={rippleRef}
        style={{
          position: "absolute",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "rgba(16,185,129,0.35)",
          transform: "translate(-50%,-50%) scale(0)",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          flexShrink: 0,
          background: colors.badge,
          border: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: colors.badgeText,
          transition: "all 0.22s",
        }}
      >
        {iconEl ?? letters[index]}
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: status === "idle" ? "rgba(255,255,255,0.8)" : colors.text,
          flex: 1,
          lineHeight: 1.45,
          transition: "color 0.22s",
        }}
      >
        {label}
      </span>
    </button>
  );
}

/* ─── Explanation panel ──────────────────────────────────────────────────*/
function ExplanationPanel({ text, onNext, isLast, isCorrect }) {
  return (
    <div
      style={{
        marginTop: 22,
        paddingTop: 20,
        borderTop: `1px solid ${T.border}`,
        animation: "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            flexShrink: 0,
            background: isCorrect ? T.emDim : T.errDim,
            border: `1px solid ${isCorrect ? T.emBrd : T.errBrd}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isCorrect ? T.em : T.err,
          }}
        >
          <Ic.Info />
        </div>
        <div>
          <p
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: isCorrect ? T.em : T.err,
              marginBottom: 5,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {isCorrect ? "Bonne réponse" : "Mauvaise réponse"}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              color: T.muted,
              lineHeight: 1.68,
              margin: 0,
            }}
          >
            {text}
          </p>
        </div>
      </div>
      <button
        onClick={onNext}
        style={{
          width: "100%",
          padding: "13px 18px",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: `linear-gradient(135deg,${T.em},#059669)`,
          border: "none",
          cursor: "pointer",
          fontFamily: "'Outfit',sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: "#fff",
          boxShadow: `0 4px 18px rgba(16,185,129,.3)`,
          transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = `0 8px 26px rgba(16,185,129,.42)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = `0 4px 18px rgba(16,185,129,.3)`;
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "")}
      >
        {isLast ? "Voir les résultats" : "Question suivante"} <Ic.ArrowR />
      </button>
    </div>
  );
}

/* ─── Results screen ─────────────────────────────────────────────────────*/
function ResultsScreen({ questions, answers, score, onRestart, onHome }) {
  const correct = answers.filter((a) => a.isCorrect).length;
  const maxScore = questions.reduce((s, q) => s + q.points, 0);
  const pct = Math.round((correct / questions.length) * 100);
  const grade =
    pct >= 90
      ? { label: "Exceptionnel", color: T.gold }
      : pct >= 70
        ? { label: "Très bien", color: T.em }
        : pct >= 50
          ? { label: "Bien", color: "#6366f1" }
          : { label: "À retravailler", color: T.err };

  const circ = 2 * Math.PI * 46;

  return (
    <div style={{ animation: "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both" }}>
      {/* Score ring */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 108,
            height: 108,
            marginBottom: 14,
          }}
        >
          <svg width="108" height="108" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="54"
              cy="54"
              r="46"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="7"
            />
            <circle
              cx="54"
              cy="54"
              r="46"
              fill="none"
              stroke={grade.color}
              strokeWidth="7"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct / 100)}
              strokeLinecap="round"
              style={{
                transition:
                  "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s",
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
                fontFamily: "'Outfit',sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: grade.color,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {pct}%
            </span>
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 21,
            fontWeight: 800,
            color: T.text,
            letterSpacing: "-0.03em",
            marginBottom: 4,
          }}
        >
          {grade.label}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 13,
            color: T.muted,
          }}
        >
          {correct} / {questions.length} correctes · {score} pts
        </div>
      </div>

      {/* Breakdown */}
      <div
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        {questions.map((q, i) => {
          const a = answers[i];
          return (
            <div
              key={q.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "12px 15px",
                borderBottom:
                  i < questions.length - 1 ? `1px solid ${T.border}` : "none",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: a?.isCorrect ? T.emDim : T.errDim,
                  color: a?.isCorrect ? T.em : T.err,
                }}
              >
                {a?.isCorrect ? <Ic.Check /> : <Ic.X />}
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.58)",
                  flex: 1,
                  lineHeight: 1.4,
                }}
              >
                {q.text.length > 58 ? q.text.slice(0, 56) + "…" : q.text}
              </span>
              <span
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: a?.isCorrect ? T.em : "rgba(255,255,255,0.2)",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                }}
              >
                {a?.isCorrect ? `+${q.points + (a.bonus || 0)}` : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <button
          onClick={onRestart}
          style={{
            width: "100%",
            padding: "13px 18px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: `linear-gradient(135deg,${T.em},#059669)`,
            border: "none",
            cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            boxShadow: `0 4px 18px rgba(16,185,129,.3)`,
            transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        >
          <Ic.Refresh /> Rejouer
        </button>
        <button
          onClick={onHome}
          style={{
            width: "100%",
            padding: "11px 18px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${T.border}`,
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            color: T.muted,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = T.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = T.muted;
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        >
          <Ic.Home /> Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function QuizSection({
  questions = SAMPLE_QUESTIONS,
  timePerQuestion = 30,
  showExplanations = true,
  bonusTime = true,
  allowSkip = false,
  onFinish,
}) {
  const [phase, setPhase] = useState("loading"); // "loading"|"quiz"|"results"
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [timerOn, setTimerOn] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [qKey, setQKey] = useState(0); // force option re-mount
  const timerRef = useRef(null);

  /* Simulate data fetch */
  useEffect(() => {
    const t = setTimeout(() => {
      setPhase("quiz");
      setTimerOn(true);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  /* Timer tick */
  useEffect(() => {
    if (!timerOn || answered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerOn, answered, qIndex]);

  const handleTimeout = useCallback(() => {
    setAnswered(true);
    setTimerOn(false);
    const q = questions[qIndex];
    setAnswers((prev) => [
      ...prev,
      { isCorrect: false, selectedIndex: null, points: q.points, bonus: 0 },
    ]);
  }, [qIndex, questions]);

  const handleAnswer = useCallback(
    (optIdx) => {
      if (answered) return;
      clearInterval(timerRef.current);
      setTimerOn(false);
      setSelected(optIdx);
      setAnswered(true);
      const q = questions[qIndex];
      const isCorrect = optIdx === q.correctIndex;
      const bonus = bonusTime && isCorrect ? Math.floor(timeLeft / 3) : 0;
      if (isCorrect) setScore((s) => s + q.points + bonus);
      setAnswers((prev) => [
        ...prev,
        { isCorrect, selectedIndex: optIdx, points: q.points, bonus },
      ]);
    },
    [answered, qIndex, questions, timeLeft, bonusTime],
  );

  const handleNext = useCallback(() => {
    if (qIndex + 1 >= questions.length) {
      setPhase("results");
      onFinish?.({ answers, score });
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(timePerQuestion);
    setTimerOn(true);
    setQKey((k) => k + 1);
  }, [qIndex, questions.length, answers, score, onFinish, timePerQuestion]);

  const handleSkip = useCallback(() => {
    if (answered) return;
    clearInterval(timerRef.current);
    setTimerOn(false);
    setAnswered(true);
    const q = questions[qIndex];
    setAnswers((prev) => [
      ...prev,
      {
        isCorrect: false,
        selectedIndex: null,
        points: q.points,
        bonus: 0,
        skipped: true,
      },
    ]);
  }, [answered, qIndex, questions]);

  const handleRestart = useCallback(() => {
    setPhase("loading");
    setQIndex(0);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(timePerQuestion);
    setAnswers([]);
    setScore(0);
    setQKey(0);
    setTimeout(() => {
      setPhase("quiz");
      setTimerOn(true);
    }, 600);
  }, [timePerQuestion]);

  /* Derived */
  const q = questions[qIndex];
  const progress = (qIndex / questions.length) * 100;
  const isLastQ = qIndex + 1 >= questions.length;
  const diffColor =
    { easy: T.em, medium: T.gold, hard: T.err }[q?.difficulty] ?? T.em;
  const diffLabel =
    { easy: "Initié", medium: "Érudit", hard: "Lettré" }[q?.difficulty] ?? "";

  const getStatus = (i) => {
    if (!answered) return "idle";
    if (i === q.correctIndex) return "correct";
    if (i === selected) return "wrong";
    return "idle";
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px,4vw,40px)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes rippleOut { to{transform:translate(-50%,-50%) scale(40);opacity:0} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.2);border-radius:99px}
        button{outline:none;-webkit-tap-highlight-color:transparent}
      `}</style>

      {/* Ambient top glow — fixed, pointer-none (performance guardrail) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 480,
          height: 300,
          borderRadius: "0 0 50% 50%",
          background:
            "radial-gradient(ellipse,rgba(16,185,129,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Quiz card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 520,
          background: T.surf,
          border: `1px solid ${T.border}`,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), 0 28px 56px rgba(0,0,0,0.55)",
          borderRadius: 24,
          overflow: "hidden",
        }}
      >
        {/* Progress stripe */}
        {phase === "quiz" && (
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg,${T.em},#34d399)`,
                transition: "width 0.55s cubic-bezier(0.16,1,0.3,1)",
                borderRadius: "0 2px 2px 0",
              }}
            />
          </div>
        )}

        <div style={{ padding: "clamp(22px,4vw,34px)" }}>
          {/* ── LOADING ── */}
          {phase === "loading" && <LoadingSkeleton />}

          {/* ── QUIZ ── */}
          {phase === "quiz" && q && (
            <div key={qKey}>
              {/* Top bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginBottom: 9,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "3px 10px",
                        borderRadius: 99,
                        background: T.emDim,
                        border: `1px solid ${T.emBrd}`,
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        color: T.em,
                      }}
                    >
                      <Ic.Book /> {q.category}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 10px",
                        borderRadius: 99,
                        background: `${diffColor}15`,
                        border: `1px solid ${diffColor}35`,
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        color: diffColor,
                      }}
                    >
                      <Ic.Star /> {diffLabel} · +{q.points} pts
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.28)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    Question {qIndex + 1}{" "}
                    <span style={{ opacity: 0.5 }}>/ {questions.length}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    flexShrink: 0,
                  }}
                >
                  <TimerRing time={timeLeft} total={timePerQuestion} />
                  {timeLeft <= 10 && (
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 9,
                        color: T.err,
                        letterSpacing: "0.04em",
                        animation: "pulse 0.75s ease-in-out infinite",
                      }}
                    >
                      URGENT
                    </span>
                  )}
                </div>
              </div>

              {/* Score bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${T.border}`,
                }}
              >
                <span style={{ color: T.gold, display: "flex" }}>
                  <Ic.Trophy />
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    color: T.muted,
                  }}
                >
                  Score :
                </span>
                <span
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 15,
                    fontWeight: 800,
                    color: T.gold,
                    letterSpacing: "-0.02em",
                    animation: "slideIn 0.28s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {score} pts
                </span>
                {bonusTime && !answered && (
                  <span
                    style={{
                      marginLeft: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      color: T.em,
                    }}
                  >
                    <Ic.Lightning /> Bonus +{Math.floor(timeLeft / 3)}
                  </span>
                )}
              </div>

              {/* Question */}
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: "clamp(16px,2.8vw,20px)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: T.text,
                  lineHeight: 1.42,
                  marginBottom: 20,
                  animation:
                    "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) 0.04s both",
                }}
              >
                {q.text}
              </h2>

              {/* Options — stagger delay cascade */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map((opt, i) => (
                  <OptionBtn
                    key={i}
                    label={opt}
                    index={i}
                    status={getStatus(i)}
                    onClick={() => handleAnswer(i)}
                    delay={i * 0.055}
                  />
                ))}
              </div>

              {/* Skip */}
              {allowSkip && !answered && (
                <button
                  onClick={handleSkip}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    padding: "10px 14px",
                    background: "transparent",
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.28)",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.28)";
                    e.currentTarget.style.borderColor = T.border;
                  }}
                >
                  <Ic.Skip /> Passer
                </button>
              )}

              {/* Explanation */}
              {showExplanations && answered && (
                <ExplanationPanel
                  text={q.explanation}
                  onNext={handleNext}
                  isLast={isLastQ}
                  isCorrect={answers[answers.length - 1]?.isCorrect}
                />
              )}

              {/* Next (no explanation mode) */}
              {!showExplanations && answered && (
                <button
                  onClick={handleNext}
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: "12px 18px",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    background: `linear-gradient(135deg,${T.em},#059669)`,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.97)")
                  }
                  onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                >
                  {isLastQ ? "Voir les résultats" : "Question suivante"}{" "}
                  <Ic.ArrowR />
                </button>
              )}
            </div>
          )}

          {/* ── RESULTS ── */}
          {phase === "results" && (
            <ResultsScreen
              questions={questions}
              answers={answers}
              score={score}
              onRestart={handleRestart}
              onHome={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
