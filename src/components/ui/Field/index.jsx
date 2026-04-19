import T from "../DesignTokens";
import { Ic } from "../Icons";

/* Input field */
export default function Field({ label, helper, error, children }) {
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
