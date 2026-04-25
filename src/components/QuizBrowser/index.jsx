"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { useParams } from "react-router-dom";
import T from "../ui/DesignTokens";
import { Ic } from "../ui/Icons";
import difficulties from "../../utils/shapes/difficulties";

const DIFF = {
  easy: {
    label: "easy",
    key: "facile",
    color: T.em,
    dim: T.emDim,
    brd: T.emBrd,
  },
  medium: {
    label: "medium",
    key: "moyen",
    color: T.warn,
    dim: T.warnDim,
    brd: T.warnBrd,
  },
  hard: {
    label: "hard",
    key: "difficile",
    color: T.err,
    dim: T.errDim,
    brd: T.errBrd,
  },
};

/* ══════════════════════════ MOCK DATA ══════════════════════════════════════
   Structure identique à votre collection Firestore "quizzes"
   Remplacez par: const snap = await getDocs(collection(db, "quizzes"))
═══════════════════════════════════════════════════════════════════════════*/
const QUIZZES = [
  // ── Livre : Genèse ──
  {
    id: "q01",
    entitled: "La Création du monde",
    description: "Les six jours de la création, Adam, Ève et le jardin d'Éden.",
    difficulty: "easy",
    questionCount: 10,
    tags: ["création", "Adam", "Ève"],
    books: ["Genèse"],
    characters: ["Adam", "Ève", "Dieu"],
    plays: 1842,
    bestScore: 95,
    userPlayed: true,
  },
  {
    id: "q02",
    entitled: "Abraham et l'alliance",
    description: "L'appel d'Abram, la promesse divine et le sacrifice d'Isaac.",
    difficulty: "medium",
    questionCount: 12,
    tags: ["alliance", "foi"],
    books: ["Genèse"],
    characters: ["Abraham", "Isaac", "Sara"],
    plays: 1203,
    bestScore: null,
    userPlayed: false,
  },
  {
    id: "q03",
    entitled: "Joseph en Égypte",
    description:
      "La jalousie des frères, la prison, l'interprétation des rêves.",
    difficulty: "medium",
    questionCount: 10,
    tags: ["rêves", "Égypte"],
    books: ["Genèse"],
    characters: ["Joseph", "Pharaon"],
    plays: 987,
    bestScore: 80,
    userPlayed: true,
  },
  // ── Livre : Exode ──
  {
    id: "q04",
    entitled: "Moïse et les plaies",
    description: "Les dix plaies d'Égypte et la libération du peuple hébreu.",
    difficulty: "easy",
    questionCount: 10,
    tags: ["plaies", "liberté"],
    books: ["Exode"],
    characters: ["Moïse", "Pharaon", "Aaron"],
    plays: 2341,
    bestScore: 100,
    userPlayed: true,
  },
  {
    id: "q05",
    entitled: "Les Dix Commandements",
    description: "Le Sinaï, le veau d'or et les tables de la loi.",
    difficulty: "hard",
    questionCount: 15,
    tags: ["loi", "Sinaï"],
    books: ["Exode"],
    characters: ["Moïse", "Dieu"],
    plays: 756,
    bestScore: null,
    userPlayed: false,
  },
  // ── Livre : Psaumes ──
  {
    id: "q06",
    entitled: "Les Psaumes de David",
    description: "Louanges, lamentations et supplications du roi-psalmiste.",
    difficulty: "medium",
    questionCount: 10,
    tags: ["louange", "prière"],
    books: ["Psaumes"],
    characters: ["David"],
    plays: 1456,
    bestScore: 85,
    userPlayed: true,
  },
  {
    id: "q07",
    entitled: "Psaumes de confiance",
    description: "Les psaumes qui expriment la confiance absolue en Dieu.",
    difficulty: "easy",
    questionCount: 8,
    tags: ["confiance", "foi"],
    books: ["Psaumes"],
    characters: ["David", "Asaph"],
    plays: 678,
    bestScore: null,
    userPlayed: false,
  },
  // ── Livre : Daniel ──
  {
    id: "q08",
    entitled: "Daniel et Babylone",
    description: "La fournaise ardente, la fosse aux lions et les visions.",
    difficulty: "hard",
    questionCount: 12,
    tags: ["visions", "foi"],
    books: ["Daniel"],
    characters: ["Daniel", "Nebucadnetsar"],
    plays: 543,
    bestScore: null,
    userPlayed: false,
  },
  // ── Livre : Matthieu ──
  {
    id: "q09",
    entitled: "Le Sermon sur la montagne",
    description: "Les Béatitudes, le Notre Père et les enseignements de Jésus.",
    difficulty: "easy",
    questionCount: 10,
    tags: ["enseignement", "béatitudes"],
    books: ["Matthieu"],
    characters: ["Jésus"],
    plays: 3102,
    bestScore: 90,
    userPlayed: true,
  },
  {
    id: "q10",
    entitled: "Les miracles de Matthieu",
    description: "Guérisons, multiplication des pains, tempête apaisée.",
    difficulty: "medium",
    questionCount: 12,
    tags: ["miracles"],
    books: ["Matthieu"],
    characters: ["Jésus", "disciples"],
    plays: 1876,
    bestScore: 75,
    userPlayed: true,
  },
  // ── Livre : Jean ──
  {
    id: "q11",
    entitled: "Les signes de Jean",
    description: "Les 7 signes du quatrième évangile et leur signification.",
    difficulty: "hard",
    questionCount: 14,
    tags: ["signes", "symboles"],
    books: ["Jean"],
    characters: ["Jésus", "Marie"],
    plays: 432,
    bestScore: null,
    userPlayed: false,
  },
  {
    id: "q12",
    entitled: "Je suis la lumière du monde",
    description: "Les déclarations 'Je suis' dans l'évangile de Jean.",
    difficulty: "medium",
    questionCount: 10,
    tags: ["identité"],
    books: ["Jean"],
    characters: ["Jésus", "Nicodème"],
    plays: 891,
    bestScore: 88,
    userPlayed: true,
  },
  // ── Livre : Actes ──
  {
    id: "q13",
    entitled: "La Pentecôte et les débuts",
    description: "L'Esprit Saint, les premières communautés et les apôtres.",
    difficulty: "medium",
    questionCount: 10,
    tags: ["Esprit", "église"],
    books: ["Actes"],
    characters: ["Pierre", "Paul", "Étienne"],
    plays: 1120,
    bestScore: null,
    userPlayed: false,
  },
  // ── Livre : Romains ──
  {
    id: "q14",
    entitled: "La grâce selon Paul",
    description: "Justification par la foi, le péché et la rédemption.",
    difficulty: "hard",
    questionCount: 12,
    tags: ["grâce", "foi", "loi"],
    books: ["Romains"],
    characters: ["Paul"],
    plays: 312,
    bestScore: null,
    userPlayed: false,
  },
  // ── Personnages ──
  {
    id: "q15",
    entitled: "Vie et règne de David",
    description: "Samuel, Goliath, Bethsabée et le royaume unifié.",
    difficulty: "mixed",
    questionCount: 15,
    tags: ["roi", "guerre"],
    books: ["Samuel", "Rois"],
    characters: ["David", "Saül", "Goliath", "Jonathan"],
    plays: 2205,
    bestScore: 82,
    userPlayed: true,
  },
  {
    id: "q16",
    entitled: "Paul l'apôtre",
    description: "Conversion, voyages missionnaires et lettres aux Églises.",
    difficulty: "medium",
    questionCount: 12,
    tags: ["mission", "lettres"],
    books: ["Actes", "Romains", "Galates"],
    characters: ["Paul", "Barnabas", "Timothée"],
    plays: 1567,
    bestScore: null,
    userPlayed: false,
  },
  {
    id: "q17",
    entitled: "Élie le prophète",
    description: "Le mont Carmel, Jézabel et la voix douce et légère.",
    difficulty: "hard",
    questionCount: 10,
    tags: ["prophétie", "feu"],
    books: ["Rois"],
    characters: ["Élie", "Achab", "Jézabel"],
    plays: 678,
    bestScore: null,
    userPlayed: false,
  },
  {
    id: "q18",
    entitled: "Marie mère de Jésus",
    description: "L'Annonciation, la Visitation, la Nativité et Cana.",
    difficulty: "easy",
    questionCount: 10,
    tags: ["naissance", "foi"],
    books: ["Luc", "Jean"],
    characters: ["Marie", "Joseph", "Gabriel"],
    plays: 1890,
    bestScore: 95,
    userPlayed: true,
  },
];

/* ─── Derived data for views ──────────────────────────────────────────────*/
const ALL_BOOKS = [...new Set(QUIZZES.flatMap((q) => q.books))].sort();
const ALL_CHARS = [...new Set(QUIZZES.flatMap((q) => q.characters))].sort();

const BOOK_GROUPS = {
  "Ancien Testament": [
    "Genèse",
    "Exode",
    "Lévitique",
    "Nombres",
    "Deutéronome",
    "Josué",
    "Juges",
    "Ruth",
    "Samuel",
    "Rois",
    "Chroniques",
    "Esdras",
    "Néhémie",
    "Esther",
    "Job",
    "Psaumes",
    "Proverbes",
    "Ecclésiaste",
    "Cantique",
    "Ésaïe",
    "Jérémie",
    "Lamentations",
    "Ézéchiel",
    "Daniel",
    "Osée",
    "Joël",
    "Amos",
    "Abdias",
    "Jonas",
    "Michée",
    "Nahum",
    "Habakuk",
    "Sophonie",
    "Aggée",
    "Zacharie",
    "Malachie",
  ],
  "Nouveau Testament": [
    "Matthieu",
    "Marc",
    "Luc",
    "Jean",
    "Actes",
    "Romains",
    "Corinthiens",
    "Galates",
    "Éphésiens",
    "Philippiens",
    "Colossiens",
    "Thessaloniciens",
    "Timothée",
    "Tite",
    "Philémon",
    "Hébreux",
    "Jacques",
    "Pierre",
    "Jude",
    "Apocalypse",
  ],
};

const CHAR_META = {
  Adam: { era: "Création", role: "Premier homme" },
  Ève: { era: "Création", role: "Première femme" },
  Abraham: { era: "Patriarches", role: "Père des croyants" },
  Isaac: { era: "Patriarches", role: "Fils de la promesse" },
  Sara: { era: "Patriarches", role: "Épouse d'Abraham" },
  Joseph: { era: "Patriarches", role: "Vice-roi d'Égypte" },
  Moïse: { era: "Exode", role: "Libérateur d'Israël" },
  Aaron: { era: "Exode", role: "Grand-prêtre" },
  David: { era: "Monarchie", role: "Roi psalmiste" },
  Saül: { era: "Monarchie", role: "Premier roi" },
  Élie: { era: "Prophètes", role: "Prophète de feu" },
  Daniel: { era: "Exil", role: "Prophète en exil" },
  Marie: { era: "NT", role: "Mère de Jésus" },
  Jésus: { era: "NT", role: "Fils de Dieu" },
  Pierre: { era: "NT", role: "Chef des apôtres" },
  Paul: { era: "NT", role: "Apôtre des nations" },
};

/* ══════════════════════════ SHARED PRIMITIVES ═══════════════════════════════*/

/* Skeleton shimmer */
function Sk({ w = "100%", h = 14, r = 8, style = {} }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background:
          "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

/* Scroll reveal */
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
      { threshold: 0.06 },
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

/* Spotlight card */
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

/* Difficulty badge */
function DiffBadge({ diff, small = false }) {
  const cfg = DIFF[diff] || DIFF.easy;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: small ? "2px 7px" : "3px 10px",
        borderRadius: 99,
        background: cfg.dim,
        border: `1px solid ${cfg.brd}`,
        fontFamily: T.mono,
        fontSize: small ? 9 : 10,
        color: cfg.color,
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
}

/* ══════════════════════════ QUIZ CARD ═══════════════════════════════════════*/
function QuizCard({ quiz, index, onSelect }) {
  const [hov, setHov] = useState(false);
  const cfg = DIFF[quiz.difficulty] || DIFF.easy;
  const estMin = Math.ceil((quiz.questionCount * 35) / 60);

  return (
    <SpotCard
      onClick={() => onSelect(quiz)}
      style={{
        background: quiz.userPlayed ? "rgba(16,185,129,0.03)" : T.surf,
        border: `1px solid ${hov ? cfg.brd : quiz.userPlayed ? T.emBrd : T.border}`,
        borderRadius: 18,
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 16px 40px rgba(0,0,0,0.4)` : "none",
        animation: `fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) ${index * 0.05}s both`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ padding: "20px 20px 16px" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <DiffBadge diff={quiz.difficulty} />
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {quiz.userPlayed && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontFamily: T.mono,
                  fontSize: 9,
                  color: T.em,
                }}
              >
                <Ic.Check /> Joué
              </span>
            )}
            {quiz.bestScore && (
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.warn }}>
                {quiz.bestScore}%
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: T.sans,
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            letterSpacing: "-0.02em",
            lineHeight: 1.35,
            marginBottom: 7,
            transition: "color 0.2s",
          }}
        >
          {quiz.entitled}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: T.sans,
            fontSize: 12,
            color: T.muted,
            lineHeight: 1.6,
            marginBottom: 14,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {quiz.description}
        </p>

        {/* Meta row — divide by border instead of card overuse (Rule 4) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingTop: 12,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: T.mono,
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            <Ic.Hash /> {quiz.questionCount} Q
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: T.mono,
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            <Ic.Clock /> ~{estMin} min
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: T.mono,
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              marginLeft: "auto",
            }}
          >
            <Ic.Trophy /> {quiz.plays.toLocaleString("fr-FR")}
          </span>
        </div>
      </div>

      {/* CTA bar */}
      <div
        style={{
          padding: "10px 20px",
          background: hov ? `${cfg.color}12` : "rgba(255,255,255,0.02)",
          borderTop: `1px solid ${hov ? cfg.brd : T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.22s",
        }}
      >
        <span
          style={{
            fontFamily: T.sans,
            fontSize: 12,
            fontWeight: 600,
            color: hov ? cfg.color : T.muted,
            transition: "color 0.22s",
          }}
        >
          {quiz.userPlayed ? "Rejouer" : "Commencer"}
        </span>
        <span
          style={{
            color: hov ? cfg.color : T.muted,
            display: "flex",
            transition: "color 0.22s",
          }}
        >
          <Ic.Play />
        </span>
      </div>
    </SpotCard>
  );
}

/* Loading skeleton grid */
function QuizCardSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: "20px",
            animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Sk w={60} h={22} r={99} />
            <Sk w={32} h={14} r={4} />
          </div>
          <Sk h={16} w="85%" style={{ marginBottom: 8 }} />
          <Sk h={12} w="70%" style={{ marginBottom: 5 }} />
          <Sk h={12} w="55%" style={{ marginBottom: 18 }} />
          <div style={{ display: "flex", gap: 12 }}>
            <Sk w={48} h={10} r={4} />
            <Sk w={48} h={10} r={4} />
          </div>
        </div>
      ))}
    </>
  );
}

/* Empty state */
function EmptyState({ label }) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
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
          marginBottom: 14,
          lineHeight: 1,
        }}
      >
        —
      </div>
      <div
        style={{
          fontFamily: T.sans,
          fontSize: 15,
          color: "rgba(255,255,255,0.3)",
          marginBottom: 6,
        }}
      >
        Aucun quiz {label}
      </div>
      <div
        style={{
          fontFamily: T.sans,
          fontSize: 13,
          color: "rgba(255,255,255,0.2)",
        }}
      >
        Revenez bientôt pour de nouveaux contenus.
      </div>
    </div>
  );
}

/* ══════════════════════════ VIEW: BOOKS ═════════════════════════════════════*/
function BooksView({ quizzes, search, onSelect, loading }) {
  const bookQuizzes = useMemo(() => {
    const map = {};
    ALL_BOOKS.forEach((b) => {
      const qs = quizzes.filter(
        (q) =>
          q.books.includes(b) &&
          (!search ||
            q.entitled.toLowerCase().includes(search) ||
            q.books.some((bk) => bk.toLowerCase().includes(search))),
      );
      if (qs.length) map[b] = qs;
    });
    return map;
  }, [quizzes, search]);

  const testament = (book) =>
    BOOK_GROUPS["Ancien Testament"].some((b) =>
      book.startsWith(b.split(" ")[0]),
    )
      ? "Ancien Testament"
      : "Nouveau Testament";

  const sections = useMemo(() => {
    const groups = { "Ancien Testament": {}, "Nouveau Testament": {} };
    Object.entries(bookQuizzes).forEach(([book, qs]) => {
      groups[testament(book)][book] = qs;
    });
    return groups;
  }, [bookQuizzes]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      {Object.entries(sections).map(([testament, books]) => {
        if (!Object.keys(books).length && !loading) return null;
        return (
          <div key={testament}>
            <Reveal>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {testament}
                </div>
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  {Object.values(books).flat().length} quiz
                </span>
              </div>
            </Reveal>

            {Object.keys(books).length === 0 && loading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                  gap: 12,
                }}
              >
                <QuizCardSkeleton count={3} />
              </div>
            ) : (
              Object.entries(books).map(([book, qs], bi) => (
                <div key={book} style={{ marginBottom: 28 }}>
                  <Reveal delay={bi * 0.04}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: T.emDim,
                          border: `1px solid ${T.emBrd}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: T.em,
                        }}
                      >
                        <Ic.Scroll />
                      </div>
                      <span
                        style={{
                          fontFamily: T.sans,
                          fontSize: 14,
                          fontWeight: 600,
                          color: T.text,
                        }}
                      >
                        {book}
                      </span>
                      <span
                        style={{
                          fontFamily: T.mono,
                          fontSize: 10,
                          color: "rgba(255,255,255,0.25)",
                          marginLeft: 2,
                        }}
                      >
                        {qs.length} quiz
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill,minmax(280px,1fr))",
                        gap: 12,
                      }}
                    >
                      {qs.map((q, i) => (
                        <QuizCard
                          key={q.id}
                          quiz={q}
                          index={i}
                          onSelect={onSelect}
                        />
                      ))}
                    </div>
                  </Reveal>
                </div>
              ))
            )}
          </div>
        );
      })}
      {!loading && !Object.values(bookQuizzes).flat().length && (
        <EmptyState label="correspondant à ce livre" />
      )}
    </div>
  );
}

/* ══════════════════════════ VIEW: CHARACTERS ════════════════════════════════*/
function CharactersView({ quizzes, search, onSelect, loading }) {
  const [activeChar, setActiveChar] = useState(null);

  const charMap = useMemo(() => {
    const map = {};
    ALL_CHARS.forEach((c) => {
      const qs = quizzes.filter(
        (q) =>
          q.characters.includes(c) &&
          (!search ||
            q.entitled.toLowerCase().includes(search) ||
            c.toLowerCase().includes(search)),
      );
      if (qs.length) map[c] = qs;
    });
    return map;
  }, [quizzes, search]);

  const availableChars = Object.keys(charMap);
  const displayChar =
    activeChar && charMap[activeChar] ? activeChar : availableChars[0] || null;
  const displayQuizzes = displayChar ? charMap[displayChar] || [] : [];

  useEffect(() => {
    if (availableChars.length && !availableChars.includes(activeChar)) {
      setActiveChar(availableChars[0]);
    }
  }, [availableChars.join(",")]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: 24,
        alignItems: "start",
      }}
      className="char-grid"
    >
      <style>{`@media(max-width:767px){.char-grid{grid-template-columns:1fr!important}}`}</style>

      {/* Left: character list */}
      <Reveal>
        <div
          style={{
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            overflow: "hidden",
            position: "sticky",
            top: 24,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${T.border}`,
              fontFamily: T.mono,
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            PERSONNAGES · {availableChars.length}
          </div>
          <div style={{ maxHeight: 480, overflowY: "auto" }}>
            {loading ? (
              <div
                style={{
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <Sk w={32} h={32} r={99} />
                    <div style={{ flex: 1 }}>
                      <Sk h={12} w="70%" style={{ marginBottom: 5 }} />
                      <Sk h={9} w="50%" />
                    </div>
                  </div>
                ))}
              </div>
            ) : availableChars.length === 0 ? (
              <div
                style={{
                  padding: "24px 16px",
                  textAlign: "center",
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                Aucun personnage trouvé
              </div>
            ) : (
              availableChars.map((char, i) => {
                const active = displayChar === char;
                const meta = CHAR_META[char];
                const hue = (char.charCodeAt(0) * 41) % 360;
                return (
                  <button
                    key={char}
                    onClick={() => setActiveChar(char)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 16px",
                      background: active ? T.emDim : "transparent",
                      borderBottom:
                        i < availableChars.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.18s",
                      animation: `fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both`,
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: `hsl(${hue},45%,20%)`,
                        border: `1.5px solid hsl(${hue},45%,38%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: T.mono,
                        fontSize: 11,
                        fontWeight: 700,
                        color: `hsl(${hue},70%,65%)`,
                        flexShrink: 0,
                      }}
                    >
                      {char.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: T.sans,
                          fontSize: 13,
                          fontWeight: active ? 600 : 400,
                          color: active ? T.em : T.text,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {char}
                      </div>
                      {meta && (
                        <div
                          style={{
                            fontFamily: T.mono,
                            fontSize: 9,
                            color: "rgba(255,255,255,0.28)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {meta.era}
                        </div>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: T.mono,
                        fontSize: 10,
                        color: active ? T.em : "rgba(255,255,255,0.2)",
                        marginLeft: "auto",
                        flexShrink: 0,
                      }}
                    >
                      {charMap[char]?.length}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </Reveal>

      {/* Right: quizzes for selected character */}
      <div>
        {displayChar && (
          <Reveal>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 6,
                }}
              >
                <h2
                  style={{
                    fontFamily: T.sans,
                    fontSize: "clamp(18px,3vw,26px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: T.text,
                  }}
                >
                  {displayChar}
                </h2>
                {CHAR_META[displayChar] && (
                  <span
                    style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      padding: "3px 10px",
                      borderRadius: 99,
                      background: T.emDim,
                      border: `1px solid ${T.emBrd}`,
                      color: T.em,
                    }}
                  >
                    {CHAR_META[displayChar].role}
                  </span>
                )}
              </div>
              {CHAR_META[displayChar] && (
                <div
                  style={{ fontFamily: T.sans, fontSize: 13, color: T.muted }}
                >
                  {displayQuizzes.length} quiz sur ce personnage
                </div>
              )}
            </div>
          </Reveal>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 12,
          }}
        >
          {loading ? (
            <QuizCardSkeleton count={4} />
          ) : displayQuizzes.length ? (
            displayQuizzes.map((q, i) => (
              <QuizCard key={q.id} quiz={q} index={i} onSelect={onSelect} />
            ))
          ) : (
            <EmptyState label="pour ce personnage" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ VIEW: DIFFICULTY ════════════════════════════════*/
function DifficultyView({ quizzes, search, onSelect, loading }) {
  const filtered = useMemo(
    () =>
      quizzes.filter(
        (q) =>
          !search ||
          q.entitled.toLowerCase().includes(search) ||
          q.description.toLowerCase().includes(search),
      ),
    [quizzes, search],
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
        gap: 16,
      }}
      className="diff-grid"
    >
      <style>{`@media(max-width:900px){.diff-grid{grid-template-columns:repeat(2,1fr)!important}} @media(max-width:560px){.diff-grid{grid-template-columns:1fr!important}}`}</style>
      {difficulties.map((difficulty, li) => {
        const cfg = DIFF[difficulty.name];
        const levelQuizzes = filtered.filter(
          (q) => q.difficulty === difficulty.name,
        );
        return (
          <Reveal key={difficulty.key} delay={li * 0.07}>
            <div
              style={{
                background: T.surf,
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                overflow: "hidden",
                height: "100%",
              }}
            >
              {/* Column header */}
              <div
                style={{
                  padding: "20px 20px 16px",
                  borderBottom: `1px solid ${T.border}`,
                  background: `${cfg.color}08`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: cfg.color,
                      boxShadow: `0 0 8px ${cfg.color}60`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: T.mono,
                      fontSize: 11,
                      fontWeight: 700,
                      color: cfg.color,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {cfg.key.toUpperCase()}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 24,
                    fontWeight: 800,
                    color: cfg.color,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {loading ? <Sk w={40} h={24} r={4} /> : levelQuizzes.length}
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 12,
                    color: T.muted,
                    marginTop: 4,
                  }}
                >
                  {difficulty.name === "easy" && "Questions fondamentales"}
                  {difficulty.name === "medium" &&
                    "Bonne connaissance biblique"}
                  {difficulty.name === "hard" && "Pour les lecteurs assidus"}
                </div>
                {/* Points preview */}
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {difficulty.name === "easy"
                      ? "10"
                      : difficulty.name === "medium"
                        ? "20"
                        : difficulty.name === "hard"
                          ? "30"
                          : "10–30"}{" "}
                    pts / question
                  </span>
                </div>
              </div>

              {/* Quiz list — divide-y (anti-card-overuse Rule 4) */}
              <div style={{ maxHeight: 420, overflowY: "auto" }}>
                {loading ? (
                  <div
                    style={{
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div key={i}>
                        <Sk h={13} w="80%" style={{ marginBottom: 6 }} />
                        <Sk h={10} w="60%" />
                      </div>
                    ))}
                  </div>
                ) : levelQuizzes.length === 0 ? (
                  <div
                    style={{
                      padding: "28px 20px",
                      textAlign: "center",
                      fontFamily: T.sans,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    Aucun quiz disponible
                  </div>
                ) : (
                  levelQuizzes.map((quiz, i) => (
                    <button
                      key={quiz.id}
                      onClick={() => onSelect(quiz)}
                      style={{
                        width: "100%",
                        padding: "14px 20px",
                        background: "transparent",
                        borderBottom:
                          i < levelQuizzes.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.18s",
                        animation: `fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.05 + li * 0.07}s both`,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = `${cfg.color}08`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      onMouseDown={(e) =>
                        (e.currentTarget.style.transform = "scale(0.98)")
                      }
                      onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: T.sans,
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.text,
                            lineHeight: 1.3,
                          }}
                        >
                          {quiz.entitled}
                        </div>
                        {quiz.userPlayed && (
                          <span
                            style={{
                              color: T.em,
                              flexShrink: 0,
                              display: "flex",
                            }}
                          >
                            <Ic.Check />
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: T.mono,
                            fontSize: 9,
                            color: "rgba(255,255,255,0.28)",
                          }}
                        >
                          {quiz.questionCount} Q
                        </span>
                        <span
                          style={{
                            fontFamily: T.mono,
                            fontSize: 9,
                            color: "rgba(255,255,255,0.28)",
                          }}
                        >
                          ~{Math.ceil((quiz.questionCount * 35) / 60)} min
                        </span>
                        {quiz.bestScore && (
                          <span
                            style={{
                              fontFamily: T.mono,
                              fontSize: 9,
                              color: T.warn,
                              marginLeft: "auto",
                            }}
                          >
                            {quiz.bestScore}%
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ══════════════════════════ QUIZ PREVIEW MODAL ══════════════════════════════*/
function QuizModal({ quiz, onClose, onStart }) {
  const cfg = DIFF[quiz.difficulty] || DIFF.easy;
  const estMin = Math.ceil((quiz.questionCount * 35) / 60);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(12px)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 480,
          background: T.surf,
          border: `1px solid ${cfg.brd}`,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 32px 64px rgba(0,0,0,0.6)`,
          animation: "fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Header stripe */}
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg,${cfg.color},${cfg.color}88)`,
          }}
        />

        <div style={{ padding: "28px 28px 24px" }}>
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <DiffBadge diff={quiz.difficulty} />
            <h2
              style={{
                fontFamily: T.sans,
                fontSize: "clamp(20px,3vw,26px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                color: T.text,
                margin: "10px 0 8px",
                lineHeight: 1.15,
              }}
            >
              {quiz.entitled}
            </h2>
            <p
              style={{
                fontFamily: T.sans,
                fontSize: 14,
                color: T.muted,
                lineHeight: 1.65,
              }}
            >
              {quiz.description}
            </p>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              { label: "Questions", value: quiz.questionCount, icon: Ic.Hash },
              { label: "Durée est.", value: `~${estMin} min`, icon: Ic.Clock },
              {
                label: "Joueurs",
                value: quiz.plays.toLocaleString("fr-FR"),
                icon: Ic.Trophy,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{ color: T.muted, marginBottom: 6, display: "flex" }}
                >
                  <stat.icon />
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 15,
                    fontWeight: 700,
                    color: cfg.color,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Books & Characters */}
          <div
            style={{
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span
                style={{
                  color: "rgba(255,255,255,0.3)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Ic.Book />
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {quiz.books.map((b) => (
                  <span
                    key={b}
                    style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 5,
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${T.border}`,
                      color: T.muted,
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span
                style={{
                  color: "rgba(255,255,255,0.3)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Ic.Users />
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {quiz.characters.map((c) => (
                  <span
                    key={c}
                    style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 5,
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${T.border}`,
                      color: T.muted,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Best score */}
          {quiz.bestScore && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 14px",
                borderRadius: 12,
                background: T.emDim,
                border: `1px solid ${T.emBrd}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: T.em }}>
                  <Ic.Star />
                </span>
                <span
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    color: T.em,
                    fontWeight: 600,
                  }}
                >
                  Meilleur score
                </span>
              </div>
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 16,
                  fontWeight: 800,
                  color: T.warn,
                }}
              >
                {quiz.bestScore}%
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${T.border}`,
                cursor: "pointer",
                fontFamily: T.sans,
                fontSize: 13,
                color: T.muted,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = T.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = T.muted;
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.97)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
            >
              Annuler
            </button>
            <button
              onClick={() => onStart(quiz)}
              style={{
                flex: 2,
                padding: "12px 0",
                borderRadius: 12,
                background: `linear-gradient(135deg,${cfg.color},${cfg.color}cc)`,
                border: "none",
                cursor: "pointer",
                fontFamily: T.sans,
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: `0 4px 18px ${cfg.color}35`,
                transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 8px 28px ${cfg.color}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = `0 4px 18px ${cfg.color}35`;
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.97)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
            >
              <Ic.Play />{" "}
              {quiz.userPlayed ? "Rejouer le quiz" : "Commencer le quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ MAIN PAGE ═══════════════════════════════════════*/
export default function QuizBrowserPage({ onStartQuiz }) {
  const params = useParams();
  const [view, setView] = useState(params?.type || "books"); // "books" | "characters" | "difficulty"
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular"); // "popular" | "newest" | "az"
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [selected, setSelected] = useState(null);

  /* Simulate Firebase fetch */
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      // Sort
      const sorted = [...QUIZZES].sort((a, b) => {
        if (sort === "popular") return b.plays - a.plays;
        if (sort === "az") return a.entitled.localeCompare(b.entitled);
        return 0;
      });
      setQuizzes(sorted);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [sort]);

  const handleStart = (quiz) => {
    setSelected(null);
    if (onStartQuiz) onStartQuiz(quiz);
    else alert(`Lancement du quiz : "${quiz.entitled}"`);
  };

  const searchLower = search.toLowerCase().trim();

  const VIEWS = [
    { id: "difficulty", label: "Difficulté", icon: Ic.Target },
    { id: "books", label: "Livres bibliques", icon: Ic.Book },
    { id: "characters", label: "Personnages", icon: Ic.Users },
  ];

  const SORTS = [
    { id: "popular", label: "Populaires" },
    { id: "newest", label: "Récents" },
    { id: "az", label: "A → Z" },
  ];

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

      {/* Fixed ambient glow */}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 24,
              alignItems: "end",
              marginBottom: 40,
            }}
            className="header-row"
          >
            <style>{`@media(max-width:640px){.header-row{grid-template-columns:1fr!important}}`}</style>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "4px 14px",
                  borderRadius: 99,
                  background: T.emDim,
                  border: `1px solid ${T.emBrd}`,
                  marginBottom: 18,
                }}
              >
                <span style={{ color: T.em }}>
                  <Ic.Book />
                </span>
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: T.em,
                    letterSpacing: "0.1em",
                  }}
                >
                  CATALOGUE · {QUIZZES.length} QUIZ
                </span>
              </div>
              <h1
                style={{
                  fontFamily: T.sans,
                  fontSize: "clamp(30px,5vw,52px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: T.text,
                  lineHeight: 1.05,
                }}
              >
                Choisissez
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
                  votre quiz.
                </span>
              </h1>
              <p
                style={{
                  fontFamily: T.sans,
                  fontSize: 15,
                  color: T.muted,
                  lineHeight: 1.65,
                  textAlign: "center",
                }}
              >
                Naviguez par livre biblique, personnage ou niveau de difficulté
                pour trouver le quiz qui vous correspond.
              </p>
            </div>

            {/* Stats */}
            {/* <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                flexShrink: 0,
              }}
            >
              {[
                {
                  val: quizzes.filter((q) => q.userPlayed).length,
                  label: "quiz joués",
                  color: T.em,
                },
                {
                  val: quizzes.filter((q) => !q.userPlayed).length,
                  label: "à découvrir",
                  color: T.warn,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: T.surf,
                    border: `1px solid ${T.border}`,
                    borderRadius: 14,
                    padding: "14px 16px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 22,
                      fontWeight: 800,
                      color: s.color,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {loading ? "—" : s.val}
                  </div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 11,
                      color: T.muted,
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </Reveal>

        {/* ── TOOLBAR: view switcher + search + sort ── */}
        <Reveal delay={0.08}>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 36,
            }}
          >
            {/* View switcher */}
            <div
              style={{
                display: "inline-flex",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 3,
                gap: 2,
              }}
            >
              {VIEWS.map((v) => {
                const active = view === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setView(v.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 14px",
                      borderRadius: 9,
                      border: "none",
                      cursor: "pointer",
                      background: active ? T.emDim : "transparent",
                      outline: active ? `1px solid ${T.emBrd}` : "none",
                      fontFamily: T.sans,
                      fontSize: 12,
                      fontWeight: active ? 600 : 400,
                      color: active ? T.em : T.muted,
                      transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.color = T.text;
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.color = T.muted;
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.96)")
                    }
                    onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <span
                      style={{
                        color: active ? T.em : "rgba(255,255,255,0.35)",
                      }}
                    >
                      <v.icon />
                    </span>
                    <span className="view-label">{v.label}</span>
                    <style>{`@media(max-width:480px){.view-label{display:none}}`}</style>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
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
                placeholder="Rechercher un quiz…"
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 36px",
                  borderRadius: 11,
                  background: T.surf,
                  border: `1px solid ${T.border}`,
                  fontFamily: T.sans,
                  fontSize: 13,
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
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.07)",
                    border: "none",
                    cursor: "pointer",
                    color: T.muted,
                    width: 22,
                    height: 22,
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

            {/* Sort */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.3)", display: "flex" }}>
                <Ic.Sort />
              </span>
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 9,
                    border: `1px solid ${sort === s.id ? T.emBrd : T.border}`,
                    background: sort === s.id ? T.emDim : "transparent",
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: sort === s.id ? T.em : T.muted,
                    cursor: "pointer",
                    transition: "all 0.18s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.95)")
                  }
                  onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── VIEWS ── */}
        <div
          style={{
            animation: "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) 0.12s both",
          }}
        >
          {" "}
          {view === "difficulty" && (
            <DifficultyView
              quizzes={quizzes}
              search={searchLower}
              onSelect={setSelected}
              loading={loading}
            />
          )}
          {view === "books" && (
            <BooksView
              quizzes={quizzes}
              search={searchLower}
              onSelect={setSelected}
              loading={loading}
            />
          )}
          {view === "characters" && (
            <CharactersView
              quizzes={quizzes}
              search={searchLower}
              onSelect={setSelected}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* ── QUIZ PREVIEW MODAL ── */}
      {selected && (
        <QuizModal
          quiz={selected}
          onClose={() => setSelected(null)}
          onStart={handleStart}
        />
      )}
    </div>
  );
}
