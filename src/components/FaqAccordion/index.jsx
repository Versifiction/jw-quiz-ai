"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import faqQuestions from "../../utils/shapes/faqQuestions";
import T from "../ui/DesignTokens";
import { Ic } from "../ui/Icons";
import SpotCard from "../ui/SpotCard";
import Reveal from "../ui/Reveal";

/* ─── FAQ data ─────────────────────────────────────────────────────────────*/
const CATEGORIES = [
  { id: "all", label: "Toutes", icon: Ic.Shield, color: T.em },
  { id: "general", label: "Général", icon: Ic.Book, color: "#f59e0b" },
  { id: "account", label: "Compte", icon: Ic.User, color: "#6366f1" },
  { id: "quiz", label: "Quiz", icon: Ic.Book, color: "#10b981" },
  { id: "scores", label: "Scores", icon: Ic.Trophy, color: "#f97316" },
  { id: "tech", label: "Technique", icon: Ic.Gear, color: "#14b8a6" },
];

/* ─── Accordion item ───────────────────────────────────────────────────────*/
function AccordionItem({ item, isOpen, onToggle, index }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!bodyRef.current) return;
    setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <SpotCard
      style={{
        borderRadius: 16,
        background: isOpen
          ? "rgba(16,185,129,0.04)"
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${isOpen ? T.emBrd : T.border}`,
        transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
        animation: `fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) ${index * 0.045}s both`,
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "18px 22px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: T.sans,
            fontSize: 15,
            fontWeight: isOpen ? 600 : 400,
            color: isOpen ? T.text : "rgba(255,255,255,0.75)",
            lineHeight: 1.45,
            flex: 1,
            transition: "color 0.22s, font-weight 0.1s",
          }}
        >
          {item.q}
        </span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            flexShrink: 0,
            background: isOpen ? T.emDim : "rgba(255,255,255,0.05)",
            border: `1px solid ${isOpen ? T.emBrd : T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isOpen ? T.em : T.muted,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Ic.ChevD />
        </div>
      </button>

      {/* Body — animated via max-height */}
      <div
        style={{
          maxHeight: height,
          overflow: "hidden",
          transition: "max-height 0.38s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div ref={bodyRef} style={{ padding: "0 22px 20px" }}>
          <div
            style={{
              width: "100%",
              height: 1,
              background: T.border,
              marginBottom: 16,
            }}
          />
          <p
            style={{
              fontFamily: T.sans,
              fontSize: 14,
              color: T.muted,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </SpotCard>
  );
}

/* ══════════════════════════ FAQ PAGE ════════════════════════════════════════*/
export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return faqQuestions.filter((item) => {
      const matchCat = activeCat === "all" || item.cat === activeCat;
      const matchSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCat]);

  const handleToggle = (id) => {
    if (expandAll) {
      setExpandAll(false);
      setOpenId(id);
      return;
    }
    setOpenId((prev) => (prev === id ? null : id));
  };

  const isOpen = (id) => expandAll || openId === id;

  return (
    <div style={{ background: T.bg, minHeight: "100dvh", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        *{box-sizing:border-box;margin:0;padding:0}
        button{outline:none;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.2);border-radius:99px}
        ::selection{background:rgba(16,185,129,.3)}
      `}</style>

      {/* Ambient glow */}
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

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(48px,6vw,80px) clamp(16px,4vw,40px) 100px",
        }}
      >
        {/* ── HEADER ── */}
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "4px 14px",
                borderRadius: 99,
                background: T.emDim,
                border: `1px solid ${T.emBrd}`,
                marginBottom: 20,
              }}
            >
              <span style={{ color: T.em }}>
                <Ic.Shield />
              </span>
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: T.em,
                  letterSpacing: "0.1em",
                }}
              >
                AIDE & SUPPORT
              </span>
            </div>
            <h1
              style={{
                fontFamily: T.sans,
                fontSize: "clamp(32px,5vw,56px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: T.text,
                lineHeight: 1.05,
                marginBottom: 16,
              }}
            >
              Questions
              <br />
              <span
                style={{
                  background: `linear-gradient(90deg,${T.em},#34d399)`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shimmer 4s linear infinite",
                }}
              >
                fréquentes.
              </span>
            </h1>
            <p
              style={{
                fontFamily: T.sans,
                fontSize: 16,
                color: T.muted,
                lineHeight: 1.65,
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              Trouvez rapidement des réponses sur le fonctionnement de
              Scriptura, votre compte et les quiz bibliques.
            </p>
          </div>
        </Reveal>

        {/* ── SEARCH ── */}
        <Reveal delay={0.08}>
          <div style={{ position: "relative", marginBottom: 36 }}>
            <span
              style={{
                position: "absolute",
                left: 16,
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
              style={{
                width: "100%",
                padding: "14px 48px 14px 44px",
                borderRadius: 14,
                background: T.surf,
                border: `1px solid ${T.border}`,
                fontFamily: T.sans,
                fontSize: 14,
                color: T.text,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  cursor: "pointer",
                  color: T.muted,
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic.X />
              </button>
            )}
          </div>
        </Reveal>

        {/* ── MAIN GRID: nav left / accordion right ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 32,
            alignItems: "start",
          }}
          className="faq-grid"
        >
          <style>{`
            @media(max-width:767px){ .faq-grid{grid-template-columns:1fr!important} .cat-sidebar{display:none!important} }
          `}</style>

          {/* LEFT: category nav */}
          <Reveal delay={0.12}>
            <div
              className="cat-sidebar"
              style={{
                position: "sticky",
                top: 24,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.28)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  paddingLeft: 12,
                }}
              >
                Catégories
              </div>
              {CATEGORIES.map((cat) => {
                const active = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: active ? `${cat.color}15` : "transparent",
                      outline: active ? `1px solid ${cat.color}35` : "none",
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? cat.color : T.muted,
                      transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                        e.currentTarget.style.color = T.text;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = T.muted;
                      }
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.97)")
                    }
                    onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <span
                      style={{
                        color: active ? cat.color : "rgba(255,255,255,0.3)",
                        flexShrink: 0,
                      }}
                    >
                      <cat.icon />
                    </span>
                    {cat.label}
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily: T.mono,
                        fontSize: 10,
                        color: active ? cat.color : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {cat.id === "all"
                        ? faqQuestions.length
                        : faqQuestions.filter((i) => i.cat === cat.id).length}
                    </span>
                  </button>
                );
              })}

              {/* Divider + expand all */}
              <div
                style={{ height: 1, background: T.border, margin: "10px 0" }}
              />
              <button
                onClick={() => {
                  setExpandAll((e) => !e);
                  setOpenId(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.03)",
                  fontFamily: T.sans,
                  fontSize: 12,
                  color: T.muted,
                  transition: "all 0.2s",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = T.text;
                  e.currentTarget.style.borderColor = T.emBrd;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = T.muted;
                  e.currentTarget.style.borderColor = T.border;
                }}
              >
                <span style={{ color: T.em }}>
                  <Ic.ChevD />
                </span>
                {expandAll ? "Tout replier" : "Tout développer"}
              </button>
            </div>
          </Reveal>

          {/* RIGHT: accordion */}
          <div>
            {/* Mobile category pills */}
            <div
              style={{
                display: "none",
                overflowX: "auto",
                gap: 8,
                marginBottom: 20,
                paddingBottom: 4,
              }}
              className="mobile-cats"
            >
              <style>{`@media(max-width:767px){.mobile-cats{display:flex!important}}`}</style>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    flexShrink: 0,
                    padding: "6px 14px",
                    borderRadius: 99,
                    border: `1px solid ${activeCat === cat.id ? `${cat.color}50` : T.border}`,
                    background:
                      activeCat === cat.id ? `${cat.color}15` : "transparent",
                    fontFamily: T.sans,
                    fontSize: 12,
                    color: activeCat === cat.id ? cat.color : T.muted,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                {filtered.length} question{filtered.length !== 1 ? "s" : ""}
                {search ? ` pour "${search}"` : ""}
              </span>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "64px 0",
                  textAlign: "center",
                  animation: "fadeUp 0.35s ease both",
                }}
              >
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 40,
                    color: "rgba(255,255,255,0.05)",
                    marginBottom: 16,
                  }}
                >
                  ?
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 16,
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: 8,
                  }}
                >
                  Aucune question ne correspond
                </div>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCat("all");
                  }}
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    color: T.em,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Effacer les filtres
                </button>
              </div>
            )}

            {/* Accordion list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((item, i) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isOpen={isOpen(item.id)}
                  onToggle={() => handleToggle(item.id)}
                  index={i}
                />
              ))}
            </div>

            {/* Contact CTA */}
            {filtered.length > 0 && (
              <Reveal delay={0.1}>
                <div
                  style={{
                    marginTop: 48,
                    padding: "28px 28px",
                    borderRadius: 20,
                    background: T.surf,
                    border: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 15,
                        fontWeight: 700,
                        color: T.text,
                        marginBottom: 4,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Vous n'avez pas trouvé votre réponse ?
                    </div>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 13,
                        color: T.muted,
                      }}
                    >
                      Nous vous répondons sous 24 heures.
                    </div>
                  </div>
                  <a
                    href="mailto:support@scriptura.app"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 20px",
                      borderRadius: 12,
                      background: `linear-gradient(135deg,${T.em},#059669)`,
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fff",
                      textDecoration: "none",
                      transition: "all 0.22s",
                      boxShadow: `0 4px 16px rgba(16,185,129,.3)`,
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-1px)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.97)")
                    }
                    onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <Ic.Mail /> Nous contacter
                  </a>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
