import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import DeleteModal from "../DeleteModal";
import AdminQuizModal from "../AdminQuizModal";
import UserAvatar from "../ui/UserAvatar";
import useCollection from "../../utils/hooks/useCollection";
import T from "../ui/DesignTokens";
import inputStyle from "../ui/Input";
import { Ic } from "../ui/Icons";
import Sk from "../ui/Sk";
import Badge from "../ui/Badge";
import difficulties from "../../utils/shapes/difficulties";

const CATEGORIES = [
  "Torah & Loi",
  "Évangiles",
  "Prophètes",
  "Psaumes & Sagesse",
  "Épîtres",
  "Histoire biblique",
];

export default function AdminQuizzesTab({ db, toast }) {
  const {
    data: quizzes,
    loading,
    error,
    refetch,
  } = useCollection(db, "quizzes", [orderBy("createdAt", "desc")]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterDiff, setFilterDiff] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: "create"|"edit", question? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    console.log("modal : ", modal);
  }, [modal]);

  const filtered = quizzes.filter((q) => {
    const matchSearch =
      !search || q.entitled?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || q.category === filterCat;
    const matchDiff = !filterDiff || q.difficulty === filterDiff;

    return matchSearch && matchCat && matchDiff;
  });

  console.log("filtered ", filtered);

  const handleSave = async (form) => {
    form.tags = form.tags.split(",");
    setSaving(true);
    try {
      if (modal?.quiz?.id) {
        await updateDoc(doc(db, "quizzes", modal.quiz.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        toast("Quiz mise à jour avec succès");
      } else {
        await addDoc(collection(db, "quizzes"), {
          ...form,
          createdAt: serverTimestamp(),
        });
        toast("Quiz créée avec succès");
      }
      setModal(null);
      refetch();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "quizzes", deleteTarget.id));
      toast("Quiz supprimé");
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const diffColor = { easy: T.em, medium: T.warn, hard: T.err };

  return (
    <div style={{ animation: "fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) both" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
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
            placeholder="Rechercher une question…"
            style={{ ...inputStyle(false), paddingLeft: 36, width: "100%" }}
            onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
        </div>
        {/* Difficulty filter */}
        <select
          value={filterDiff}
          onChange={(e) => setFilterDiff(e.target.value)}
          style={{
            ...inputStyle(false),
            width: "auto",
            paddingRight: 32,
            cursor: "pointer",
            appearance: "none",
          }}
        >
          <option value="">Tous niveaux</option>
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
        {/* Refresh */}
        <button
          onClick={refetch}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${T.border}`,
            cursor: "pointer",
            color: T.muted,
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = T.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = T.muted;
          }}
        >
          <Ic.Refresh />
        </button>
        {/* Add */}
        <button
          onClick={() => setModal({ mode: "create" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 16px",
            borderRadius: 10,
            background: `linear-gradient(135deg,${T.em},#059669)`,
            border: "none",
            cursor: "pointer",
            fontFamily: T.sans,
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            boxShadow: `0 3px 14px rgba(16,185,129,.3)`,
            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        >
          <Ic.Plus /> Nouveau quiz
        </button>
      </div>

      {/* Count */}
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 11,
          color: "rgba(255,255,255,0.28)",
          marginBottom: 10,
        }}
      >
        {filtered.length} quiz{filtered.length !== 1 ? "s" : ""}{" "}
        {search || filterCat || filterDiff ? "(filtrées)" : ""}
      </div>

      {/* Table */}
      <div
        style={{
          background: T.surf,
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.5fr 1.5fr 0.25fr 0.25fr 0.25fr",
            gap: 0,
            padding: "11px 20px",
            borderBottom: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {["Id", "Quiz", "Type", "Auteur", "Actions"].map((h) => (
            <div
              key={h}
              style={{
                fontFamily: T.sans,
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              padding: "20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 1.5fr 0.25fr 0.25fr 0.25fr",
                  gap: 0,
                  alignItems: "center",
                }}
              >
                <Sk h={14} w="85%" />
                <Sk h={22} w={90} r={99} />
                <Sk h={22} w={60} r={99} />
                <Sk h={14} w={30} />
                <Sk h={28} w={70} r={8} />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: 32, textAlign: "center" }}>
            <div style={{ color: T.err, marginBottom: 8 }}>
              <Ic.Warning />
            </div>
            <div style={{ fontFamily: T.sans, fontSize: 14, color: T.err }}>
              {error}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 32,
                color: "rgba(255,255,255,0.07)",
                marginBottom: 12,
              }}
            >
              —
            </div>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: 15,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {search || filterCat || filterDiff
                ? "Aucun quiz ne correspond aux filtres"
                : "Aucun quiz. Commencez par en créer un avec le bouton Nouveau quiz"}
            </div>
          </div>
        )}

        {/* Rows */}
        {!loading &&
          filtered.map((q, i) => (
            <div
              key={q?.id}
              style={{
                display: "grid",
                gridTemplateColumns: "0.5fr 1.5fr 0.25fr 0.25fr 0.25fr",
                gap: 0,
                padding: "13px 20px",
                borderBottom:
                  i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                alignItems: "center",
                transition: "background 0.15s",
                animation: `fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.03}s both`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div className="p-6 min-w-0">
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.2)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {q.id}
                </div>
              </div>
              <div className="p-6 min-w-0">
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    color: T.text,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: 3,
                  }}
                >
                  {q.entitled}
                </div>
              </div>
              {/* <div>
                <Badge label={q.category || "—"} color={T.em} />
              </div> */}
              <div className="flex justify-center items-center">
                <Badge
                  label={
                    difficulties.find(
                      (difficulty) => difficulty.name === q.difficulty,
                    )?.key
                  }
                  color={diffColor[q.difficulty] || T.em}
                />
              </div>
              <div className="flex justify-center items-center">
                <UserAvatar userId={q.author} />
              </div>
              <div
                style={{ gap: 6 }}
                className="flex justify-center items-center"
              >
                <button
                  onClick={() => setModal({ mode: "edit", quiz: q })}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${T.border}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.muted,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.em;
                    e.currentTarget.style.borderColor = T.emBrd;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor = T.border;
                  }}
                  title="Modifier"
                >
                  <Ic.Edit />
                </button>
                <button
                  onClick={() => setDeleteTarget(q)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${T.border}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.muted,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.err;
                    e.currentTarget.style.borderColor = T.errBrd;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor = T.border;
                  }}
                  title="Supprimer"
                >
                  <Ic.Trash />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modals */}
      {modal && (
        <AdminQuizModal
          quiz={modal.quiz}
          onSave={handleSave}
          onClose={() => {
            setModal(null);
            console.log("close");
          }}
          isEdit={modal.mode === "edit"}
          saving={saving}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          label={deleteTarget.entitled?.slice(0, 40) + "…"}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
