"use client";
// ─── MultiplayerQuiz.jsx ──────────────────────────────────────────────────
//
// Dépendances : socket.io-client
// Installation : npm install socket.io-client
//
// Usage :
//   import MultiplayerQuiz from "./MultiplayerQuiz";
//   <MultiplayerQuiz
//     serverUrl="http://localhost:4000"
//     roomId="room_abc123"
//     user={{ id: "uid_001", displayName: "Élise Moreau" }}
//   />
// ─────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import { io } from "socket.io-client";

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
  info: "#6366f1",
  border: "rgba(255,255,255,0.08)",
  text: "#f1f5f9",
  muted: "rgba(241,245,249,0.45)",
  mono: "'JetBrains Mono', monospace",
  sans: "'Outfit', sans-serif",
};

/* ══════════════════════════ SVG ICONS ══════════════════════════════════════*/
const Ic = {
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
  Users: () => (
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
      <path d="M84 168c0-33.14 19.6-60 44-60s44 26.86 44 60" />
      <circle cx="128" cy="72" r="36" />
      <path d="M196 184c0-28.37 12.54-52 30-60" />
      <circle cx="196" cy="100" r="28" />
      <path d="M60 184c0-28.37-12.54-52-30-60" />
      <circle cx="60" cy="100" r="28" />
    </svg>
  ),
  Lightning: () => (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
      <path d="m213.85 125.46-112 120a8 8 0 0 1-13.69-7l14.66-76.34-57.6-21.74a8 8 0 0 1-2.47-13.18l112-120a8 8 0 0 1 13.69 7l-14.66 76.34 57.6 21.74a8 8 0 0 1 2.47 13.18Z" />
    </svg>
  ),
  Check: () => (
    <svg
      width="12"
      height="12"
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
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="26"
      strokeLinecap="round"
    >
      <path d="M200 56 56 200M56 56l144 144" />
    </svg>
  ),
  Crown: () => (
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
      <path d="M40 192 16 80l64 48 48-64 48 64 64-48-24 112Z" />
      <path d="M40 224h176" />
    </svg>
  ),
  Link: () => (
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
      <path d="M96 104a40 40 0 0 1 64 0" />
      <path d="m45.66 90 22.63-22.63A80 80 0 0 1 181.1 180.68L158.47 203.3A80 80 0 0 1 45.3 90.34Z" />
      <path d="m74.34 166-22.63 22.63A80 80 0 0 1 138.9 75.32l22.63-22.63A80 80 0 0 1 210.7 165.66Z" />
    </svg>
  ),
  Copy: () => (
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
      <rect x="40" y="40" width="144" height="144" rx="8" />
      <path d="M216 216H104a8 8 0 0 1-8-8V72" />
    </svg>
  ),
  Play: () => (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
      <path d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-24.32-13.65V40a16 16 0 0 1 24.32-13.65l144.08 88.14A15.74 15.74 0 0 1 240 128Z" />
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
    <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
      <path d="m234.5 114.38-45.1 39.36 13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31-51 31a16 16 0 0 1-23.84-17.34l13.49-58.54-45.11-39.42a16 16 0 0 1 9.12-28.06l59.46-5.15 23.21-55.36a15.95 15.95 0 0 1 29.44 0L166 81.17l59.44 5.15a16 16 0 0 1 9.11 28.06Z" />
    </svg>
  ),
  WiFi: () => (
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
      <path
        d="M128 200a12 12 0 1 1 0-24 12 12 0 0 1 0 24Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M93.9 166.1a50 50 0 0 1 68.2 0" />
      <path d="M64.3 136.5a91 91 0 0 1 127.4 0" />
      <path d="M34.7 107a132 132 0 0 1 186.6 0" />
    </svg>
  ),
  WifiOff: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
    >
      <path
        d="M128 200a12 12 0 1 1 0-24 12 12 0 0 1 0 24Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M40 40l176 176M93.9 166.1a50 50 0 0 1 68.2 0M64.3 136.5c9.3-9.3 20.3-16.6 32.4-21.6M34.7 107a132 132 0 0 1 30-22.3M160 115a91 91 0 0 1 31.7 21.5M194 86.6a132 132 0 0 1 27 20.4" />
    </svg>
  ),
  Home: () => (
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
      <path d="M208 222H48a8 8 0 0 1-8-8v-96l88-80 88 80v96a8 8 0 0 1-8 8Z" />
      <path d="M104 222v-88h48v88" />
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
};

/* ══════════════════════════ GAME STATE REDUCER ═════════════════════════════*/
const initialState = {
  phase: "connecting", // connecting | lobby | countdown | quiz | results
  room: null, // { id, code, hostId, settings }
  players: [], // [{ id, displayName, score, answered, rank }]
  question: null, // { text, options, category, difficulty, points }
  qIndex: 0,
  qTotal: 0,
  timeLeft: 30,
  selected: null, // index selected by local player
  answered: false,
  playerAnswers: {}, // { playerId: optionIndex } — real-time
  countdown: 3,
  results: [], // final sorted leaderboard
  error: null,
  connected: false,
  isHost: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "CONNECTED":
      return { ...state, phase: "lobby", connected: true, error: null };
    case "DISCONNECTED":
      return {
        ...state,
        connected: false,
        error: "Connexion perdue. Reconnexion…",
      };
    case "ERROR":
      return { ...state, error: action.msg, phase: "connecting" };
    case "ROOM_JOINED":
      return {
        ...state,
        room: action.room,
        players: action.players,
        isHost: action.isHost,
        phase: "lobby",
      };
    case "PLAYERS_UPDATE":
      return { ...state, players: action.players };
    case "COUNTDOWN":
      return { ...state, phase: "countdown", countdown: action.value };
    case "QUESTION_START":
      return {
        ...state,
        phase: "quiz",
        question: action.question,
        qIndex: action.qIndex,
        qTotal: action.qTotal,
        timeLeft: action.timeLeft,
        selected: null,
        answered: false,
        playerAnswers: {},
      };
    case "TICK":
      return { ...state, timeLeft: action.timeLeft };
    case "PLAYER_ANSWERED":
      return {
        ...state,
        playerAnswers: {
          ...state.playerAnswers,
          [action.playerId]: action.optionIndex,
        },
        players: state.players.map((p) =>
          p.id === action.playerId ? { ...p, answered: true } : p,
        ),
      };
    case "LOCAL_ANSWER":
      return { ...state, selected: action.index, answered: true };
    case "ROUND_END":
      return {
        ...state,
        players: action.players,
        answered: true,
        selected: state.selected,
      };
    case "GAME_END":
      return { ...state, phase: "results", results: action.results };
    default:
      return state;
  }
}

/* ══════════════════════════ SHARED PRIMITIVES ═══════════════════════════════*/

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

function Avatar({ name, size = 32, accent }) {
  const hue = accent || ((name?.charCodeAt(0) ?? 80) * 41) % 360;
  const col = typeof hue === "number" ? `hsl(${hue},50%,60%)` : hue;
  const bg = typeof hue === "number" ? `hsl(${hue},50%,18%)` : `${hue}25`;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        border: `1.5px solid ${col}50`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: T.mono,
        fontSize: size * 0.33,
        fontWeight: 700,
        color: col,
        flexShrink: 0,
        letterSpacing: "-0.02em",
      }}
    >
      {(name || "?")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </div>
  );
}

function Badge({ label, color = T.em }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 99,
        background: `${color}18`,
        border: `1px solid ${color}38`,
        fontFamily: T.mono,
        fontSize: 10,
        color,
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
}

/* ══════════════════════════ TIMER RING ══════════════════════════════════════*/
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
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.mono,
          fontSize: 15,
          fontWeight: 700,
          color: danger ? T.err : T.text,
          transition: "color 0.3s",
        }}
      >
        {time}
      </div>
    </div>
  );
}

/* ══════════════════════════ PLAYER ROW (live scoreboard) ════════════════════*/
function PlayerRow({ player, rank, isLocal, isHost }) {
  const rankColors = ["#f59e0b", "rgba(255,255,255,0.55)", "#cd7c2e"];
  const rankColor = rank <= 3 ? rankColors[rank - 1] : "rgba(255,255,255,0.25)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 12,
        background: isLocal ? T.emDim : "rgba(255,255,255,0.025)",
        border: `1px solid ${isLocal ? T.emBrd : T.border}`,
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        animation: "slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      {/* Rank */}
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 12,
          fontWeight: 700,
          color: rankColor,
          minWidth: 20,
          textAlign: "center",
        }}
      >
        {rank <= 3 ? ["1st", "2nd", "3rd"][rank - 1] : `#${rank}`}
      </div>

      <Avatar name={player.displayName} size={30} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: isLocal ? 600 : 400,
              color: isLocal ? T.em : T.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {player.displayName}
          </span>
          {isHost && (
            <span style={{ color: T.warn, display: "flex" }}>
              <Ic.Crown />
            </span>
          )}
          {isLocal && <Badge label="Vous" color={T.em} />}
        </div>
      </div>

      {/* Answer indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {player.answered && (
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: T.emDim,
              border: `1px solid ${T.emBrd}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.em,
              animation: "popIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <Ic.Check />
          </div>
        )}
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 13,
            fontWeight: 700,
            color: rank <= 3 ? rankColor : "rgba(255,255,255,0.6)",
            minWidth: 44,
            textAlign: "right",
          }}
        >
          {player.score.toLocaleString("fr-FR")}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ OPTION BUTTON ═══════════════════════════════════*/
function OptionBtn({
  label,
  index,
  localStatus,
  peersAnsweredHere,
  onClick,
  delay,
  totalPlayers,
}) {
  // localStatus: "idle" | "correct" | "wrong" | "missed"
  const rippleRef = useRef(null);
  const letters = ["A", "B", "C", "D"];

  const colors = {
    idle: {
      bg: "rgba(255,255,255,0.04)",
      border: T.border,
      text: "rgba(255,255,255,0.78)",
      badge: "rgba(255,255,255,0.07)",
    },
    correct: {
      bg: T.emDim,
      border: T.emBrd,
      text: T.em,
      badge: "rgba(16,185,129,0.18)",
    },
    wrong: {
      bg: T.errDim,
      border: T.errBrd,
      text: T.err,
      badge: "rgba(239,68,68,0.18)",
    },
    missed: {
      bg: T.emDim,
      border: T.emBrd,
      text: T.em,
      badge: "rgba(16,185,129,0.15)",
    },
  }[localStatus];

  const handleClick = (e) => {
    if (localStatus !== "idle") return;
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

  return (
    <button
      onClick={handleClick}
      disabled={localStatus !== "idle"}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        padding: "13px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        cursor: localStatus === "idle" ? "pointer" : "default",
        textAlign: "left",
        transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
        animation: `fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) ${delay}s both`,
      }}
      onMouseEnter={(e) => {
        if (localStatus === "idle")
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
      }}
      onMouseLeave={(e) => {
        if (localStatus === "idle")
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseDown={(e) => {
        if (localStatus === "idle")
          e.currentTarget.style.transform = "scale(0.975)";
      }}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
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

      {/* Letter badge */}
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
          fontFamily: T.mono,
          fontSize: 11,
          fontWeight: 700,
          color: colors.text,
          transition: "all 0.22s",
        }}
      >
        {localStatus !== "idle" ? (
          localStatus === "wrong" ? (
            <Ic.X />
          ) : (
            <Ic.Check />
          )
        ) : (
          letters[index]
        )}
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: T.sans,
          fontSize: 14,
          fontWeight: 500,
          color: localStatus === "idle" ? "rgba(255,255,255,0.8)" : colors.text,
          flex: 1,
          lineHeight: 1.4,
          transition: "color 0.22s",
        }}
      >
        {label}
      </span>

      {/* Peer avatars who chose this option */}
      {peersAnsweredHere.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
          }}
        >
          {peersAnsweredHere.slice(0, 4).map((p, i) => (
            <div
              key={p.id}
              style={{
                marginLeft: i ? -6 : 0,
                zIndex: i,
                animation: "popIn 0.25s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              <Avatar name={p.displayName} size={22} />
            </div>
          ))}
          {peersAnsweredHere.length > 4 && (
            <span
              style={{
                fontFamily: T.mono,
                fontSize: 9,
                color: T.muted,
                marginLeft: 4,
              }}
            >
              +{peersAnsweredHere.length - 4}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

/* ══════════════════════════ COUNTDOWN OVERLAY ═══════════════════════════════*/
function CountdownOverlay({ value }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(7,5,15,0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: "clamp(80px,15vw,140px)",
            fontWeight: 800,
            color: T.em,
            lineHeight: 1,
            letterSpacing: "-0.06em",
            animation: "countPulse 0.8s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {value > 0 ? value : "Go"}
        </div>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 16,
            color: T.muted,
            marginTop: 12,
            letterSpacing: "0.06em",
          }}
        >
          La partie commence…
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ LOBBY SCREEN ════════════════════════════════════*/
function LobbyScreen({ room, players, user, isHost, onStart, onCopyCode }) {
  const ready = players.length >= 2;
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 36,
            animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "4px 14px",
              borderRadius: 99,
              background: T.emDim,
              border: `1px solid ${T.emBrd}`,
              marginBottom: 16,
            }}
          >
            <span style={{ color: T.em }}>
              <Ic.Users />
            </span>
            <span
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.em,
                letterSpacing: "0.08em",
              }}
            >
              SALLE D'ATTENTE
            </span>
          </div>
          <h1
            style={{
              fontFamily: T.sans,
              fontSize: "clamp(28px,5vw,42px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: T.text,
              marginBottom: 8,
              lineHeight: 1.1,
            }}
          >
            Quiz multijoueur
          </h1>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.muted }}>
            En attente des joueurs…
          </p>
        </div>

        {/* Room code */}
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: "20px 24px",
            marginBottom: 16,
            animation: "fadeUp 0.4s 0.1s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
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
            Code de la salle
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 32,
                fontWeight: 800,
                color: T.em,
                letterSpacing: "0.15em",
              }}
            >
              {room?.code || "------"}
            </div>
            <button
              onClick={onCopyCode}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${T.border}`,
                cursor: "pointer",
                fontFamily: T.sans,
                fontSize: 12,
                color: T.muted,
                transition: "all 0.2s",
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
              <Ic.Copy /> Copier
            </button>
          </div>
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 12,
              color: T.muted,
              marginTop: 8,
            }}
          >
            Partagez ce code pour inviter des joueurs
          </div>
        </div>

        {/* Players list */}
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: "20px 24px",
            marginBottom: 16,
            animation: "fadeUp 0.4s 0.18s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Joueurs
            </div>
            <Badge label={`${players.length} / 8`} color={T.em} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {players.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom:
                    i < players.length - 1 ? `1px solid ${T.border}` : "none",
                  animation: `fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both`,
                }}
              >
                <Avatar name={p.displayName} size={32} />
                <span
                  style={{
                    fontFamily: T.sans,
                    fontSize: 14,
                    fontWeight: p.id === user.id ? 600 : 400,
                    color: p.id === user.id ? T.em : T.text,
                    flex: 1,
                  }}
                >
                  {p.displayName}
                </span>
                {p.id === room?.hostId && (
                  <span style={{ color: T.warn }}>
                    <Ic.Crown />
                  </span>
                )}
                {p.id === user.id && <Badge label="Vous" color={T.em} />}
              </div>
            ))}
            {players.length < 2 && (
              <div style={{ padding: "12px 0", textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  En attente d'au moins un autre joueur…
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Start button (host only) */}
        {isHost && (
          <button
            onClick={onStart}
            disabled={!ready}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: ready
                ? `linear-gradient(135deg,${T.em},#059669)`
                : "rgba(255,255,255,0.06)",
              border: "none",
              cursor: ready ? "pointer" : "not-allowed",
              fontFamily: T.sans,
              fontSize: 15,
              fontWeight: 700,
              color: ready ? "#fff" : "rgba(255,255,255,0.3)",
              boxShadow: ready ? `0 6px 24px rgba(16,185,129,.3)` : "none",
              transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              animation: "fadeUp 0.4s 0.26s cubic-bezier(0.16,1,0.3,1) both",
            }}
            onMouseEnter={(e) => {
              if (ready) e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            onMouseDown={(e) => {
              if (ready) e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          >
            <Ic.Play /> Lancer la partie
          </button>
        )}
        {!isHost && (
          <div
            style={{
              textAlign: "center",
              padding: "14px 0",
              fontFamily: T.sans,
              fontSize: 13,
              color: T.muted,
              animation: "fadeUp 0.4s 0.26s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            En attente que l'hôte lance la partie…
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════ RESULTS SCREEN ══════════════════════════════════*/
function ResultsScreen({ results, user, onPlayAgain, onHome }) {
  const podiumColors = [T.warn, "rgba(255,255,255,0.55)", "#cd7c2e"];
  const myResult = results.find((p) => p.id === user.id);
  const myRank = results.indexOf(myResult) + 1;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: T.em,
              marginBottom: 10,
            }}
          >
            Fin de partie
          </div>
          <h2
            style={{
              fontFamily: T.sans,
              fontSize: "clamp(26px,4vw,38px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.text,
              marginBottom: 6,
              lineHeight: 1.1,
            }}
          >
            {myRank === 1
              ? "Victoire !"
              : myRank <= 3
                ? `Podium — ${myRank}${myRank === 2 ? "e" : "e"}`
                : "Résultats finaux"}
          </h2>
          {myResult && (
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 14,
                color: T.warn,
                fontWeight: 700,
              }}
            >
              Votre score : {myResult.score.toLocaleString("fr-FR")} pts
            </div>
          )}
        </div>

        {/* Podium top 3 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1fr",
            gap: 8,
            marginBottom: 16,
            alignItems: "end",
          }}
        >
          {[results[1], results[0], results[2]].map((p, col) => {
            if (!p) return <div key={col} />;
            const rank = [2, 1, 3][col];
            const h = [80, 108, 64][col];
            return (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${col * 0.08}s both`,
                }}
              >
                <Avatar name={p.displayName} size={col === 1 ? 44 : 34} />
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 12,
                    fontWeight: 600,
                    color: podiumColors[rank - 1],
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {p.displayName.split(" ")[0]}
                </div>
                <div
                  style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}
                >
                  {p.score.toLocaleString("fr-FR")} pts
                </div>
                <div
                  style={{
                    width: "100%",
                    height: h,
                    borderRadius: "10px 10px 0 0",
                    background: `${podiumColors[rank - 1]}18`,
                    border: `1px solid ${podiumColors[rank - 1]}35`,
                    borderBottom: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.mono,
                      fontSize: col === 1 ? 24 : 18,
                      fontWeight: 800,
                      color: podiumColors[rank - 1],
                    }}
                  >
                    {rank}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full leaderboard */}
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {results.map((p, i) => {
            const isLocal = p.id === user.id;
            return (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 18px",
                  borderBottom:
                    i < results.length - 1 ? `1px solid ${T.border}` : "none",
                  background: isLocal ? T.emDim : "transparent",
                  animation: `fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both`,
                }}
              >
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 12,
                    fontWeight: 700,
                    color: i < 3 ? podiumColors[i] : T.muted,
                    minWidth: 28,
                  }}
                >
                  #{i + 1}
                </div>
                <Avatar name={p.displayName} size={30} />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: isLocal ? 600 : 400,
                      color: isLocal ? T.em : T.text,
                    }}
                  >
                    {p.displayName}
                    {isLocal ? " (vous)" : ""}
                  </div>
                  <div
                    style={{ fontFamily: T.mono, fontSize: 10, color: T.muted }}
                  >
                    {p.correctAnswers || 0} bonnes réponses
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 14,
                    fontWeight: 700,
                    color: i < 3 ? podiumColors[i] : T.muted,
                  }}
                >
                  {p.score.toLocaleString("fr-FR")}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onPlayAgain}
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: 12,
              background: `linear-gradient(135deg,${T.em},#059669)`,
              border: "none",
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              transition: "all 0.22s",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.97)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          >
            <Ic.Refresh /> Rejouer
          </button>
          <button
            onClick={onHome}
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${T.border}`,
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 14,
              color: T.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
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
          >
            <Ic.Home /> Accueil
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ MAIN COMPONENT ══════════════════════════════════*/
export default function MultiplayerQuiz({ serverUrl, roomId, user, onLeave }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const socketRef = useRef(null);
  const [copied, setCopied] = useState(false);

  /* ── Socket.io connection ─────────────────────────────────────────────── */
  useEffect(() => {
    const socket = io(serverUrl, {
      auth: { userId: user.id, displayName: user.displayName },
      query: { roomId },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1500,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    /* ── Event listeners ── */
    socket.on("connect", () => {
      dispatch({ type: "CONNECTED" });
      socket.emit("join_room", { roomId });
    });

    socket.on("disconnect", () => dispatch({ type: "DISCONNECTED" }));

    socket.on("connect_error", (err) =>
      dispatch({
        type: "ERROR",
        msg: `Impossible de se connecter : ${err.message}`,
      }),
    );

    socket.on("room_joined", ({ room, players, isHost }) =>
      dispatch({ type: "ROOM_JOINED", room, players, isHost }),
    );

    socket.on("players_update", ({ players }) =>
      dispatch({ type: "PLAYERS_UPDATE", players }),
    );

    socket.on("countdown", ({ value }) =>
      dispatch({ type: "COUNTDOWN", value }),
    );

    socket.on("question_start", ({ question, qIndex, qTotal, timeLeft }) =>
      dispatch({ type: "QUESTION_START", question, qIndex, qTotal, timeLeft }),
    );

    socket.on("tick", ({ timeLeft }) => dispatch({ type: "TICK", timeLeft }));

    socket.on("player_answered", ({ playerId, optionIndex }) =>
      dispatch({ type: "PLAYER_ANSWERED", playerId, optionIndex }),
    );

    socket.on("round_end", ({ players }) =>
      dispatch({ type: "ROUND_END", players }),
    );

    socket.on("game_end", ({ results }) =>
      dispatch({ type: "GAME_END", results }),
    );

    /* ── Cleanup ── */
    return () => {
      socket.off();
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverUrl, roomId]);

  /* ── Actions ─────────────────────────────────────────────────────────── */
  const handleAnswer = useCallback(
    (optionIndex) => {
      if (state.answered || !socketRef.current) return;
      dispatch({ type: "LOCAL_ANSWER", index: optionIndex });
      socketRef.current.emit("submit_answer", {
        roomId,
        optionIndex,
        timeLeft: state.timeLeft,
      });
    },
    [state.answered, state.timeLeft, roomId],
  );

  const handleStart = useCallback(() => {
    socketRef.current?.emit("start_game", { roomId });
  }, [roomId]);

  const handlePlayAgain = useCallback(() => {
    socketRef.current?.emit("play_again", { roomId });
  }, [roomId]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(state.room?.code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [state.room?.code]);

  /* ── Derived ──────────────────────────────────────────────────────────── */
  const {
    phase,
    players,
    question,
    qIndex,
    qTotal,
    timeLeft,
    selected,
    answered,
    playerAnswers,
    countdown,
    results,
    error,
    isHost,
  } = state;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const localPlayer = players.find((p) => p.id === user.id);

  const getOptionStatus = (i) => {
    if (!answered) return "idle";
    if (i === question?.correctIndex) return "correct";
    if (i === selected) return "wrong";
    return "idle";
  };

  const peersForOption = (i) =>
    players.filter((p) => p.id !== user.id && playerAnswers[p.id] === i);

  const diffColor =
    { easy: T.em, medium: T.warn, hard: T.err }[question?.difficulty] || T.em;

  /* ── Render phases ────────────────────────────────────────────────────── */
  if (phase === "connecting") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
          @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
          @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
          @keyframes rippleOut{to{transform:translate(-50%,-50%) scale(40);opacity:0}}
          @keyframes popIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
          @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
          @keyframes countPulse{from{opacity:0;transform:scale(1.4)}to{opacity:1;transform:scale(1)}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
          *{box-sizing:border-box;margin:0;padding:0}
          button{outline:none;-webkit-tap-highlight-color:transparent}
          ::-webkit-scrollbar{width:4px}
          ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.2);border-radius:99px}
        `}</style>
        <div style={{ color: state.connected ? T.em : T.muted }}>
          {state.connected ? <Ic.WiFi /> : <Ic.WifiOff />}
        </div>
        {error ? (
          <div
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 15,
              color: T.err,
              textAlign: "center",
              maxWidth: 360,
            }}
          >
            {error}
          </div>
        ) : (
          <div
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 15,
              color: T.muted,
            }}
          >
            Connexion en cours…
          </div>
        )}
        {error && (
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              background: T.emDim,
              border: `1px solid ${T.emBrd}`,
              cursor: "pointer",
              fontFamily: "'Outfit',sans-serif",
              fontSize: 13,
              color: T.em,
            }}
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100dvh", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes rippleOut{to{transform:translate(-50%,-50%) scale(40);opacity:0}}
        @keyframes popIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes countPulse{from{opacity:0;transform:scale(1.4)}to{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        *{box-sizing:border-box;margin:0;padding:0}
        button{outline:none;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.2);border-radius:99px}
      `}</style>

      {phase === "lobby" && (
        <LobbyScreen
          room={state.room}
          players={players}
          user={user}
          isHost={isHost}
          onStart={handleStart}
          onCopyCode={handleCopyCode}
        />
      )}

      {phase === "countdown" && <CountdownOverlay value={countdown} />}

      {phase === "quiz" && question && (
        <>
          {countdown > 0 && <CountdownOverlay value={countdown} />}

          {/* Top bar */}
          <div
            style={{
              borderBottom: `1px solid ${T.border}`,
              padding: "0 clamp(16px,3vw,32px)",
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: T.surf,
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: `linear-gradient(135deg,${T.em},#059669)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="12"
                  height="12"
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
                  fontFamily: T.sans,
                  fontSize: 14,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.02em",
                }}
              >
                Scriptura
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>
                {qIndex + 1} / {qTotal}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: state.connected ? T.em : T.err,
                    animation: state.connected
                      ? "pulse 2s ease-in-out infinite"
                      : "none",
                  }}
                />
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: state.connected ? T.em : T.err,
                  }}
                >
                  {players.length} joueurs
                </span>
              </div>
            </div>
          </div>

          {/* Progress stripe */}
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
            <div
              style={{
                height: "100%",
                width: `${(qIndex / qTotal) * 100}%`,
                background: `linear-gradient(90deg,${T.em},#34d399)`,
                transition: "width 0.55s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>

          {/* Main layout: 2fr question / 1fr scoreboard */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              minHeight: "calc(100dvh - 59px)",
              alignItems: "start",
            }}
            className="mp-grid"
          >
            <style>{`@media(max-width:900px){.mp-grid{grid-template-columns:1fr!important}.score-col{display:none!important}}`}</style>

            {/* LEFT: question + options */}
            <div
              style={{
                padding: "clamp(20px,3vw,36px)",
                borderRight: `1px solid ${T.border}`,
              }}
            >
              {/* Meta */}
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
                      marginBottom: 8,
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
                        fontFamily: T.mono,
                        fontSize: 11,
                        color: T.em,
                      }}
                    >
                      <Ic.Book /> {question.category || "Général"}
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
                        fontFamily: T.mono,
                        fontSize: 11,
                        color: diffColor,
                      }}
                    >
                      <Ic.Star />{" "}
                      {question.difficulty === "easy"
                        ? "Initié"
                        : question.difficulty === "medium"
                          ? "Érudit"
                          : "Lettré"}{" "}
                      · +{question.points || 10} pts
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    Question {qIndex + 1}/{qTotal}
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
                  <TimerRing time={timeLeft} total={question.timeLimit || 30} />
                  {timeLeft <= 10 && (
                    <span
                      style={{
                        fontFamily: T.mono,
                        fontSize: 9,
                        color: T.err,
                        animation: "pulse 0.75s ease-in-out infinite",
                      }}
                    >
                      URGENT
                    </span>
                  )}
                </div>
              </div>

              {/* Score row */}
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
                <span style={{ color: T.warn }}>
                  <Ic.Trophy />
                </span>
                <span
                  style={{ fontFamily: T.sans, fontSize: 13, color: T.muted }}
                >
                  Mon score :
                </span>
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: 15,
                    fontWeight: 800,
                    color: T.warn,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {(localPlayer?.score || 0).toLocaleString("fr-FR")} pts
                </span>
                {/* Answered indicator */}
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: T.muted,
                  }}
                >
                  {players.filter((p) => p.answered).length}/{players.length}{" "}
                  répondu
                </div>
              </div>

              {/* Question text */}
              <h2
                style={{
                  fontFamily: T.sans,
                  fontSize: "clamp(17px,2.5vw,21px)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: T.text,
                  lineHeight: 1.42,
                  marginBottom: 20,
                  animation:
                    "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) 0.04s both",
                }}
              >
                {question.text || question.entitled}
              </h2>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(question.options || question.choices || []).map((opt, i) => (
                  <OptionBtn
                    key={i}
                    label={opt}
                    index={i}
                    localStatus={getOptionStatus(i)}
                    peersAnsweredHere={peersForOption(i)}
                    onClick={() => handleAnswer(i)}
                    delay={i * 0.055}
                    totalPlayers={players.length}
                  />
                ))}
              </div>

              {/* Explanation (after answered) */}
              {answered && question.explanation && (
                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 18,
                    borderTop: `1px solid ${T.border}`,
                    animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
                  }}
                >
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 13,
                      color: T.muted,
                      lineHeight: 1.68,
                    }}
                  >
                    {question.explanation}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: live scoreboard */}
            <div
              className="score-col"
              style={{
                padding: "clamp(16px,2vw,24px)",
                position: "sticky",
                top: 59,
                maxHeight: "calc(100dvh - 59px)",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 14,
                }}
              >
                Classement en direct
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sortedPlayers.map((p, i) => (
                  <PlayerRow
                    key={p.id}
                    player={p}
                    rank={i + 1}
                    isLocal={p.id === user.id}
                    isHost={p.id === state.room?.hostId}
                  />
                ))}
              </div>

              {/* Answered progress */}
              <div
                style={{
                  marginTop: 20,
                  padding: "14px 0",
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 7,
                  }}
                >
                  <span
                    style={{ fontFamily: T.mono, fontSize: 10, color: T.muted }}
                  >
                    Ont répondu
                  </span>
                  <span
                    style={{ fontFamily: T.mono, fontSize: 10, color: T.em }}
                  >
                    {players.filter((p) => p.answered).length} /{" "}
                    {players.length}
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 99,
                  }}
                >
                  <div
                    style={{
                      width: `${(players.filter((p) => p.answered).length / players.length) * 100}%`,
                      height: "100%",
                      background: `linear-gradient(90deg,${T.em},#34d399)`,
                      borderRadius: 99,
                      transition: "width 0.45s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {phase === "results" && (
        <ResultsScreen
          results={results}
          user={user}
          onPlayAgain={handlePlayAgain}
          onHome={onLeave || (() => {})}
        />
      )}
    </div>
  );
}
