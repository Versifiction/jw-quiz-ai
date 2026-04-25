import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

import { auth, db } from "../../config/firebase";
import UserAvatar from "../ui/UserAvatar";
import T from "../ui/DesignTokens";
import { Ic } from "../ui/Icons";
import Logo from "../ui/Logo";
import { navLinks } from "../../utils/shapes/navLinks";
import { admins } from "../../utils/shapes/admins";
import { useOnline } from "../../utils/hooks/useOnline";

function Nav() {
  const [user] = useAuthState(auth);
  const em = "#10b981";
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isOnline = useOnline();

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    console.log("user : ", user);
  }, [user]);

  useEffect(() => {
    async function addOrUpdateUserInDatabase() {
      if (user) {
        const userRef = doc(db, "users", user?.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          await updateDoc(userRef, {
            lastSeen: new Date(),
          });
        } else {
          await setDoc(userRef, {
            createdAt: new Date(),
            description: "",
            displayName: user?.displayName,
            email: user?.email,
            lastSeen: new Date(),
            photoUrl: user?.photoURL,
            id: user?.uid,
          });
        }
      }
    }

    addOrUpdateUserInDatabase();
  }, [user]);

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

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
          position: "relative",
        }}
      >
        <Logo width={30} height={30} fontSize={16} />
        {user && (
          <div
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: T.em,
              border: `2px solid ${T.bg}`,
              animation: "pulse 2.5s ease-in-out infinite",
            }}
          />
        )}

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
              <Link
                key={l}
                to={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                }}
              >
                {l.name}
              </Link>
            ))}
          </div>
        )}
        {/* Desktop links */}
        <div
          className="nav-links"
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          {navLinks.slice(0, -1).map((l) => (
            <Link
              key={l}
              to={l.href}
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
              {l.name === "Admin"
                ? admins.includes(user?.email)
                  ? l.name
                  : ""
                : l.name}
            </Link>
          ))}
          <Link
            to="/play"
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
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.97)")
            }
          >
            Jouer
            <Ic.ChevR />
          </Link>
          {!user ? (
            <div
              className="cursor-pointer w-3 h-3"
              style={{
                color: "rgba(255,255,255,0.5)",
              }}
              onClick={googleSignIn}
            >
              <Ic.User />
            </div>
          ) : (
            <div className="ml-4">
              <UserAvatar userId={user?.uid} />
            </div>
          )}
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
      </div>
    </nav>
  );
}

export default Nav;
