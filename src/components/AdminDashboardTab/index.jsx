import T from "../ui/DesignTokens";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import KpiTile from "../ui/KpiTitle";

export default function AdminDashboardTab({ questions, users }) {
  const totalQ = questions.length;
  const totalU = users.length;
  const activeU = users.filter((u) => u.status !== "suspended").length;
  const avgPts = questions.reduce((s, q) => s + (q.points || 0), 0);
  const cats = [...new Set(questions.map((q) => q.category).filter(Boolean))];
  const diffDist = { facile: 0, moyen: 0, difficile: 0 };
  questions.forEach((q) => {
    if (q.difficulty in diffDist) diffDist[q.difficulty]++;
  });

  return (
    <div style={{ animation: "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) both" }}>
      {/* KPI row — divide-y pattern */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          background: T.surf,
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <KpiTile
          label="Questions totales"
          value={totalQ}
          delta="+3 ce mois"
          color={T.em}
        />
        <KpiTile
          label="Membres inscrits"
          value={totalU}
          delta="+12 ce mois"
          color="#6366f1"
        />
        <KpiTile label="Membres actifs" value={activeU} color={T.warn} />
        <KpiTile label="Points cumulés" value={avgPts} color={T.em} />
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Category distribution */}
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
              marginBottom: 18,
              letterSpacing: "-0.01em",
            }}
          >
            Questions par catégorie
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {cats.map((cat) => {
              const count = questions.filter((q) => q.category === cat).length;
              const pct = Math.round((count / totalQ) * 100) || 0;
              return (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 0",
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.sans,
                      fontSize: 13,
                      color: T.muted,
                      flex: 1,
                      lineHeight: 1,
                    }}
                  >
                    {cat}
                  </span>
                  <div
                    style={{
                      width: 80,
                      height: 4,
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 99,
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: T.em,
                        borderRadius: 99,
                        transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: T.mono,
                      fontSize: 11,
                      color: T.em,
                      minWidth: 24,
                      textAlign: "right",
                    }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
            {cats.length === 0 && (
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.2)",
                  textAlign: "center",
                  padding: "16px 0",
                }}
              >
                Aucune donnée
              </div>
            )}
          </div>
        </div>

        {/* Difficulty distribution */}
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
              marginBottom: 18,
              letterSpacing: "-0.01em",
            }}
          >
            Répartition par difficulté
          </div>
          {[
            { key: "facile", label: "facile", color: T.em },
            { key: "moyen", label: "moyen", color: T.warn },
            { key: "difficile", label: "difficile", color: T.err },
          ].map((d) => {
            const count = diffDist[d.key];
            const pct = totalQ ? Math.round((count / totalQ) * 100) : 0;
            return (
              <div
                key={d.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 0",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <Badge label={d.label} color={d.color} />
                <div
                  style={{
                    flex: 1,
                    height: 4,
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 99,
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: d.color,
                      borderRadius: 99,
                      transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: d.color,
                    minWidth: 32,
                    textAlign: "right",
                  }}
                >
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}

          {/* Recent users */}
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
              margin: "22px 0 14px",
              letterSpacing: "-0.01em",
            }}
          >
            Derniers inscrits
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {users.slice(0, 4).map((u) => (
              <div
                key={u.id}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <Avatar name={u.displayName || u.email} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.displayName || u.email}
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {u.role || "user"}
                  </div>
                </div>
                <Badge
                  label={u.status === "suspended" ? "suspendu" : "actif"}
                  color={u.status === "suspended" ? T.err : T.em}
                />
              </div>
            ))}
            {users.length === 0 && (
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                Aucun utilisateur
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
