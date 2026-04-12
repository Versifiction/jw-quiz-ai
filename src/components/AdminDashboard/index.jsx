"use client";
// ─── AdminDashboard.jsx ────────────────────────────────────────────────────
// Firebase Firestore CRUD for questions & users.
// Design system: Outfit + JetBrains Mono · Emerald accent · Dark indigo base
// Deps: firebase/app, firebase/firestore, firebase/auth  (already in project)
// No other external deps needed.

import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ─── IMPORTANT: pass your initialized Firebase app as a prop ────────────────
// <AdminDashboard firebaseApp={app} />
// ────────────────────────────────────────────────────────────────────────────

/* ══════════════════════════ DESIGN TOKENS ══════════════════════════════════*/
const T = {
  bg: "#07050f",
  surf: "#0f0a1e",
  surf2: "#14102a",
  em: "#10b981",
  emDim: "rgba(16,185,129,0.10)",
  emBrd: "rgba(16,185,129,0.25)",
  err: "#ef4444",
  errDim: "rgba(239,68,68,0.10)",
  errBrd: "rgba(239,68,68,0.28)",
  warn: "#f59e0b",
  warnDim: "rgba(245,158,11,0.10)",
  border: "rgba(255,255,255,0.08)",
  text: "#f1f5f9",
  muted: "rgba(241,245,249,0.45)",
  mono: "'JetBrains Mono', monospace",
  sans: "'Satoshi', sans-serif",
};

/* ══════════════════════════ SVG ICONS ══════════════════════════════════════*/
const Ic = {
  Dashboard: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="16" y="16" width="92" height="92" rx="12" />
      <rect x="148" y="16" width="92" height="92" rx="12" />
      <rect x="16" y="148" width="92" height="92" rx="12" />
      <rect x="148" y="148" width="92" height="92" rx="12" />
    </svg>
  ),
  Questions: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M128 24a104 104 0 1 0 0 208A104 104 0 0 0 128 24Z" />
      <path
        d="M128 180a12 12 0 1 1 0-24 12 12 0 0 1 0 24Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M128 144v-8c18 0 32-13.43 32-29.63C160 89.43 145.72 76 128 76c-16.07 0-29.42 11.3-31.67 26.2" />
    </svg>
  ),
  Users: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
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
  Plus: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
    >
      <path d="M128 40v176M40 128h176" />
    </svg>
  ),
  Edit: () => (
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
      <path d="M227.31 73.37 182.63 28.69a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69A15.86 15.86 0 0 0 104 219.31l83-83" />
      <path d="m160 64 32 32" />
    </svg>
  ),
  Trash: () => (
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
      <path d="M216 56H40M168 56V40a16 16 0 0 0-16-16h-48a16 16 0 0 0-16 16v16M200 56l-16 144a16 16 0 0 1-16 16H88a16 16 0 0 1-16-16L56 56" />
      <path d="M104 104v64M152 104v64" />
    </svg>
  ),
  Search: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
    >
      <circle cx="112" cy="112" r="80" />
      <path d="m224 224-57.37-57.37" />
    </svg>
  ),
  X: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="22"
      strokeLinecap="round"
    >
      <path d="M200 56 56 200M56 56l144 144" />
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
  Filter: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M48 68h160M84 128h88M112 188h32" />
    </svg>
  ),
  ChevD: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m48 96 80 80 80-80" />
    </svg>
  ),
  Shield: () => (
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
      <path d="M40 114.79V56a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8v58.77c0 84.18-71.31 112.42-87.41 117.91a8 8 0 0 1-5.18 0C107.31 227.21 40 199 40 114.79Z" />
    </svg>
  ),
  Warning: () => (
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
      <path d="M114 40 24 200h208L142 40a16 16 0 0 0-28 0Z" />
      <path d="M128 136v40" />
      <circle cx="128" cy="196" r="4" fill="currentColor" />
    </svg>
  ),
  Logout: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M112 40H48a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h64" />
      <path d="m176 112 48 48-48 48M224 160H96" />
    </svg>
  ),
  Refresh: () => (
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
      <path d="M176 48h48v48" />
      <path d="M224 48A104 104 0 0 0 56 56.8" />
      <path d="M80 208H32v-48" />
      <path d="M32 208a104 104 0 0 0 168-8.8" />
    </svg>
  ),
  Trophy: () => (
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
      <path d="M56 56v56a72 72 0 0 0 144 0V56Z" />
      <path d="M56 80H24a8 8 0 0 0-8 8v24a48 48 0 0 0 48 48h0M200 80h32a8 8 0 0 1 8 8v24a48 48 0 0 1-48 48h0" />
      <path d="M128 184v40M96 224h64" />
    </svg>
  ),
  Star: () => (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
      <path d="m234.5 114.38-45.1 39.36 13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31-51 31a16 16 0 0 1-23.84-17.34l13.49-58.54-45.11-39.42a16 16 0 0 1 9.12-28.06l59.46-5.15 23.21-55.36a15.95 15.95 0 0 1 29.44 0L166 81.17l59.44 5.15a16 16 0 0 1 9.11 28.06Z" />
    </svg>
  ),
  Menu: () => (
    <svg
      width="18"
      height="18"
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

/* ══════════════════════════ SHARED PRIMITIVES ═══════════════════════════════*/

/* Skeleton shimmer */
function Sk({ w = "100%", h = 16, r = 8, style = {} }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background:
          "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

/* Toast notification */
function Toast({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 12,
            background:
              t.type === "error"
                ? "rgba(30,10,10,0.98)"
                : "rgba(10,20,16,0.98)",
            border: `1px solid ${t.type === "error" ? T.errBrd : T.emBrd}`,
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            animation: "slideToast 0.35s cubic-bezier(0.16,1,0.3,1) both",
            pointerEvents: "auto",
            maxWidth: 320,
          }}
        >
          <span
            style={{ color: t.type === "error" ? T.err : T.em, flexShrink: 0 }}
          >
            {t.type === "error" ? <Ic.Warning /> : <Ic.Check />}
          </span>
          <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text }}>
            {t.message}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Confirm delete modal */
function DeleteModal({ item, label, onConfirm, onCancel, loading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onCancel}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 400,
          background: T.surf,
          border: `1px solid ${T.errBrd}`,
          borderRadius: 20,
          padding: 28,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.6)",
          animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: T.errDim,
            border: `1px solid ${T.errBrd}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.err,
            marginBottom: 16,
          }}
        >
          <Ic.Warning />
        </div>
        <h3
          style={{
            fontFamily: T.sans,
            fontSize: 17,
            fontWeight: 700,
            color: T.text,
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Confirmer la suppression
        </h3>
        <p
          style={{
            fontFamily: T.sans,
            fontSize: 14,
            color: T.muted,
            marginBottom: 22,
            lineHeight: 1.6,
          }}
        >
          Supprimer <strong style={{ color: T.text }}>{label}</strong> ? Cette
          action est irréversible et supprimera les données de Firebase.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${T.border}`,
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 13,
              color: T.muted,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              e.currentTarget.style.color = T.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = T.muted;
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: T.err,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            onMouseDown={(e) => {
              if (!loading) e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          >
            {loading ? (
              <>
                <Sk w={14} h={14} r={99} style={{ display: "inline-block" }} />{" "}
                Suppression…
              </>
            ) : (
              <>
                <Ic.Trash /> Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Input field */
function Field({ label, helper, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: T.sans,
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {children}
      {helper && !error && (
        <span
          style={{
            fontFamily: T.sans,
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {helper}
        </span>
      )}
      {error && (
        <span
          style={{
            fontFamily: T.sans,
            fontSize: 11,
            color: T.err,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Ic.Warning /> {error}
        </span>
      )}
    </div>
  );
}

/* Styled input */
const inputStyle = (hasError) => ({
  width: "100%",
  padding: "10px 13px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${hasError ? T.errBrd : T.border}`,
  fontFamily: T.sans,
  fontSize: 14,
  color: T.text,
  outline: "none",
  transition: "border-color 0.2s",
});

/* Pill badge */
function Badge({ label, color = T.em }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 9px",
        borderRadius: 99,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        fontFamily: T.mono,
        fontSize: 10,
        color,
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </span>
  );
}

/* Avatar initials */
function Avatar({ name, size = 32 }) {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";
  const hue = ((name?.charCodeAt(0) ?? 0) * 37) % 360;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `hsl(${hue},45%,25%)`,
        border: `1.5px solid hsl(${hue},45%,38%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: T.mono,
        fontSize: size * 0.3,
        fontWeight: 700,
        color: `hsl(${hue},70%,72%)`,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* KPI stat tile */
function KpiTile({ label, value, delta, color = T.em }) {
  return (
    <div
      style={{
        padding: "20px 0",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 26,
          fontWeight: 700,
          color,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>
        {label}
      </div>
      {delta && (
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 10,
            color: delta.startsWith("+") ? T.em : T.err,
            marginTop: 4,
          }}
        >
          {delta}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════ FIREBASE HOOKS ══════════════════════════════════*/

function useCollection(db, collectionName, constraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const snap = await getDocs(q);
      setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, collectionName]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

/* ══════════════════════════ TOAST REDUCER ════════════════════════════════════*/
let _toastId = 0;
function toastReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: ++_toastId, ...action.payload }];
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}
function useToasts() {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const push = useCallback((message, type = "success") => {
    const id = ++_toastId;
    dispatch({ type: "ADD", payload: { id, message, type } });
    setTimeout(() => dispatch({ type: "REMOVE", id }), 3800);
  }, []);
  return [toasts, push];
}

/* ══════════════════════════ DASHBOARD TAB ══════════════════════════════════*/
function DashboardTab({ questions, users }) {
  const totalQ = questions.length;
  const totalU = users.length;
  const activeU = users.filter((u) => u.status !== "suspended").length;
  const avgPts = questions.reduce((s, q) => s + (q.points || 0), 0);
  const cats = [...new Set(questions.map((q) => q.category).filter(Boolean))];
  const diffDist = { easy: 0, medium: 0, hard: 0 };
  questions.forEach((q) => {
    if (q.difficulty in diffDist) diffDist[q.difficulty]++;
  });

  return (
    <div style={{ animation: "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) both" }}>
      {/* KPI row — divide-y pattern */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          background: T.surf,
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <KpiTile
          label="Questions totales"
          value={totalQ}
          delta="+3 ce mois"
          color={T.em}
        />
        <KpiTile
          label="Membres inscrits"
          value={totalU}
          delta="+12 ce mois"
          color="#6366f1"
        />
        <KpiTile label="Membres actifs" value={activeU} color={T.warn} />
        <KpiTile label="Points cumulés" value={avgPts} color={T.em} />
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Category distribution */}
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
              marginBottom: 18,
              letterSpacing: "-0.01em",
            }}
          >
            Questions par catégorie
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {cats.map((cat) => {
              const count = questions.filter((q) => q.category === cat).length;
              const pct = Math.round((count / totalQ) * 100) || 0;
              return (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 0",
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.sans,
                      fontSize: 13,
                      color: T.muted,
                      flex: 1,
                      lineHeight: 1,
                    }}
                  >
                    {cat}
                  </span>
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
                        width: `${pct}%`,
                        height: "100%",
                        background: T.em,
                        borderRadius: 99,
                        transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: T.mono,
                      fontSize: 11,
                      color: T.em,
                      minWidth: 24,
                      textAlign: "right",
                    }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
            {cats.length === 0 && (
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.2)",
                  textAlign: "center",
                  padding: "16px 0",
                }}
              >
                Aucune donnée
              </div>
            )}
          </div>
        </div>

        {/* Difficulty distribution */}
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
              marginBottom: 18,
              letterSpacing: "-0.01em",
            }}
          >
            Répartition par difficulté
          </div>
          {[
            { key: "easy", label: "Initié", color: T.em },
            { key: "medium", label: "Érudit", color: T.warn },
            { key: "hard", label: "Lettré", color: T.err },
          ].map((d) => {
            const count = diffDist[d.key];
            const pct = totalQ ? Math.round((count / totalQ) * 100) : 0;
            return (
              <div
                key={d.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 0",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <Badge label={d.label} color={d.color} />
                <div
                  style={{
                    flex: 1,
                    height: 4,
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 99,
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: d.color,
                      borderRadius: 99,
                      transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: d.color,
                    minWidth: 32,
                    textAlign: "right",
                  }}
                >
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}

          {/* Recent users */}
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
              margin: "22px 0 14px",
              letterSpacing: "-0.01em",
            }}
          >
            Derniers inscrits
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {users.slice(0, 4).map((u) => (
              <div
                key={u.id}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <Avatar name={u.displayName || u.email} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.displayName || u.email}
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {u.role || "user"}
                  </div>
                </div>
                <Badge
                  label={u.status === "suspended" ? "suspendu" : "actif"}
                  color={u.status === "suspended" ? T.err : T.em}
                />
              </div>
            ))}
            {users.length === 0 && (
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                Aucun utilisateur
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ QUESTION FORM MODAL ═════════════════════════════*/
const CATEGORIES = [
  "Torah & Loi",
  "Évangiles",
  "Prophètes",
  "Psaumes & Sagesse",
  "Épîtres",
  "Histoire biblique",
];
const DIFFICULTIES = ["easy", "medium", "hard"];
const EMPTY_Q = {
  text: "",
  category: "",
  difficulty: "medium",
  points: 10,
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
};

function QuestionModal({ question, onSave, onClose, saving }) {
  const isEdit = !!question?.id;
  const [form, setForm] = useState(
    isEdit
      ? {
          text: question.text || "",
          category: question.category || "",
          difficulty: question.difficulty || "medium",
          points: question.points || 10,
          options: question.options || ["", "", "", ""],
          correctIndex: question.correctIndex ?? 0,
          explanation: question.explanation || "",
        }
      : { ...EMPTY_Q, options: ["", "", "", ""] },
  );
  const [errors, setErrors] = useState({});

  const setF = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const setOpt = (i, val) =>
    setForm((p) => {
      const o = [...p.options];
      o[i] = val;
      return { ...p, options: o };
    });

  const validate = () => {
    const e = {};
    if (!form.text.trim()) e.text = "La question est requise";
    if (!form.category) e.category = "Choisissez une catégorie";
    if (form.options.some((o) => !o.trim()))
      e.options = "Toutes les options sont requises";
    if (!form.explanation.trim()) e.explanation = "L'explication est requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 580,
          maxHeight: "90dvh",
          overflowY: "auto",
          background: T.surf,
          border: `1px solid ${T.border}`,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.65)",
          borderRadius: 22,
          padding: "28px 28px",
          animation: "fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontFamily: T.sans,
              fontSize: 18,
              fontWeight: 800,
              color: T.text,
              letterSpacing: "-0.025em",
            }}
          >
            {isEdit ? "Modifier la question" : "Nouvelle question"}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${T.border}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.muted,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = T.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = T.muted;
            }}
          >
            <Ic.X />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Text */}
          <Field label="Texte de la question" error={errors.text}>
            <textarea
              value={form.text}
              onChange={(e) => setF("text", e.target.value)}
              rows={3}
              placeholder="Entrez la question ici…"
              style={{
                ...inputStyle(errors.text),
                resize: "vertical",
                lineHeight: 1.55,
              }}
              onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.text ? T.errBrd : T.border)
              }
            />
          </Field>

          {/* Category + Difficulty + Points */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 100px",
              gap: 12,
            }}
          >
            <Field label="Catégorie" error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => setF("category", e.target.value)}
                style={{
                  ...inputStyle(errors.category),
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                <option value="">Choisir…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Difficulté">
              <select
                value={form.difficulty}
                onChange={(e) => setF("difficulty", e.target.value)}
                style={{
                  ...inputStyle(false),
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d === "easy"
                      ? "Initié"
                      : d === "medium"
                        ? "Érudit"
                        : "Lettré"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Points">
              <input
                type="number"
                min={5}
                max={100}
                step={5}
                value={form.points}
                onChange={(e) => setF("points", Number(e.target.value))}
                style={{ ...inputStyle(false), fontFamily: T.mono }}
                onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                onBlur={(e) => (e.target.style.borderColor = T.border)}
              />
            </Field>
          </div>

          {/* Options */}
          <Field
            label="Options de réponse"
            helper="Cochez la bonne réponse"
            error={errors.options}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.options.map((opt, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <button
                    onClick={() => setF("correctIndex", i)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: `1.5px solid ${form.correctIndex === i ? T.emBrd : T.border}`,
                      background:
                        form.correctIndex === i
                          ? T.emDim
                          : "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: form.correctIndex === i ? T.em : T.muted,
                      transition: "all 0.18s",
                      flexShrink: 0,
                    }}
                  >
                    {form.correctIndex === i ? (
                      <Ic.Check />
                    ) : (
                      <span style={{ fontFamily: T.mono, fontSize: 10 }}>
                        {["A", "B", "C", "D"][i]}
                      </span>
                    )}
                  </button>
                  <input
                    value={opt}
                    onChange={(e) => setOpt(i, e.target.value)}
                    placeholder={`Option ${["A", "B", "C", "D"][i]}…`}
                    style={{
                      ...inputStyle(errors.options && !opt.trim()),
                      flex: 1,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
              ))}
            </div>
          </Field>

          {/* Explanation */}
          <Field
            label="Explication"
            helper="Affiché après la réponse dans le quiz"
            error={errors.explanation}
          >
            <textarea
              value={form.explanation}
              onChange={(e) => setF("explanation", e.target.value)}
              rows={3}
              placeholder="Expliquez la bonne réponse…"
              style={{
                ...inputStyle(errors.explanation),
                resize: "vertical",
                lineHeight: 1.55,
              }}
              onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.explanation
                  ? T.errBrd
                  : T.border)
              }
            />
          </Field>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 12,
              background: saving
                ? "rgba(16,185,129,0.5)"
                : `linear-gradient(135deg,${T.em},#059669)`,
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: T.sans,
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseDown={(e) => {
              if (!saving) e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          >
            {saving ? (
              <>
                <Sk w={14} h={14} r={99} style={{ display: "inline-block" }} />{" "}
                Enregistrement…
              </>
            ) : (
              <>
                <Ic.Check />{" "}
                {isEdit ? "Enregistrer les modifications" : "Créer la question"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ QUESTIONS TAB ═══════════════════════════════════*/
function QuestionsTab({ db, toast }) {
  const {
    data: questions,
    loading,
    error,
    refetch,
  } = useCollection(db, "questions", [orderBy("createdAt", "desc")]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterDiff, setFilterDiff] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: "create"|"edit", question? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = questions.filter((q) => {
    const matchSearch =
      !search || q.text?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || q.category === filterCat;
    const matchDiff = !filterDiff || q.difficulty === filterDiff;
    return matchSearch && matchCat && matchDiff;
  });

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.question?.id) {
        await updateDoc(doc(db, "questions", modal.question.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        toast("Question mise à jour avec succès");
      } else {
        await addDoc(collection(db, "questions"), {
          ...form,
          createdAt: serverTimestamp(),
        });
        toast("Question créée avec succès");
      }
      setModal(null);
      refetch();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "questions", deleteTarget.id));
      toast("Question supprimée");
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const diffColor = { easy: T.em, medium: T.warn, hard: T.err };

  return (
    <div style={{ animation: "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) both" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: T.muted,
              pointerEvents: "none",
            }}
          >
            <Ic.Search />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une question…"
            style={{ ...inputStyle(false), paddingLeft: 36, width: "100%" }}
            onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
        </div>
        {/* Category filter */}
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          style={{
            ...inputStyle(false),
            width: "auto",
            paddingRight: 32,
            cursor: "pointer",
            appearance: "none",
          }}
        >
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {/* Difficulty filter */}
        <select
          value={filterDiff}
          onChange={(e) => setFilterDiff(e.target.value)}
          style={{
            ...inputStyle(false),
            width: "auto",
            paddingRight: 32,
            cursor: "pointer",
            appearance: "none",
          }}
        >
          <option value="">Tous niveaux</option>
          <option value="easy">Initié</option>
          <option value="medium">Érudit</option>
          <option value="hard">Lettré</option>
        </select>
        {/* Refresh */}
        <button
          onClick={refetch}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${T.border}`,
            cursor: "pointer",
            color: T.muted,
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = T.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = T.muted;
          }}
        >
          <Ic.Refresh />
        </button>
        {/* Add */}
        <button
          onClick={() => setModal({ mode: "create" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 16px",
            borderRadius: 10,
            background: `linear-gradient(135deg,${T.em},#059669)`,
            border: "none",
            cursor: "pointer",
            fontFamily: T.sans,
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            boxShadow: `0 3px 14px rgba(16,185,129,.3)`,
            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
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
          <Ic.Plus /> Nouvelle question
        </button>
      </div>

      {/* Count */}
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 11,
          color: "rgba(255,255,255,0.28)",
          marginBottom: 10,
        }}
      >
        {filtered.length} question{filtered.length !== 1 ? "s" : ""}{" "}
        {search || filterCat || filterDiff ? "(filtrées)" : ""}
      </div>

      {/* Table */}
      <div
        style={{
          background: T.surf,
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 90px 70px 90px",
            gap: 0,
            padding: "11px 20px",
            borderBottom: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {["Question", "Catégorie", "Niveau", "Points", "Actions"].map((h) => (
            <div
              key={h}
              style={{
                fontFamily: T.sans,
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              padding: "20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 140px 90px 70px 90px",
                  gap: 0,
                  alignItems: "center",
                }}
              >
                <Sk h={14} w="85%" />
                <Sk h={22} w={90} r={99} />
                <Sk h={22} w={60} r={99} />
                <Sk h={14} w={30} />
                <Sk h={28} w={70} r={8} />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: 32, textAlign: "center" }}>
            <div style={{ color: T.err, marginBottom: 8 }}>
              <Ic.Warning />
            </div>
            <div style={{ fontFamily: T.sans, fontSize: 14, color: T.err }}>
              {error}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 32,
                color: "rgba(255,255,255,0.07)",
                marginBottom: 12,
              }}
            >
              —
            </div>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 15,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {search || filterCat || filterDiff
                ? "Aucune question ne correspond aux filtres"
                : "Aucune question. Commencez par en créer une."}
            </div>
          </div>
        )}

        {/* Rows */}
        {!loading &&
          filtered.map((q, i) => (
            <div
              key={q.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 90px 70px 90px",
                gap: 0,
                padding: "13px 20px",
                borderBottom:
                  i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                alignItems: "center",
                transition: "background 0.15s",
                animation: `fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.03}s both`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div style={{ paddingRight: 16, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    color: T.text,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: 3,
                  }}
                >
                  {q.text}
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  {q.id}
                </div>
              </div>
              <div>
                <Badge label={q.category || "—"} color={T.em} />
              </div>
              <div>
                <Badge
                  label={
                    q.difficulty === "easy"
                      ? "Initié"
                      : q.difficulty === "medium"
                        ? "Érudit"
                        : "Lettré"
                  }
                  color={diffColor[q.difficulty] || T.em}
                />
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.warn,
                }}
              >
                {q.points}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setModal({ mode: "edit", question: q })}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${T.border}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.muted,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.em;
                    e.currentTarget.style.borderColor = T.emBrd;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor = T.border;
                  }}
                  title="Modifier"
                >
                  <Ic.Edit />
                </button>
                <button
                  onClick={() => setDeleteTarget(q)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${T.border}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.muted,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.err;
                    e.currentTarget.style.borderColor = T.errBrd;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor = T.border;
                  }}
                  title="Supprimer"
                >
                  <Ic.Trash />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modals */}
      {modal && (
        <QuestionModal
          question={modal.question}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          label={deleteTarget.text?.slice(0, 40) + "…"}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}

/* ══════════════════════════ USER FORM MODAL ═════════════════════════════════*/
function UserModal({ user, onSave, onClose, saving }) {
  const isEdit = !!user?.id;
  const [form, setForm] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    role: user?.role || "user",
    status: user?.status || "active",
  });
  const [errors, setErrors] = useState({});
  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.displayName.trim()) e.displayName = "Le nom est requis";
    if (!form.email.trim() || !form.email.includes("@"))
      e.email = "Email invalide";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
          background: T.surf,
          border: `1px solid ${T.border}`,
          borderRadius: 22,
          padding: 28,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06),0 32px 64px rgba(0,0,0,0.65)",
          animation: "fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <h2
            style={{
              fontFamily: T.sans,
              fontSize: 18,
              fontWeight: 800,
              color: T.text,
              letterSpacing: "-0.025em",
            }}
          >
            {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${T.border}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.muted,
            }}
          >
            <Ic.X />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Nom complet" error={errors.displayName}>
            <input
              value={form.displayName}
              onChange={(e) => setF("displayName", e.target.value)}
              placeholder="Prénom Nom"
              style={inputStyle(errors.displayName)}
              onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.displayName
                  ? T.errBrd
                  : T.border)
              }
            />
          </Field>
          <Field label="Adresse e-mail" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setF("email", e.target.value)}
              placeholder="email@exemple.com"
              style={inputStyle(errors.email)}
              onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.email
                  ? T.errBrd
                  : T.border)
              }
            />
          </Field>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Rôle">
              <select
                value={form.role}
                onChange={(e) => setF("role", e.target.value)}
                style={{
                  ...inputStyle(false),
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                <option value="user">Utilisateur</option>
                <option value="moderator">Modérateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </Field>
            <Field label="Statut">
              <select
                value={form.status}
                onChange={(e) => setF("status", e.target.value)}
                style={{
                  ...inputStyle(false),
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </Field>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 12,
              background: saving
                ? "rgba(16,185,129,0.5)"
                : `linear-gradient(135deg,${T.em},#059669)`,
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: T.sans,
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseDown={(e) => {
              if (!saving) e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          >
            {saving ? (
              "Enregistrement…"
            ) : (
              <>
                <Ic.Check /> {isEdit ? "Enregistrer" : "Créer l'utilisateur"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ USERS TAB ════════════════════════════════════════*/
function UsersTab({ db, toast }) {
  const {
    data: users,
    loading,
    error,
    refetch,
  } = useCollection(db, "users", [orderBy("createdAt", "desc")]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = users.filter((u) => {
    const name = (u.displayName || u.email || "").toLowerCase();
    const match =
      !search ||
      name.includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    const role = !filterRole || u.role === filterRole;
    return match && role;
  });

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.user?.id) {
        await updateDoc(doc(db, "users", modal.user.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        toast("Utilisateur mis à jour");
      } else {
        await addDoc(collection(db, "users"), {
          ...form,
          totalScore: 0,
          quizzesCompleted: 0,
          createdAt: serverTimestamp(),
        });
        toast("Utilisateur créé");
      }
      setModal(null);
      refetch();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "users", deleteTarget.id));
      toast("Utilisateur supprimé");
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const roleColor = { admin: "#f59e0b", moderator: "#6366f1", user: T.em };

  return (
    <div style={{ animation: "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) both" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: T.muted,
              pointerEvents: "none",
            }}
          >
            <Ic.Search />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur…"
            style={{ ...inputStyle(false), paddingLeft: 36, width: "100%" }}
            onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{
            ...inputStyle(false),
            width: "auto",
            cursor: "pointer",
            appearance: "none",
          }}
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Administrateurs</option>
          <option value="moderator">Modérateurs</option>
          <option value="user">Utilisateurs</option>
        </select>
        <button
          onClick={refetch}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${T.border}`,
            cursor: "pointer",
            color: T.muted,
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
        >
          <Ic.Refresh />
        </button>
        <button
          onClick={() => setModal({ mode: "create" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 16px",
            borderRadius: 10,
            background: `linear-gradient(135deg,${T.em},#059669)`,
            border: "none",
            cursor: "pointer",
            fontFamily: T.sans,
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            boxShadow: `0 3px 14px rgba(16,185,129,.3)`,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-1px)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        >
          <Ic.Plus /> Nouvel utilisateur
        </button>
      </div>

      <div
        style={{
          fontFamily: T.mono,
          fontSize: 11,
          color: "rgba(255,255,255,0.28)",
          marginBottom: 10,
        }}
      >
        {filtered.length} utilisateur{filtered.length !== 1 ? "s" : ""}
      </div>

      <div
        style={{
          background: T.surf,
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 160px 110px 100px 90px",
            padding: "11px 20px",
            borderBottom: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {["Utilisateur", "Email", "Rôle", "Statut", "Actions"].map((h) => (
            <div
              key={h}
              style={{
                fontFamily: T.sans,
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {loading && (
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 160px 110px 100px 90px",
                  alignItems: "center",
                  gap: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Sk w={32} h={32} r={99} />
                  <Sk h={14} w="60%" />
                </div>
                <Sk h={13} w="80%" />
                <Sk h={22} w={70} r={99} />
                <Sk h={22} w={60} r={99} />
                <Sk h={28} w={70} r={8} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ padding: 32, textAlign: "center", color: T.err }}>
            <Ic.Warning />
            <br />
            <span style={{ fontFamily: T.sans, fontSize: 14 }}>{error}</span>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 32,
                color: "rgba(255,255,255,0.07)",
                marginBottom: 12,
              }}
            >
              —
            </div>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 15,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {search || filterRole
                ? "Aucun utilisateur ne correspond"
                : "Aucun utilisateur pour l'instant."}
            </div>
          </div>
        )}

        {!loading &&
          filtered.map((u, i) => (
            <div
              key={u.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px 110px 100px 90px",
                padding: "12px 20px",
                borderBottom:
                  i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                alignItems: "center",
                transition: "background 0.15s",
                animation: `fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.03}s both`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
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
                  paddingRight: 12,
                  minWidth: 0,
                }}
              >
                <Avatar name={u.displayName || u.email} size={32} />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.displayName || "—"}
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {u.id.slice(0, 12)}…
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 11,
                  color: T.muted,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingRight: 8,
                }}
              >
                {u.email || "—"}
              </div>
              <div>
                <Badge
                  label={u.role || "user"}
                  color={roleColor[u.role] || T.em}
                />
              </div>
              <div>
                <Badge
                  label={u.status === "suspended" ? "Suspendu" : "Actif"}
                  color={u.status === "suspended" ? T.err : T.em}
                />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setModal({ mode: "edit", user: u })}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${T.border}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.muted,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.em;
                    e.currentTarget.style.borderColor = T.emBrd;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor = T.border;
                  }}
                  title="Modifier"
                >
                  <Ic.Edit />
                </button>
                <button
                  onClick={() => setDeleteTarget(u)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${T.border}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.muted,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.err;
                    e.currentTarget.style.borderColor = T.errBrd;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor = T.border;
                  }}
                  title="Supprimer"
                >
                  <Ic.Trash />
                </button>
              </div>
            </div>
          ))}
      </div>

      {modal && (
        <UserModal
          user={modal.user}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          label={deleteTarget.displayName || deleteTarget.email}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}

/* ══════════════════════════ ROOT COMPONENT ══════════════════════════════════*/
export default function AdminDashboard({ firebaseApp }) {
  const [tab, setTab] = useState("dashboard");
  const [sideOpen, setSide] = useState(false); // mobile sidebar
  const [toasts, toast] = useToasts();

  const db = firebaseApp ? getFirestore(firebaseApp) : null;

  // Prefetch both collections for Dashboard KPIs
  const { data: questions } = useCollection(db, "questions");
  const { data: users } = useCollection(db, "users");

  const tabs = [
    { id: "dashboard", label: "Vue d'ensemble", icon: Ic.Dashboard },
    { id: "questions", label: "Questions", icon: Ic.Questions },
    { id: "users", label: "Utilisateurs", icon: Ic.Users },
  ];

  const SideNav = () => (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        background: T.surf,
        borderRight: `1px solid ${T.border}`,
        minHeight: "100dvh",
        padding: "24px 16px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginBottom: 36,
          paddingLeft: 4,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: `linear-gradient(135deg,${T.em},#059669)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 12px rgba(16,185,129,.3)`,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 22 22"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M11 1 L13.5 8 L21 11 L13.5 14 L11 21 L8.5 14 L1 11 L8.5 8 Z" />
          </svg>
        </div>
        <div>
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 800,
              color: T.text,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Scriptura
          </div>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.1em",
            }}
          >
            ADMIN
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav
        style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setSide(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: active ? T.emDim : "transparent",
                outline: active ? `1px solid ${T.emBrd}` : "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: T.sans,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? T.em : "rgba(255,255,255,0.5)",
                transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = T.text;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }
              }}
            >
              <span
                style={{
                  color: active ? T.em : "rgba(255,255,255,0.35)",
                  flexShrink: 0,
                }}
              >
                <t.icon />
              </span>
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.06em",
            marginBottom: 10,
          }}
        >
          Connecté en tant que
        </div>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ic.Shield /> Administrateur
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 12px",
            borderRadius: 9,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${T.border}`,
            cursor: "pointer",
            fontFamily: T.sans,
            fontSize: 12,
            color: T.muted,
            width: "100%",
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = T.err;
            e.currentTarget.style.borderColor = T.errBrd;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = T.muted;
            e.currentTarget.style.borderColor = T.border;
          }}
        >
          <Ic.Logout /> Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100dvh",
        background: T.bg,
        color: T.text,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes slideToast{ from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.18);border-radius:99px}
        select option{background:#0f0a1e}
        button{outline:none;-webkit-tap-highlight-color:transparent}
        textarea{font-family:inherit}
        .admin-sidebar{display:flex!important}
        @media(max-width:900px){.admin-sidebar{display:none!important}.admin-burger{display:flex!important}}
        @media(min-width:901px){.admin-burger{display:none!important}}
      `}</style>

      {/* Desktop sidebar */}
      <div className="admin-sidebar">
        <SideNav />
      </div>

      {/* Mobile overlay sidebar */}
      {sideOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setSide(false)}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 1,
              animation: "fadeUp 0.28s ease both",
            }}
          >
            <SideNav />
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <header
          style={{
            height: 58,
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 clamp(16px,3vw,32px)",
            background: T.surf,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="admin-burger"
              onClick={() => setSide(true)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                color: T.muted,
                cursor: "pointer",
                padding: 4,
              }}
            >
              <Ic.Menu />
            </button>
            <h1
              style={{
                fontFamily: T.sans,
                fontSize: 16,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-0.025em",
              }}
            >
              {tabs.find((t) => t.id === tab)?.label}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: T.mono,
                fontSize: 10,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.08em",
              }}
            >
              {questions.length} Q · {users.length} U
            </span>
            <div style={{ width: 1, height: 18, background: T.border }} />
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: T.emDim,
                border: `1px solid ${T.emBrd}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ic.Shield />
            </div>
          </div>
        </header>

        {/* Firebase missing warning */}
        {!firebaseApp && (
          <div
            style={{
              margin: "16px clamp(16px,3vw,32px) 0",
              padding: "12px 16px",
              borderRadius: 12,
              background: T.warnDim,
              border: `1px solid rgba(245,158,11,0.3)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ color: T.warn }}>
              <Ic.Warning />
            </span>
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.warn }}>
              Aucune application Firebase fournie. Passez{" "}
              <code style={{ fontFamily: T.mono, fontSize: 11 }}>
                firebaseApp
              </code>{" "}
              en prop pour activer les données réelles.
            </span>
          </div>
        )}

        {/* Tab content */}
        <main
          style={{
            flex: 1,
            padding: "clamp(16px,3vw,32px)",
            overflowY: "auto",
          }}
        >
          {tab === "dashboard" && (
            <DashboardTab questions={questions} users={users} />
          )}
          {tab === "questions" && <QuestionsTab db={db} toast={toast} />}
          {tab === "users" && <UsersTab db={db} toast={toast} />}
        </main>
      </div>

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  );
}
