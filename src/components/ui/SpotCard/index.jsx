import { useRef, useCallback } from "react";

import T from "../DesignTokens";

/* ─── Spotlight card ───────────────────────────────────────────────────────*/
export default function SpotCard({ children, style = {}, onClick }) {
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
