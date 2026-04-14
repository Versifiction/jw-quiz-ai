import T from "../DesignTokens";

/* Avatar initials */
export default function Avatar({ name, size = 32 }) {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";
  const hue = ((name?.charCodeAt(0) ?? 0) * 37) % 360;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `hsl(${hue},45%,25%)`,
        border: `1.5px solid hsl(${hue},45%,38%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: T.mono,
        fontSize: size * 0.3,
        fontWeight: 700,
        color: `hsl(${hue},70%,72%)`,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
