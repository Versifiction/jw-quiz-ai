import T from "../DesignTokens";

export default function KpiTile({ label, value, delta, color = T.em }) {
  return (
    <div
      style={{
        padding: "20px 0",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 26,
          fontWeight: 700,
          color,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>
        {label}
      </div>
      {delta && (
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 10,
            color: delta.startsWith("+") ? T.em : T.err,
            marginTop: 4,
          }}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
