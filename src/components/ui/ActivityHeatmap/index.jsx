import T from "../DesignTokens";

/* ─── Activity heatmap ─────────────────────────────────────────────────────*/
export default function ActivityHeatmap({ weeks }) {
  const maxVal = 4;
  const em = T.em;
  const months = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const now = new Date();
  const startMonth = new Date(now);
  startMonth.setDate(startMonth.getDate() - 52 * 7);
  const monthLabels = [];
  for (let m = 0; m < 12; m++) {
    const d = new Date(startMonth);
    d.setMonth(startMonth.getMonth() + m);
    monthLabels.push({
      label: months[d.getMonth()],
      col: Math.floor(m * (52 / 12)),
    });
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 600 }}>
        {/* Month labels */}
        <div
          style={{ display: "flex", gap: 3, marginBottom: 6, paddingLeft: 0 }}
        >
          {weeks.map((_, wi) => {
            const ml = monthLabels.find((m) => m.col === wi);
            return (
              <div
                key={wi}
                style={{
                  width: 11,
                  flexShrink: 0,
                  fontFamily: T.mono,
                  fontSize: 9,
                  color: ml ? "rgba(255,255,255,0.28)" : "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {ml?.label || ""}
              </div>
            );
          })}
        </div>
        {/* Grid */}
        <div style={{ display: "flex", gap: 3 }}>
          {weeks.map((week, wi) => (
            <div
              key={wi}
              style={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {week.map((val, di) => {
                const intensity = val === 0 ? 0 : Math.min(val / maxVal, 1);
                const bg =
                  val === 0
                    ? "rgba(255,255,255,0.05)"
                    : `rgba(16,185,129,${0.15 + intensity * 0.75})`;
                return (
                  <div
                    key={di}
                    title={val ? `${val} quiz` : "Aucun"}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 3,
                      background: bg,
                      transition: "transform 0.15s",
                      cursor: val ? "pointer" : "default",
                    }}
                    onMouseEnter={(e) => {
                      if (val) e.currentTarget.style.transform = "scale(1.4)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Moins
          </span>
          {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background:
                  v === 0
                    ? "rgba(255,255,255,0.05)"
                    : `rgba(16,185,129,${0.15 + v * 0.75})`,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Plus
          </span>
        </div>
      </div>
    </div>
  );
}