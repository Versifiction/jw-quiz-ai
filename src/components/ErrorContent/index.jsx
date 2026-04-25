"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../config/firebase";
import T from "../ui/DesignTokens";
import { Ic } from "../ui/Icons";

/* ─── Text scramble hook ───────────────────────────────────────────────────
   Cycles through random glyphs before landing on the final character.
   Used on the "404" display — pure CSS transform + opacity, no layout shift.
──────────────────────────────────────────────────────────────────────────*/
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!";
function useScramble(target, { duration = 1200, delay = 0 } = {}) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const run = useCallback(() => {
    const start = performance.now() + delay;
    startRef.current = start;

    const step = (now) => {
      if (now < start) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      setDisplay(
        target
          .split("")
          .map((char, i) => {
            const charProgress = Math.max(0, progress * target.length - i) / 1;
            if (charProgress >= 1) return char;
            if (charProgress <= 0)
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );

      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else setDisplay(target);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [target, duration, delay]);

  useEffect(() => {
    run();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [run]);

  return { display, replay: run };
}

/* ─── Floating particle ────────────────────────────────────────────────────*/
function Particle({ x, y, delay, duration, size, opacity }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: T.em,
        opacity,
        animation: `particleFloat ${duration}s ease-in-out ${delay}s infinite`,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}

/* ─── Animated SVG scroll/book ornament ───────────────────────────────────*/
function FloatingOrb() {
  return (
    <div
      style={{
        position: "relative",
        width: "clamp(280px, 40vw, 440px)",
        height: "clamp(280px, 40vw, 440px)",
        flexShrink: 0,
      }}
    >
      {/* Outer ring — slow rotate */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(16,185,129,0.12)",
          animation: "orbRotate 18s linear infinite",
        }}
      >
        {/* Ring tick marks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 2,
              height: i % 3 === 0 ? 12 : 6,
              background:
                i % 3 === 0 ? "rgba(16,185,129,0.5)" : "rgba(16,185,129,0.2)",
              left: "50%",
              top: 0,
              transformOrigin: "50% 50%",
              transform: `rotate(${i * 30}deg) translateX(-50%) translateY(0)`,
            }}
          />
        ))}
      </div>

      {/* Middle ring — counter-rotate */}
      <div
        style={{
          position: "absolute",
          inset: 32,
          borderRadius: "50%",
          border: "1px dashed rgba(16,185,129,0.08)",
          animation: "orbRotate 26s linear infinite reverse",
        }}
      />

      {/* Inner glow */}
      <div
        style={{
          position: "absolute",
          inset: 64,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 60%, transparent 100%)",
          animation: "orbPulse 4s ease-in-out infinite",
        }}
      />

      {/* Center SVG icon */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "clamp(80px,14vw,120px)",
            height: "clamp(80px,14vw,120px)",
            borderRadius: "28px",
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px rgba(16,185,129,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "iconFloat 5s ease-in-out infinite",
          }}
        >
          <svg
            width="clamp(40px,7vw,64px)"
            height="clamp(40px,7vw,64px)"
            viewBox="0 0 256 256"
            fill="none"
            stroke="rgba(16,185,129,0.7)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: "svgDraw 1.8s ease 0.3s both" }}
          >
            {/* Open book */}
            <path
              d="M48 80a96 96 0 0 1 80-16 96 96 0 0 1 80 16v128a96 96 0 0 0-80-16 96 96 0 0 0-80 16Z"
              strokeDasharray="700"
              strokeDashoffset="700"
              style={{
                animation:
                  "drawPath 1.6s cubic-bezier(0.16,1,0.3,1) 0.4s forwards",
              }}
            />
            <line
              x1="128"
              y1="64"
              x2="128"
              y2="240"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                animation:
                  "drawPath 0.8s cubic-bezier(0.16,1,0.3,1) 1.2s forwards",
              }}
            />
            {/* Question mark inside */}
            <path
              d="M96 104c0-17.67 14.33-32 32-32s32 14.33 32 32c0 12-8 20-20 28v12"
              stroke="rgba(16,185,129,0.4)"
              strokeWidth="8"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                animation:
                  "drawPath 1s cubic-bezier(0.16,1,0.3,1) 1.6s forwards",
              }}
            />
            <circle
              cx="128"
              cy="168"
              r="4"
              fill="rgba(16,185,129,0.5)"
              stroke="none"
            />
          </svg>
        </div>
      </div>

      {/* Orbiting dots */}
      {[0, 120, 240].map((deg, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            animation: `orbRotate ${12 + i * 4}s linear ${i * 1.5}s infinite`,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: i === 0 ? 8 : 5,
              height: i === 0 ? 8 : 5,
              borderRadius: "50%",
              background: T.em,
              opacity: i === 0 ? 0.8 : 0.4,
              top: "50%",
              left: 0,
              transform: `rotate(${deg}deg) translateX(-50%) translateY(-50%)`,
              transformOrigin: "50% 50%",
              boxShadow: i === 0 ? `0 0 12px ${T.em}` : "none",
            }}
          />
        </div>
      ))}

      {/* Floating particles around the orb */}
      {[
        { x: 10, y: 15, delay: 0, dur: 6, size: 3, op: 0.4 },
        { x: 85, y: 10, delay: 1.5, dur: 7, size: 2, op: 0.3 },
        { x: 90, y: 80, delay: 0.8, dur: 5, size: 4, op: 0.5 },
        { x: 5, y: 70, delay: 2.2, dur: 8, size: 2, op: 0.3 },
        { x: 50, y: 5, delay: 3, dur: 6, size: 3, op: 0.35 },
      ].map((p, i) => (
        <Particle
          key={i}
          x={p.x}
          y={p.y}
          delay={p.delay}
          duration={p.dur}
          size={p.size}
          opacity={p.op}
        />
      ))}
    </div>
  );
}

/* ─── Quick-link card ──────────────────────────────────────────────────────*/
function QuickLink({ href, label, desc, icon: Icon, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
        borderRadius: 14,
        textDecoration: "none",
        background: hov ? T.emDim : "rgba(255,255,255,0.025)",
        border: `1px solid ${hov ? T.emBrd : T.border}`,
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateX(4px)" : "none",
        animation: `fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}s both`,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          flexShrink: 0,
          background: hov ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${hov ? T.emBrd : T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hov ? T.em : T.muted,
          transition: "all 0.25s",
        }}
      >
        <Icon />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 13,
            fontWeight: 600,
            color: hov ? T.em : T.text,
            transition: "color 0.2s",
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 11,
            color: T.muted,
            marginTop: 2,
          }}
        >
          {desc}
        </div>
      </div>
      <span
        style={{
          color: hov ? T.em : "rgba(255,255,255,0.2)",
          transition: "color 0.2s, transform 0.2s",
          transform: hov ? "translateX(2px)" : "none",
          display: "flex",
        }}
      >
        <Ic.ChevR />
      </span>
    </Link>
  );
}

/* ══════════════════════════ 404 PAGE ════════════════════════════════════════*/
export default function NotFoundPage({ onGoHome }) {
  const [user] = useAuthState(auth);
  const { display: code, replay } = useScramble("404", {
    duration: 1400,
    delay: 200,
  });

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100dvh",
        color: T.text,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        @keyframes fadeUp       { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer      { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes orbRotate    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes orbPulse     { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
        @keyframes iconFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes particleFloat{ 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.2)} }
        @keyframes drawPath     { to{stroke-dashoffset:0} }
        @keyframes svgDraw      { from{opacity:0} to{opacity:1} }
        @keyframes pulse        { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes glitch1      { 0%,100%{clip-path:inset(0 0 95% 0)} 20%{clip-path:inset(15% 0 60% 0)} 40%{clip-path:inset(40% 0 30% 0)} 60%{clip-path:inset(70% 0 5% 0)} 80%{clip-path:inset(85% 0 0 0)} }
        @keyframes glitch2      { 0%,100%{clip-path:inset(0 0 95% 0);transform:translateX(0)} 20%{clip-path:inset(10% 0 70% 0);transform:translateX(-3px)} 40%{clip-path:inset(45% 0 25% 0);transform:translateX(3px)} 60%{clip-path:inset(65% 0 10% 0);transform:translateX(-2px)} 80%{clip-path:inset(80% 0 2% 0);transform:translateX(0)} }

        *{box-sizing:border-box;margin:0;padding:0}
        button,a{outline:none;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.2);border-radius:99px}
        ::selection{background:rgba(16,185,129,.3)}
      `}</style>

      {/* Fixed ambient glow — pointer-none, performance guard */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 400,
          borderRadius: "0 0 50% 50%",
          background:
            "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main content — asymmetric split (DESIGN_VARIANCE 8, anti-center Rule 3) */}
      <main
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px,6vw,80px)",
          alignItems: "center",
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          padding:
            "clamp(100px,14vw,140px) clamp(16px,4vw,40px) clamp(60px,8vw,100px)",
        }}
        className="not-found-grid"
      >
        <style>{`
          @media(max-width:767px){
            .not-found-grid{grid-template-columns:1fr!important; text-align:center}
            .orb-col{display:flex!important; justify-content:center!important; order:-1}
            .links-col{display:none!important}
          }
        `}</style>

        {/* ── LEFT: text content ── */}
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Eyebrow */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "4px 12px",
                borderRadius: 99,
                background: T.emDim,
                border: `1px solid ${T.emBrd}`,
                marginBottom: 18,
                animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: T.em,
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: T.em,
                  letterSpacing: "0.1em",
                }}
              >
                PAGE INTROUVABLE
              </span>
            </div>
            {/* Error code with scramble + glitch layers */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginBottom: 28,
                cursor: "pointer",
              }}
              onClick={replay}
              title="Cliquer pour rejouer l'animation"
            >
              {/* Glitch layer 1 */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  fontFamily: T.mono,
                  fontSize: "clamp(80px,14vw,140px)",
                  fontWeight: 800,
                  color: T.em,
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                  animation: "glitch1 4s step-end 2s infinite",
                  opacity: 0.35,
                }}
              >
                404
              </div>
              {/* Glitch layer 2 */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  fontFamily: T.mono,
                  fontSize: "clamp(80px,14vw,140px)",
                  fontWeight: 800,
                  color: "#ef4444",
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                  animation: "glitch2 4s step-end 2.15s infinite",
                  opacity: 0.2,
                }}
              >
                404
              </div>
              {/* Main scrambled display */}
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "clamp(80px,14vw,140px)",
                  fontWeight: 800,
                  background: `linear-gradient(135deg, #f1f5f9 0%, ${T.em} 60%, #34d399 100%)`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                  animation: "shimmer 5s linear infinite",
                  userSelect: "none",
                }}
              >
                {code}
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: T.sans,
              fontSize: "clamp(26px,4vw,42px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: T.text,
              lineHeight: 1.1,
              marginBottom: 16,
              animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.4s both",
            }}
          >
            Cette page n'existe pas
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
              dans nos Écritures.
            </span>
          </h1>

          {/* Body */}
          <p
            style={{
              fontFamily: T.sans,
              fontSize: 15,
              color: T.muted,
              lineHeight: 1.7,
              maxWidth: "42ch",
              marginBottom: 32,
              animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.5s both",
            }}
          >
            L'adresse que vous cherchez a peut-être été modifiée, supprimée ou
            n'a jamais existé. Retournez à l'accueil ou explorez nos quiz
            bibliques.
          </p>
          <p
            style={{
              fontFamily: T.sans,
              fontSize: 15,
              color: T.muted,
              lineHeight: 1.7,
              maxWidth: "42ch",
              marginBottom: 32,
              animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.5s both",
            }}
          >
            "Continuez à chercher, et vous trouverez." Matthieu 7:7
          </p>

          {/* Primary CTA */}
          <div
            style={{
              animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.6s both",
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 28px",
                borderRadius: 12,
                background: `linear-gradient(135deg,${T.em},#059669)`,
                fontFamily: T.sans,
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
                boxShadow: `0 6px 24px rgba(16,185,129,.35)`,
                transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(16,185,129,.45)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = `0 6px 24px rgba(16,185,129,.35)`;
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.97)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
            >
              <Ic.Home /> Retour à l'accueil
            </Link>
            <Link
              to="/quiz"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${T.border}`,
                fontFamily: T.sans,
                fontSize: 14,
                fontWeight: 500,
                color: T.muted,
                textDecoration: "none",
                transition: "all 0.22s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = T.text;
                e.currentTarget.style.borderColor = T.emBrd;
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = T.muted;
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              Explorer les quiz <Ic.ChevR />
            </Link>
          </div>

          {/* Quick links — left col only (desktop) */}
          <div
            className="links-col"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 40,
              paddingTop: 36,
              borderTop: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 10,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.1em",
                marginBottom: 6,
              }}
            >
              SUGGESTIONS
            </div>
            <QuickLink
              href="/"
              label="Accueil"
              desc="Retour à la page principale"
              icon={Ic.Home}
              delay={0.7}
            />
            <QuickLink
              href="/quiz"
              label="Liste des quiz"
              desc="Parcourir tous les quiz disponibles"
              icon={Ic.Book}
              delay={0.78}
            />
            {user && (
              <QuickLink
                href="/me"
                label="Page de profil"
                desc="Consultez votre profil"
                icon={Ic.Users}
                delay={0.78}
              />
            )}
            <QuickLink
              href="/faq"
              label="FAQ"
              desc="Questions fréquentes sur JWQuiz"
              icon={Ic.Search}
              delay={0.94}
            />
          </div>
        </div>

        {/* ── RIGHT: animated orb ── */}
        <div
          className="orb-col"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both",
          }}
        >
          <FloatingOrb />
        </div>
      </main>
    </div>
  );
}
