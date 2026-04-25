import T from "../DesignTokens";
import Sk from "../Sk";

/* ─── Loading skeleton ─────────────────────────────────────────────────────*/
export default function ProfileSkeleton() {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "80px 0",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}
      >
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
          }}
        >
          <Sk w={96} h={96} r={99} />
          <Sk w="70%" h={18} r={8} />
          <Sk w="55%" h={12} r={6} />
          <Sk w="100%" h={40} r={10} />
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: T.surf,
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                padding: 24,
              }}
            >
              <Sk h={28} w="55%" style={{ marginBottom: 8 }} />
              <Sk h={12} w="70%" />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: 24,
            height: 200,
          }}
        >
          <Sk h={12} w="40%" style={{ marginBottom: 16 }} />
          {[0, 1, 2, 3].map((i) => (
            <Sk key={i} h={8} r={4} style={{ marginBottom: 12 }} />
          ))}
        </div>
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: 24,
            height: 200,
          }}
        >
          <Sk h={12} w="40%" />
        </div>
      </div>
    </div>
  );
}
