import { useState, useEffect } from "react";

import { Ic } from "../Icons";
import Logo from "../Logo";

function Nav() {
  const em = "#10b981";
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = ["Catégories", "Classement", "À propos", "Rejoindre"];

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 clamp(20px,4vw,48px)",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: navScrolled ? `rgba(7,5,15,0.92)` : "transparent",
        borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <Logo width={30} height={30} fontSize={16} />
      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            background: "rgba(7,5,15,0.97)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            animation: "fadeIn 0.25s ease",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              fontSize: 24,
            }}
          >
            ✕
          </button>
          {navLinks.map((l) => (
            <a
              key={l}
              href="#"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
              }}
            >
              {l}
            </a>
          ))}
        </div>
      )}
      {/* Desktop links */}
      <div
        className="nav-links"
        style={{ display: "flex", alignItems: "center", gap: 32 }}
      >
        {navLinks.slice(0, -1).map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) =>
              (e.target.style.color = "rgba(255,255,255,0.5)")
            }
          >
            {l}
          </a>
        ))}
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 20px",
            borderRadius: 99,
            background: `linear-gradient(135deg,${em},#059669)`,
            fontFamily: "'Outfit',sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            textDecoration: "none",
            boxShadow: `0 4px 20px rgba(16,185,129,.3)`,
            transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04) translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 8px 28px rgba(16,185,129,.4)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 4px 20px rgba(16,185,129,.3)`;
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
        >
          Commencer
          <Ic.ChevR />
        </a>
      </div>

      {/* Mobile burger */}
      <button
        onClick={() => setMenuOpen((m) => !m)}
        className="burger"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.7)",
          display: "none",
        }}
      >
        <Ic.MenuX />
      </button>

      <style>{`
          @media(max-width:767px){.nav-links{display:none!important}.burger{display:flex!important}}
        `}</style>
    </nav>
  );
}

export default Nav;
