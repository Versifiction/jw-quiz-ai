import T from "../DesignTokens";

/* Pill badge */
export default function Badge({ label, color = T.em }) {
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
