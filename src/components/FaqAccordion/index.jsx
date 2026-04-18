"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ─── Design tokens ────────────────────────────────────────────────────────*/
const T = {
  bg: "#07050f",
  surf: "#0f0a1e",
  surf2: "#14102a",
  em: "#10b981",
  emDim: "rgba(16,185,129,0.10)",
  emBrd: "rgba(16,185,129,0.25)",
  border: "rgba(255,255,255,0.08)",
  text: "#f1f5f9",
  muted: "rgba(241,245,249,0.45)",
  mono: "'JetBrains Mono', monospace",
  sans: "'Outfit', sans-serif",
};

/* ─── Icons ────────────────────────────────────────────────────────────────*/
const Ic = {
  ChevD: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m48 96 80 80 80-80" />
    </svg>
  ),
  Search: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
    >
      <circle cx="112" cy="112" r="80" />
      <path d="m224 224-57.37-57.37" />
    </svg>
  ),
  X: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="22"
      strokeLinecap="round"
    >
      <path d="M200 56 56 200M56 56l144 144" />
    </svg>
  ),
  Mail: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="16" y="64" width="224" height="168" rx="8" />
      <path d="m16 64 112 88 112-88" />
    </svg>
  ),
  Book: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M48 80a96 96 0 0 1 80-16 96 96 0 0 1 80 16v128a96 96 0 0 0-80-16 96 96 0 0 0-80 16Z" />
      <path d="M128 64v176" />
    </svg>
  ),
  User: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="128" cy="96" r="64" />
      <path d="M16 216c0-53 50.15-96 112-96s112 43 112 96" />
    </svg>
  ),
  Trophy: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M56 56v56a72 72 0 0 0 144 0V56Z" />
      <path d="M56 80H24a8 8 0 0 0-8 8v24a48 48 0 0 0 48 48h0M200 80h32a8 8 0 0 1 8 8v24a48 48 0 0 1-48 48h0" />
      <path d="M128 184v40M96 224h64" />
    </svg>
  ),
  Gear: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="128" cy="128" r="40" />
      <path d="M130.05 28a104 104 0 0 1 21.65 3.9l9.08 15.72a83.56 83.56 0 0 1 13.65 8l17.72-2.75a104 104 0 0 1 14.17 14.14l-2.75 17.72A83.56 83.56 0 0 1 211.4 99l15.72 9.08a104.13 104.13 0 0 1 .88 21.9l-15.72 9.08a83.56 83.56 0 0 1-7.98 13.65l2.75 17.72a104 104 0 0 1-14.14 14.17l-17.72-2.75a83.56 83.56 0 0 1-13.65 8L152 206.1A104 104 0 0 1 130.05 210a104.13 104.13 0 0 1-21.65-3.9l-9.08-15.72a83.56 83.56 0 0 1-13.65-8l-17.72 2.75A104 104 0 0 1 53.78 171l2.75-17.72A83.56 83.56 0 0 1 48.6 139l-15.72-9.08a104.13 104.13 0 0 1-.88-21.9L47.72 99a83.56 83.56 0 0 1 7.98-13.65L52.95 67.6A104 104 0 0 1 67.09 53.43l17.72 2.75a83.56 83.56 0 0 1 13.65-8L107.54 32A104 104 0 0 1 130.05 28Z" />
    </svg>
  ),
  Shield: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M40 114.79V56a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8v58.77c0 84.18-71.31 112.42-87.41 117.91a8 8 0 0 1-5.18 0C107.31 227.21 40 199 40 114.79Z" />
    </svg>
  ),
  Menu: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
    >
      <path d="M40 128h176M40 64h176M40 192h176" />
    </svg>
  ),
};

/* ─── FAQ data ─────────────────────────────────────────────────────────────*/
const CATEGORIES = [
  { id: "all", label: "Toutes", icon: Ic.Shield, color: T.em },
  { id: "general", label: "Général", icon: Ic.Book, color: "#f59e0b" },
  { id: "account", label: "Compte", icon: Ic.User, color: "#6366f1" },
  { id: "quiz", label: "Quiz", icon: Ic.Book, color: "#10b981" },
  { id: "scores", label: "Scores", icon: Ic.Trophy, color: "#f97316" },
  { id: "tech", label: "Technique", icon: Ic.Gear, color: "#14b8a6" },
];

const FAQ_ITEMS = [
  {
    id: "f1",
    cat: "general",
    q: "Qu'est-ce que Scriptura ?",
    a: "Scriptura est une application de quiz théocratique proposant plus de 295 questions vérifiées par des experts, réparties en six catégories bibliques. Elle permet à chacun, débutant ou érudit, de tester et approfondir sa connaissance des Écritures de manière ludique.",
  },
  {
    id: "f2",
    cat: "general",
    q: "L'application est-elle gratuite ?",
    a: "Oui, Scriptura est entièrement gratuite. L'inscription, l'accès aux quiz, au classement et aux réalisations sont sans frais. Nous ne proposons aucun achat intégré ni abonnement premium à ce jour.",
  },
  {
    id: "f3",
    cat: "general",
    q: "Les questions sont-elles fiables ?",
    a: "Chaque question est rédigée et validée par des théologiens et biblistes. Une explication sourcée accompagne chaque réponse, qu'elle soit correcte ou non, pour garantir un apprentissage rigoureux.",
  },
  {
    id: "f4",
    cat: "account",
    q: "Comment créer un compte ?",
    a: "Cliquez sur \"Commencer gratuitement\" depuis la page d'accueil. Vous pouvez vous inscrire via votre adresse e-mail ou avec votre compte Google grâce à Firebase Authentication. Aucune carte bancaire n'est requise.",
  },
  {
    id: "f5",
    cat: "account",
    q: "Comment modifier mes informations personnelles ?",
    a: "Depuis votre page Profil, cliquez sur l'icône de modification à côté de votre nom ou avatar. Vous pouvez changer votre pseudo, votre photo de profil et votre adresse e-mail. Les changements sont sauvegardés instantanément dans Firebase.",
  },
  {
    id: "f6",
    cat: "account",
    q: "Comment supprimer mon compte ?",
    a: "Rendez-vous dans Paramètres > Compte > Supprimer mon compte. Cette action est irréversible et supprime toutes vos données (scores, réalisations, historique) de nos serveurs Firebase dans un délai de 30 jours.",
  },
  {
    id: "f7",
    cat: "account",
    q: "J'ai oublié mon mot de passe, que faire ?",
    a: 'Sur l\'écran de connexion, cliquez sur "Mot de passe oublié" et saisissez votre adresse e-mail. Firebase vous enverra un lien de réinitialisation valable 1 heure. Vérifiez également vos spams.',
  },
  {
    id: "f8",
    cat: "quiz",
    q: "Comment fonctionne le système de points ?",
    a: "Chaque question rapporte un nombre de points selon sa difficulté : 10 pts pour les questions Initié, 20 pts pour Érudit, et 30 pts pour Lettré. En activant le bonus de rapidité, répondre vite vous rapporte jusqu'à 50 % de points supplémentaires.",
  },
  {
    id: "f9",
    cat: "quiz",
    q: "Peut-on jouer sans connexion Internet ?",
    a: "Non, Scriptura nécessite une connexion active pour charger les questions depuis Firebase et synchroniser vos scores. Une version hors-ligne avec un jeu de questions local est prévue dans une future version.",
  },
  {
    id: "f10",
    cat: "quiz",
    q: "Combien de temps dure un quiz ?",
    a: "Un quiz standard de 10 questions avec 30 secondes par question dure environ 6 à 7 minutes. Vous pouvez personnaliser la durée depuis la page Paramètres : de 5 à 50 questions, et de 10 à 120 secondes par question.",
  },
  {
    id: "f11",
    cat: "quiz",
    q: "Qu'est-ce que le mode multijoueur ?",
    a: "Le mode multijoueur permet d'affronter jusqu'à 8 joueurs en temps réel. L'hôte crée une salle et partage un code à 6 caractères. Les réponses de tous les joueurs sont synchronisées via WebSockets — les avatars des adversaires apparaissent en temps réel sur les options.",
  },
  {
    id: "f12",
    cat: "scores",
    q: "Comment fonctionne le classement mondial ?",
    a: "Le classement trie tous les membres par score total cumulé. Il se met à jour après chaque quiz complété. Vous pouvez filtrer par catégorie, par période (semaine, mois, tout temps) et voir votre évolution de rang.",
  },
  {
    id: "f13",
    cat: "scores",
    q: "Mes anciens scores sont-ils conservés ?",
    a: "Oui, l'intégralité de votre historique est conservée dans Firebase Firestore. Votre score total est la somme cumulée de toutes vos sessions. Vous pouvez consulter chaque quiz passé depuis votre page Profil.",
  },
  {
    id: "f14",
    cat: "scores",
    q: "Comment débloquer des réalisations ?",
    a: "Les 12 réalisations se débloquent automatiquement selon vos actions : terminer votre premier quiz, maintenir une série de 7 jours, atteindre un score parfait, etc. Chaque réalisation débloquée est visible sur votre profil public.",
  },
  {
    id: "f15",
    cat: "tech",
    q: "L'application fonctionne-t-elle sur mobile ?",
    a: "Oui, Scriptura est entièrement responsive. Elle est optimisée pour iOS Safari et Android Chrome. Nous utilisons min-h-[100dvh] pour éviter les problèmes de viewport sur mobile. Une application native est à l'étude.",
  },
  {
    id: "f16",
    cat: "tech",
    q: "Mes données sont-elles sécurisées ?",
    a: "Vos données sont stockées dans Firebase (Google Cloud) avec chiffrement au repos et en transit. Les règles de sécurité Firestore garantissent qu'un utilisateur ne peut lire que ses propres données. Nous ne revendons aucune donnée personnelle.",
  },
  {
    id: "f17",
    cat: "tech",
    q: "Comment signaler un bug ou une erreur dans une question ?",
    a: 'Utilisez le bouton "Signaler" visible sur chaque question après la révélation de la réponse, ou contactez-nous via la page Contact. Nous corrigeons les erreurs signalées dans un délai de 48 heures.',
  },
];

/* ─── Spotlight card ───────────────────────────────────────────────────────*/
function SpotCard({ children, style = {}, onClick }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onClick={onClick}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(160px at var(--mx,50%) var(--my,50%), rgba(16,185,129,0.06), transparent 80%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ─── Accordion item ───────────────────────────────────────────────────────*/
function AccordionItem({ item, isOpen, onToggle, index }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!bodyRef.current) return;
    setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <SpotCard
      style={{
        borderRadius: 16,
        background: isOpen
          ? "rgba(16,185,129,0.04)"
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${isOpen ? T.emBrd : T.border}`,
        transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
        animation: `fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) ${index * 0.045}s both`,
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "18px 22px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: T.sans,
            fontSize: 15,
            fontWeight: isOpen ? 600 : 400,
            color: isOpen ? T.text : "rgba(255,255,255,0.75)",
            lineHeight: 1.45,
            flex: 1,
            transition: "color 0.22s, font-weight 0.1s",
          }}
        >
          {item.q}
        </span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            flexShrink: 0,
            background: isOpen ? T.emDim : "rgba(255,255,255,0.05)",
            border: `1px solid ${isOpen ? T.emBrd : T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isOpen ? T.em : T.muted,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Ic.ChevD />
        </div>
      </button>

      {/* Body — animated via max-height */}
      <div
        style={{
          maxHeight: height,
          overflow: "hidden",
          transition: "max-height 0.38s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div ref={bodyRef} style={{ padding: "0 22px 20px" }}>
          <div
            style={{
              width: "100%",
              height: 1,
              background: T.border,
              marginBottom: 16,
            }}
          />
          <p
            style={{
              fontFamily: T.sans,
              fontSize: 14,
              color: T.muted,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </SpotCard>
  );
}

/* ─── Scroll reveal ────────────────────────────────────────────────────────*/
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(20px)",
        transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════ FAQ PAGE ════════════════════════════════════════*/
export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FAQ_ITEMS.filter((item) => {
      const matchCat = activeCat === "all" || item.cat === activeCat;
      const matchSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCat]);

  const handleToggle = (id) => {
    if (expandAll) {
      setExpandAll(false);
      setOpenId(id);
      return;
    }
    setOpenId((prev) => (prev === id ? null : id));
  };

  const isOpen = (id) => expandAll || openId === id;

  return (
    <div style={{ background: T.bg, minHeight: "100dvh", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        *{box-sizing:border-box;margin:0;padding:0}
        button{outline:none;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(16,185,129,.2);border-radius:99px}
        ::selection{background:rgba(16,185,129,.3)}
      `}</style>

      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          borderRadius: "0 0 50% 50%",
          background:
            "radial-gradient(ellipse,rgba(16,185,129,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(48px,6vw,80px) clamp(16px,4vw,40px) 100px",
        }}
      >
        {/* ── HEADER ── */}
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "4px 14px",
                borderRadius: 99,
                background: T.emDim,
                border: `1px solid ${T.emBrd}`,
                marginBottom: 20,
              }}
            >
              <span style={{ color: T.em }}>
                <Ic.Shield />
              </span>
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: T.em,
                  letterSpacing: "0.1em",
                }}
              >
                AIDE & SUPPORT
              </span>
            </div>
            <h1
              style={{
                fontFamily: T.sans,
                fontSize: "clamp(32px,5vw,56px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: T.text,
                lineHeight: 1.05,
                marginBottom: 16,
              }}
            >
              Questions
              <br />
              <span
                style={{
                  background: `linear-gradient(90deg,${T.em},#34d399)`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shimmer 4s linear infinite",
                }}
              >
                fréquentes.
              </span>
            </h1>
            <p
              style={{
                fontFamily: T.sans,
                fontSize: 16,
                color: T.muted,
                maxWidth: "50ch",
                lineHeight: 1.65,
              }}
            >
              Trouvez rapidement des réponses sur le fonctionnement de
              Scriptura, votre compte et les quiz bibliques.
            </p>
          </div>
        </Reveal>

        {/* ── SEARCH ── */}
        <Reveal delay={0.08}>
          <div style={{ position: "relative", marginBottom: 36 }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: T.muted,
                pointerEvents: "none",
              }}
            >
              <Ic.Search />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une question…"
              style={{
                width: "100%",
                padding: "14px 48px 14px 44px",
                borderRadius: 14,
                background: T.surf,
                border: `1px solid ${T.border}`,
                fontFamily: T.sans,
                fontSize: 14,
                color: T.text,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  cursor: "pointer",
                  color: T.muted,
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic.X />
              </button>
            )}
          </div>
        </Reveal>

        {/* ── MAIN GRID: nav left / accordion right ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 32,
            alignItems: "start",
          }}
          className="faq-grid"
        >
          <style>{`
            @media(max-width:767px){ .faq-grid{grid-template-columns:1fr!important} .cat-sidebar{display:none!important} }
          `}</style>

          {/* LEFT: category nav */}
          <Reveal delay={0.12}>
            <div
              className="cat-sidebar"
              style={{
                position: "sticky",
                top: 24,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.28)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  paddingLeft: 12,
                }}
              >
                Catégories
              </div>
              {CATEGORIES.map((cat) => {
                const active = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: active ? `${cat.color}15` : "transparent",
                      outline: active ? `1px solid ${cat.color}35` : "none",
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? cat.color : T.muted,
                      transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                        e.currentTarget.style.color = T.text;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = T.muted;
                      }
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.97)")
                    }
                    onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <span
                      style={{
                        color: active ? cat.color : "rgba(255,255,255,0.3)",
                        flexShrink: 0,
                      }}
                    >
                      <cat.icon />
                    </span>
                    {cat.label}
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily: T.mono,
                        fontSize: 10,
                        color: active ? cat.color : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {cat.id === "all"
                        ? FAQ_ITEMS.length
                        : FAQ_ITEMS.filter((i) => i.cat === cat.id).length}
                    </span>
                  </button>
                );
              })}

              {/* Divider + expand all */}
              <div
                style={{ height: 1, background: T.border, margin: "10px 0" }}
              />
              <button
                onClick={() => {
                  setExpandAll((e) => !e);
                  setOpenId(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.03)",
                  fontFamily: T.sans,
                  fontSize: 12,
                  color: T.muted,
                  transition: "all 0.2s",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = T.text;
                  e.currentTarget.style.borderColor = T.emBrd;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = T.muted;
                  e.currentTarget.style.borderColor = T.border;
                }}
              >
                <span style={{ color: T.em }}>
                  <Ic.ChevD />
                </span>
                {expandAll ? "Tout replier" : "Tout développer"}
              </button>
            </div>
          </Reveal>

          {/* RIGHT: accordion */}
          <div>
            {/* Mobile category pills */}
            <div
              style={{
                display: "none",
                overflowX: "auto",
                gap: 8,
                marginBottom: 20,
                paddingBottom: 4,
              }}
              className="mobile-cats"
            >
              <style>{`@media(max-width:767px){.mobile-cats{display:flex!important}}`}</style>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    flexShrink: 0,
                    padding: "6px 14px",
                    borderRadius: 99,
                    border: `1px solid ${activeCat === cat.id ? `${cat.color}50` : T.border}`,
                    background:
                      activeCat === cat.id ? `${cat.color}15` : "transparent",
                    fontFamily: T.sans,
                    fontSize: 12,
                    color: activeCat === cat.id ? cat.color : T.muted,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                {filtered.length} question{filtered.length !== 1 ? "s" : ""}
                {search ? ` pour "${search}"` : ""}
              </span>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "64px 0",
                  textAlign: "center",
                  animation: "fadeUp 0.35s ease both",
                }}
              >
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 40,
                    color: "rgba(255,255,255,0.05)",
                    marginBottom: 16,
                  }}
                >
                  ?
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 16,
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: 8,
                  }}
                >
                  Aucune question ne correspond
                </div>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCat("all");
                  }}
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    color: T.em,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Effacer les filtres
                </button>
              </div>
            )}

            {/* Accordion list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((item, i) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isOpen={isOpen(item.id)}
                  onToggle={() => handleToggle(item.id)}
                  index={i}
                />
              ))}
            </div>

            {/* Contact CTA */}
            {filtered.length > 0 && (
              <Reveal delay={0.1}>
                <div
                  style={{
                    marginTop: 48,
                    padding: "28px 28px",
                    borderRadius: 20,
                    background: T.surf,
                    border: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 15,
                        fontWeight: 700,
                        color: T.text,
                        marginBottom: 4,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Vous n'avez pas trouvé votre réponse ?
                    </div>
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: 13,
                        color: T.muted,
                      }}
                    >
                      Notre équipe répond sous 24 heures.
                    </div>
                  </div>
                  <a
                    href="mailto:support@scriptura.app"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 20px",
                      borderRadius: 12,
                      background: `linear-gradient(135deg,${T.em},#059669)`,
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fff",
                      textDecoration: "none",
                      transition: "all 0.22s",
                      boxShadow: `0 4px 16px rgba(16,185,129,.3)`,
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-1px)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.97)")
                    }
                    onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <Ic.Mail /> Nous contacter
                  </a>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
