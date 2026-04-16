import { Link } from "react-router-dom";

const em = "#10b981";

const Footer = () => {
  const footerLinks = [
    { name: "Mentions légales", href: "/mentions" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px clamp(20px,4vw,48px)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        backgroundColor: "#07050F",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: `linear-gradient(135deg,${em},#059669)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 22 22"
              fill="none"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M11 1 L13.5 8 L21 11 L13.5 14 L11 21 L8.5 14 L1 11 L8.5 8 Z" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Scriptura
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {footerLinks.map((l) => (
            <Link
              to={l.href}
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.7)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.3)")
              }
            >
              {l.name}
            </Link>
          ))}
        </div>
        <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          © 2026 Scriptura · Tous droits réservés
        </span>
      </div>
    </footer>
  );
};

export default Footer;
