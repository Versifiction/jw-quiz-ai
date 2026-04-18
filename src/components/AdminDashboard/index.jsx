import { useState, useCallback, useReducer } from "react";
import { getFirestore } from "firebase/firestore";

import AdminDashboardTab from "../AdminDashboardTab";
import AdminQuestionsTab from "../AdminQuestionsTab";
import AdminUsersTab from "../AdminUsersTab";
import { Ic } from "../ui/Icons";
import T from "../ui/DesignTokens";
import useCollection from "../../utils/hooks/useCollection";
import Sk from "../ui/Sk";

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
            <AdminDashboardTab questions={questions} users={users} />
          )}
          {tab === "questions" && <AdminQuestionsTab db={db} toast={toast} />}
          {tab === "users" && <AdminUsersTab db={db} toast={toast} />}
        </main>
      </div>

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  );
}
