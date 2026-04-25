import { useState } from "react";
import T from "../DesignTokens";
import { Ic } from "../Icons";

/* ─── Achievement badge ────────────────────────────────────────────────────*/
export default function AchievementBadge({ a, index }) {
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
