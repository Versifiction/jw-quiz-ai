function Logo({ width, height, fontSize }) {
  const em = "#10b981";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 9,
      }}
      className="text-center"
    >
      <div
        style={{
          width,
          height,
          borderRadius: 9,
          background: `linear-gradient(135deg,${em},#059669)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 14px rgba(16,185,129,.35)`,
        }}
      >
        <svg
          width={width / 2}
          height={width / 2}
          viewBox="0 0 22 22"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 1 L13.5 8 L21 11 L13.5 14 L11 21 L8.5 14 L1 11 L8.5 8 Z" />
        </svg>
      </div>
      <span
        style={{
          fontFamily: "'Outfit',sans-serif",
          fontSize,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#fff",
        }}
      >
        Scriptura
      </span>
    </div>
  );
}

export default Logo;
