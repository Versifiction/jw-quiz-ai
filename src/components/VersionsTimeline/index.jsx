"use client";
import { useState, useEffect, useRef } from "react";

import versions from "../../utils/shapes/versions";
import { Ic } from "../ui/Icons";
import T from "../ui/DesignTokens";
import Reveal from "../ui/Reveal";

const CHANGE_TYPES = {
  new: {
    label: "Nouveau",
    color: T.em,
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.3)",
  },
  improved: {
    label: "Amélioré",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.3)",
  },
  fixed: {
    label: "Corrigé",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
  },
  removed: {
    label: "Supprimé",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
  },
};

/* ─── Change tag badge ─────────────────────────────────────────────────────*/
function ChangeTag({ type }) {
  const cfg = CHANGE_TYPES[type];
  const icons = {
    new: <Ic.Plus />,
    improved: <Ic.ArrowUp />,
    fixed: <Ic.Wrench />,
    removed: <Ic.Trash />,
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 6,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        fontFamily: T.mono,
        fontSize: 9,
        color: cfg.color,
        letterSpacing: "0.06em",
        flexShrink: 0,
      }}
    >
      {icons[type]} {cfg.label.toUpperCase()}
    </span>
  );
}

/* ─── Animated SVG timeline line ───────────────────────────────────────────*/
function TimelineLine({ totalHeight }) {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !totalHeight) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // How much of the line container has scrolled into view
      const visible = Math.max(0, Math.min(totalHeight, windowH - rect.top));
      setDrawn(Math.min(1, visible / totalHeight));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [totalHeight]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        bottom: 0,
        transform: "translateX(-50%)",
        width: 2,
        pointerEvents: "none",
      }}
    >
      {/* Background track */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 99,
        }}
      />
      {/* Drawn line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${drawn * 100}%`,
          background: `linear-gradient(180deg, ${T.em}, rgba(16,185,129,0.3))`,
          borderRadius: 99,
          transition: "height 0.1s linear",
        }}
      />
    </div>
  );
}

/* ─── Version card ─────────────────────────────────────────────────────────*/
function VersionCard({ v, side, index, activeFilter }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(v.current);

  const filtered = v.changes.filter(
    (c) => activeFilter === "all" || c.type === activeFilter,
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Scriptura v${v.version} — ${v.date}\n${v.changes.map((c) => `[${CHANGE_TYPES[c.type].label}] ${c.text}`).join("\n")}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Reveal delay={index * 0.06}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 48px 1fr",
          gap: 0,
          alignItems: "start",
        }}
        className="timeline-row"
      >
        <style>{`@media(max-width:767px){.timeline-row{grid-template-columns:40px 1fr!important}.timeline-right{display:none!important}.timeline-left{display:none!important}.timeline-left-content,.timeline-right-content{grid-column:2!important}}`}</style>

        {/* Left slot */}
        <div
          style={{ paddingRight: 28, textAlign: "right" }}
          className={
            side === "left" ? "timeline-left-content" : "timeline-left"
          }
        >
          {side === "left" && (
            <CardContent
              v={v}
              filtered={filtered}
              expanded={expanded}
              setExpanded={setExpanded}
              handleCopy={handleCopy}
              copied={copied}
            />
          )}
          {side === "right" && (
            <div style={{ paddingTop: 12 }}>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 5,
                }}
              >
                <Ic.Clock /> {v.date}
              </div>
            </div>
          )}
        </div>

        {/* Center node */}
        <div
          style={{ display: "flex", justifyContent: "center", paddingTop: 14 }}
        >
          <div
            style={{
              width: v.current ? 20 : 14,
              height: v.current ? 20 : 14,
              borderRadius: "50%",
              background: v.current ? T.em : T.surf,
              border: `2px solid ${v.current ? T.em : "rgba(255,255,255,0.2)"}`,
              boxShadow: v.current
                ? `0 0 0 4px ${T.emDim}, 0 0 20px rgba(16,185,129,.4)`
                : "none",
              animation: v.current ? "pulse 2.5s ease-in-out infinite" : "none",
              transition: "all 0.3s",
              zIndex: 1,
              position: "relative",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Right slot */}
        <div
          style={{ paddingLeft: 28 }}
          className={
            side === "right" ? "timeline-right-content" : "timeline-right"
          }
        >
          {side === "right" && (
            <CardContent
              v={v}
              filtered={filtered}
              expanded={expanded}
              setExpanded={setExpanded}
              handleCopy={handleCopy}
              copied={copied}
            />
          )}
          {side === "left" && (
            <div style={{ paddingTop: 12 }}>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Ic.Clock /> {v.date}
              </div>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function CardContent({
  v,
  filtered,
  expanded,
  setExpanded,
  handleCopy,
  copied,
}) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(expanded ? "auto" : 0);

  useEffect(() => {
    if (!bodyRef.current) return;
    setHeight(expanded ? bodyRef.current.scrollHeight : 0);
  }, [expanded, filtered.length]);

  const changeCount = Object.entries(
    v.changes.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <div
      style={{
        background: v.current ? "rgba(16,185,129,0.05)" : T.surf,
        border: `1px solid ${v.current ? T.emBrd : T.border}`,
        borderRadius: 18,
        boxShadow: v.current ? "inset 0 1px 0 rgba(255,255,255,0.07)" : "none",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div style={{ padding: "20px 22px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {/* Version badge */}
            <span
              style={{
                fontFamily: T.mono,
                fontSize: 13,
                fontWeight: 700,
                color: v.current ? T.em : "rgba(255,255,255,0.6)",
                letterSpacing: "-0.01em",
              }}
            >
              v{v.version}
            </span>
            {v.current && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 9px",
                  borderRadius: 99,
                  background: T.emDim,
                  border: `1px solid ${T.emBrd}`,
                  fontFamily: T.mono,
                  fontSize: 9,
                  color: T.em,
                  letterSpacing: "0.08em",
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: T.em,
                    animation: "pulse 1.8s ease-in-out infinite",
                  }}
                />
                ACTUELLE
              </span>
            )}
          </div>
          {/* Copy button */}
          <button
            onClick={handleCopy}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              cursor: "pointer",
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontFamily: T.mono,
              fontSize: 10,
              color: copied ? T.em : T.muted,
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.color = T.text;
                e.currentTarget.style.borderColor = T.emBrd;
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.color = T.muted;
                e.currentTarget.style.borderColor = T.border;
              }
            }}
          >
            {copied ? (
              <>
                <Ic.Check /> Copié
              </>
            ) : (
              <>
                <Ic.Copy /> Copier
              </>
            )}
          </button>
        </div>

        <h3
          style={{
            fontFamily: T.sans,
            fontSize: 16,
            fontWeight: 700,
            color: T.text,
            letterSpacing: "-0.025em",
            marginBottom: 6,
            lineHeight: 1.2,
          }}
        >
          {v.title}
        </h3>
        <p
          style={{
            fontFamily: T.sans,
            fontSize: 13,
            color: T.muted,
            lineHeight: 1.6,
            marginBottom: 14,
          }}
        >
          {v.summary}
        </p>

        {/* Change type mini badges */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 14,
          }}
        >
          {changeCount.map(([type, count]) => {
            const cfg = CHANGE_TYPES[type];
            return (
              <span
                key={type}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  fontFamily: T.mono,
                  fontSize: 9,
                  color: cfg.color,
                }}
              >
                {count} {cfg.label}
              </span>
            );
          })}
        </div>

        {/* Toggle expand */}
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: T.sans,
            fontSize: 12,
            color: T.em,
            padding: 0,
            transition: "opacity 0.18s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 256 256"
            fill="none"
            stroke="currentColor"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <path d="m48 96 80 80 80-80" />
          </svg>
          {expanded ? "Replier" : `Voir les ${v.changes.length} changements`}
        </button>
      </div>

      {/* Expandable change list */}
      <div
        style={{
          maxHeight: typeof height === "number" ? height : "none",
          overflow: "hidden",
          transition: "max-height 0.42s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div ref={bodyRef} style={{ borderTop: `1px solid ${T.border}` }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "16px 22px",
                fontFamily: T.sans,
                fontSize: 13,
                color: "rgba(255,255,255,0.25)",
                textAlign: "center",
              }}
            >
              Aucun changement de ce type
            </div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "11px 22px",
                  borderBottom:
                    i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                }}
              >
                <div style={{ paddingTop: 1, flexShrink: 0 }}>
                  <ChangeTag type={c.type} />
                </div>
                <span
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.55,
                  }}
                >
                  {c.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ VERSIONS PAGE ═══════════════════════════════════*/
export default function VersionsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const timelineRef = useRef(null);
  const [timelineH, setTimelineH] = useState(0);

  useEffect(() => {
    if (!timelineRef.current) return;
    const ro = new ResizeObserver(() => {
      setTimelineH(timelineRef.current?.offsetHeight || 0);
    });
    ro.observe(timelineRef.current);
    setTimelineH(timelineRef.current?.offsetHeight || 0);
    return () => ro.disconnect();
  }, []);

  const filterOptions = [
    { id: "all", label: "Tout", color: T.em },
    { id: "new", label: "Nouveau", color: CHANGE_TYPES.new.color },
    { id: "improved", label: "Amélioré", color: CHANGE_TYPES.improved.color },
    { id: "fixed", label: "Corrigé", color: CHANGE_TYPES.fixed.color },
    { id: "removed", label: "Supprimé", color: CHANGE_TYPES.removed.color },
  ];

  const totalChanges = versions.reduce((s, v) => s + v.changes.length, 0);
  const latestVersion = versions[0];

  return (
    <div style={{ background: T.bg, minHeight: "100dvh", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes drawLine{ from{height:0} to{height:100%} }
        *{box-sizing:border-box;margin:0;padding:0}
        button{outline:none;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.2);border-radius:99px}
        ::selection{background:rgba(16,185,129,.3)}
      `}</style>

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
          maxWidth: 1000,
          margin: "0 auto",
          padding: "clamp(48px,6vw,80px) clamp(16px,4vw,40px) 100px",
        }}
      >
        {/* ── HEADER ── */}
        <Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "end",
              marginBottom: 52,
            }}
            className="hdr-grid"
          >
            <style>{`@media(max-width:600px){.hdr-grid{grid-template-columns:1fr!important}}`}</style>
            <div>
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
                  <Ic.Bell />
                </span>
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: T.em,
                    letterSpacing: "0.1em",
                  }}
                >
                  HISTORIQUE
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
                  marginBottom: 14,
                }}
              >
                Versions
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
                  & changelog.
                </span>
              </h1>
              <p
                style={{
                  fontFamily: T.sans,
                  fontSize: 15,
                  color: T.muted,
                  maxWidth: "48ch",
                  lineHeight: 1.65,
                }}
              >
                Suivez l'évolution de Scriptura : nouvelles fonctionnalités,
                améliorations et corrections depuis le lancement.
              </p>
            </div>

            {/* Latest version KPI */}
            <div
              style={{
                background: T.surf,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                padding: "22px 24px",
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                VERSION ACTUELLE
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 28,
                  fontWeight: 800,
                  color: T.em,
                  letterSpacing: "-0.03em",
                  marginBottom: 4,
                }}
              >
                v{latestVersion.version}
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>
                {latestVersion.date}
              </div>
              <div
                style={{ height: 1, background: T.border, margin: "12px 0" }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 20,
                      fontWeight: 700,
                      color: T.em,
                    }}
                  >
                    {versions.length}
                  </div>
                  <div
                    style={{ fontFamily: T.sans, fontSize: 11, color: T.muted }}
                  >
                    versions
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 20,
                      fontWeight: 700,
                      color: T.em,
                    }}
                  >
                    {totalChanges}
                  </div>
                  <div
                    style={{ fontFamily: T.sans, fontSize: 11, color: T.muted }}
                  >
                    changements
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── FILTERS ── */}
        <Reveal delay={0.08}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 52,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: T.muted, display: "flex" }}>
              <Ic.Filter />
            </span>
            {filterOptions.map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 99,
                    border: `1px solid ${active ? `${f.color}45` : T.border}`,
                    background: active ? `${f.color}12` : "transparent",
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: active ? f.color : T.muted,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = T.text;
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = T.muted;
                      e.currentTarget.style.borderColor = T.border;
                    }
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.96)")
                  }
                  onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ── TIMELINE ── */}
        <div ref={timelineRef} style={{ position: "relative" }}>
          {/* Animated vertical line */}
          <TimelineLine totalHeight={timelineH} />

          {/* Version entries */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {versions.map((v, i) => (
              <VersionCard
                key={v.version}
                v={v}
                side={i % 2 === 0 ? "left" : "right"}
                index={i}
                activeFilter={activeFilter}
              />
            ))}
          </div>

          {/* Timeline end cap */}
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.08em",
                }}
              >
                ORIGINE · 2025
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER CTA ── */}
        <Reveal delay={0.1}>
          <div
            style={{
              marginTop: 64,
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
                  fontSize: 14,
                  fontWeight: 700,
                  color: T.text,
                  marginBottom: 4,
                }}
              >
                Vous avez une suggestion ?
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 13, color: T.muted }}>
                Proposez une fonctionnalité ou signalez un bug directement à
                notre équipe.
              </div>
            </div>
            <a
              href="mailto:feedback@scriptura.app"
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
                boxShadow: `0 4px 16px rgba(16,185,129,.3)`,
                whiteSpace: "nowrap",
                transition: "all 0.22s",
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
              Envoyer un retour
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
