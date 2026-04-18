import { Link } from "react-router-dom";

import Logo from "../ui/Logo";

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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          gap: 8,
        }}
      >
        <Logo width={30} height={30} />
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
        {/* <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          © 2026 Scriptura · Tous droits réservés
        </span> */}
      </div>
    </footer>
  );
};

export default Footer;
