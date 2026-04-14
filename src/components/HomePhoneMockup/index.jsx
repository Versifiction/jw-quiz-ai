import { useState, useEffect } from "react";

import { Ic } from "../ui/Icons";
import Logo from "../ui/Logo";

/* ─── Phone mockup — pure SVG/JSX, no images ─────────────────────────────*/
export default function HomePhoneMockup() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 4), 1800);
    return () => clearInterval(id);
  }, []);

  const questions = [
    {
      q: "Quel fils de Jacob fut vendu comme esclave ?",
      opts: ["Ruben", "Joseph", "Siméon", "Lévi"],
      category: "Pentateuque",
      ans: 1,
    },
    {
      q: "Quel prophète fut envoyé à Ninive ?",
      opts: ["Élie", "Amos", "Jonas", "Michée"],
      category: "Prophètes",
      ans: 2,
    },
    {
      q: "Quel animal adressa la parole à Eve ?",
      opts: ["Un serpent", "Un oiseau", "Un lion", "Un agneau"],
      category: "Pentateuque",
      ans: 0,
    },
  ];
  const cur = questions[tick % questions.length];
  // const answered = tick % 2 === 1;

  return (
    <div
      style={{
        width: 230,
        flexShrink: 0,
        filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.45))",
        animation: "phoneFloat 4s ease-in-out infinite",
        willChange: "transform",
      }}
    >
      {/* Phone shell */}
      <div
        style={{
          background: "#0f0a1e",
          borderRadius: 36,
          padding: "10px 8px",
          border: "2px solid rgba(255,255,255,0.1)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Notch */}
        <div
          style={{
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 72,
              height: 20,
              background: "#0f0a1e",
              borderRadius: 12,
              border: "1.5px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>

        {/* Screen */}
        <div
          style={{
            background: "#1a1035",
            borderRadius: 24,
            padding: "16px 14px",
            minHeight: 400,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <Logo width={20} height={20} fontSize={12} />
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background:
                      i <= tick % 3 ? "#10b981" : "rgba(255,255,255,0.2)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: 3,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 99,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: `${((tick % 3) + 1) * 33}%`,
                height: "100%",
                background: "linear-gradient(90deg,#10b981,#34d399)",
                borderRadius: 99,
                transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>

          {/* Question */}
          <p
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#f1f5f9",
              lineHeight: 1.45,
              marginBottom: 16,
              minHeight: 40,
            }}
          >
            {cur.q}
          </p>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {" "}
            <div style={{ marginBottom: 10 }}>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#10b981",
                  background: "rgba(16,185,129,0.12)",
                  padding: "3px 8px",
                  borderRadius: 99,
                }}
              >
                {cur.category}
              </span>
            </div>
            {cur.opts.map((opt, i) => {
              const isCorrect = i === cur.ans;
              console.log("cur : ", cur);
              // const showResult = answered;
              return (
                <>
                  <div
                    key={i}
                    style={{
                      padding: "9px 11px",
                      borderRadius: 10,
                      background: isCorrect
                        ? "rgba(16,185,129,0.18)"
                        : i === 0
                          ? "rgba(239,68,68,0.12)"
                          : "rgba(255,255,255,0.06)",
                      border: `1px solid ${isCorrect ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 11,
                        color: isCorrect ? "#34d399" : "rgba(255,255,255,0.75)",
                      }}
                    >
                      {opt}
                    </span>
                    {isCorrect && (
                      <span style={{ color: "#10b981" }}>
                        <Ic.Check />
                      </span>
                    )}
                  </div>
                </>
              );
            })}
          </div>

          {/* Timer dot */}
          {/* <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10b981",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            /><span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {answered ? "Explication disponible" : "30 secondes restantes"}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
