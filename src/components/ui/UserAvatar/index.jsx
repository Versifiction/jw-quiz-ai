import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";

export default function UserAvatar({ userId, width, height }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Garde-fou : ne rien faire si userId est absent
    if (!userId) return;

    let cancelled = false; // évite les mises à jour sur un composant démonté

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (cancelled) return; // composant démonté entre temps

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAvatarUrl(data.photoUrl ?? null);
          setUserName(data.displayName ?? "Utilisateur");
        } else {
          setError("Utilisateur introuvable.");
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUser();

    // Nettoyage au démontage du composant
    return () => {
      cancelled = true;
    };
  }, [userId]); // relance si userId change

  /* ── États ── */
  if (loading) {
    return (
      <div
        style={{
          width: width || 30,
          height: height || 30,
          borderRadius: "50%",
          background: "#1a1a2e",
          animation: "shimmer 1.4s ease-in-out infinite",
        }}
        aria-label="Chargement de l'avatar"
      />
    );
  }

  if (error) {
    return <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>;
  }

  if (!avatarUrl) {
    // Fallback : initiales si pas d'URL d'avatar
    return (
      <div
        style={{
          width: width || 30,
          height: height || 30,
          borderRadius: "50%",
          background: "#10b981",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 16,
          color: "#fff",
        }}
        aria-label={`Avatar de ${userName}`}
      >
        {userName.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Link to="/me">
      <img
        src={avatarUrl}
        alt={`Avatar de ${userName}`}
        width={width || 30}
        height={height || 30}
        style={{ borderRadius: "50%", objectFit: "cover", display: "block" }}
        referrerpolicy="no-referrer"
        // onError={(e) => {
        //   // Si l'image est cassée, on affiche les initiales
        //   e.currentTarget.style.display = "none";
        // }}
      />
    </Link>
  );
}
