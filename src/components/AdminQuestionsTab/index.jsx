import { useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import useCollection from "../../utils/hooks/useCollection";
import T from "../ui/DesignTokens";
import inputStyle from "../ui/Input";
import emptyQuestion from "../../utils/shapes/emptyQuestion";
import { Ic } from "../ui/Icons";
import Sk from "../ui/Sk";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import Field from "../ui/Field";

const CATEGORIES = [
  "Torah & Loi",
  "Évangiles",
  "Prophètes",
  "Psaumes & Sagesse",
  "Épîtres",
  "Histoire biblique",
];
const DIFFICULTIES = ["facile", "moyen", "difficile"];

export default function AdminQuestionsTab({ db, toast }) {
  const {
    data: questions,
    loading,
    error,
    refetch,
  } = useCollection(db, "questions", [orderBy("createdAt", "desc")]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterDiff, setFilterDiff] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: "create"|"edit", question? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = questions.filter((q) => {
    const matchSearch =
      !search || q.text?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || q.category === filterCat;
    const matchDiff = !filterDiff || q.difficulty === filterDiff;

    return matchSearch && matchCat && matchDiff;
  });

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.question?.id) {
        await updateDoc(doc(db, "questions", modal.question.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        toast("Question mise à jour avec succès");
      } else {
        await addDoc(collection(db, "questions"), {
          ...form,
          createdAt: serverTimestamp(),
        });
        toast("Question créée avec succès");
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
      await deleteDoc(doc(db, "questions", deleteTarget.id));
      toast("Question supprimée");
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  function QuestionModal({ question, onSave, onClose, saving }) {
    const isEdit = !!question?.id;
    const [form, setForm] = useState(
      isEdit
        ? {
            answer: question.answer,
            author: question.author,
            book: question.book || "genese",
            choices: question.choices,
            createdAt: question.createdAt,
            difficulty: question.difficulty || "facile",
            entitled: question.entitled,
            explanation: question.explanation,
            tags: question.tags || [],
            updatedAt: question.updatedAt,
          }
        : emptyQuestion,
    );

    const [errors, setErrors] = useState({});

    const setF = (key, val) => setForm((p) => ({ ...p, [key]: val }));
    const setOpt = (i, val) =>
      setForm((p) => {
        const o = [...p.choices];
        o[i] = val;
        return { ...p, choices: o };
      });

    const validate = () => {
      const e = {};
      if (!form.entitled.trim()) e.entitled = "La question est requise";
      if (form.choices.some((o) => !o.trim()))
        e.choices = "Toutes les options sont requises";
      // if (!form.answer) e.answer = "Une bonne réponse est requise";
      // if (!form.explanation.trim()) e.explanation = "L'explication est requise";
      setErrors(e);
      return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
      if (validate()) onSave(form);
    };

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
            backdropFilter: "blur(10px)",
          }}
          onClick={onClose}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 580,
            maxHeight: "90dvh",
            overflowY: "auto",
            background: T.surf,
            border: `1px solid ${T.border}`,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.65)",
            borderRadius: 22,
            padding: "28px 28px",
            animation: "fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontFamily: T.sans,
                fontSize: 18,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-0.025em",
              }}
            >
              {isEdit ? "Modifier la question" : "Nouvelle question"}
            </h2>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${T.border}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.muted,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = T.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = T.muted;
              }}
            >
              <Ic.X />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Text */}
            <Field label="Texte de la question" error={errors.entitled}>
              <textarea
                value={form.entitled}
                onChange={(e) => setF("entitled", e.target.value)}
                rows={3}
                placeholder="Entrez la question ici…"
                style={{
                  ...inputStyle(errors.entitled),
                  resize: "vertical",
                  lineHeight: 1.55,
                }}
                onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.text
                    ? T.errBrd
                    : T.border)
                }
              />
            </Field>

            {/* Category + Difficulty + Points */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 12,
              }}
            >
              {/* <Field label="Catégorie" error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => setF("category", e.target.value)}
                style={{
                  ...inputStyle(errors.category),
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                <option value="">Choisir…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field> */}
              <Field label="Difficulté">
                <select
                  value={form.difficulty}
                  onChange={(e) => setF("difficulty", e.target.value)}
                  style={{
                    ...inputStyle(false),
                    cursor: "pointer",
                    appearance: "none",
                  }}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Options */}
            <Field
              label="Options de réponse"
              helper="Cochez la bonne réponse"
              error={errors.choices}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {form.choices.map((opt, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <button
                      onClick={() => {
                        setF("answer", i);
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        border: `1.5px solid ${form.answer === i ? T.emBrd : T.border}`,
                        background:
                          form.answer === i
                            ? T.emDim
                            : "rgba(255,255,255,0.04)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: form.answer === i ? T.em : T.muted,
                        transition: "all 0.18s",
                        flexShrink: 0,
                      }}
                    >
                      {form.answer === i ? (
                        <Ic.Check />
                      ) : (
                        <span style={{ fontFamily: T.mono, fontSize: 10 }}>
                          {["A", "B", "C", "D"][i]}
                        </span>
                      )}
                    </button>
                    <input
                      value={opt}
                      onChange={(e) => setOpt(i, e.target.value)}
                      placeholder={`Choix ${["A", "B", "C", "D"][i]}…`}
                      style={{
                        ...inputStyle(errors.choices && !opt.trim()),
                        flex: 1,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                      onBlur={(e) => (e.target.style.borderColor = T.border)}
                    />
                  </div>
                ))}
              </div>
            </Field>

            {/* Explanation */}
            <Field
              label="Explication"
              helper="Affiché après la réponse dans le quiz"
              error={errors.explanation}
            >
              <textarea
                value={form.explanation}
                onChange={(e) => setF("explanation", e.target.value)}
                rows={3}
                placeholder="Expliquez la bonne réponse…"
                style={{
                  ...inputStyle(errors.explanation),
                  resize: "vertical",
                  lineHeight: 1.55,
                }}
                onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.explanation
                    ? T.errBrd
                    : T.border)
                }
              />
            </Field>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                width: "100%",
                padding: "13px 0",
                borderRadius: 12,
                background: saving
                  ? "rgba(16,185,129,0.5)"
                  : `linear-gradient(135deg,${T.em},#059669)`,
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: T.sans,
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseDown={(e) => {
                if (!saving) e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
            >
              {saving ? (
                <>
                  <Sk
                    w={14}
                    h={14}
                    r={99}
                    style={{ display: "inline-block" }}
                  />{" "}
                  Enregistrement…
                </>
              ) : (
                <>
                  <Ic.Check />{" "}
                  {isEdit
                    ? "Enregistrer les modifications"
                    : "Créer la question"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const diffColor = { facile: T.em, moyen: T.warn, difficile: T.err };

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
          <option value="facile">Facile</option>
          <option value="moyen">Moyen</option>
          <option value="difficile">Difficile</option>
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
          <Ic.Plus /> Nouvelle question
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
        {filtered.length} question{filtered.length !== 1 ? "s" : ""}{" "}
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
            gridTemplateColumns: "0fr 1fr 140px 90px 70px",
            gap: 0,
            padding: "11px 20px",
            borderBottom: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {["Id", "Question", "Niveau", "Actions"].map((h) => (
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
                  gridTemplateColumns: "0fr 1fr 140px 90px 70px",
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
                ? "Aucune question ne correspond aux filtres"
                : "Aucune question. Commencez par en créer une."}
            </div>
          </div>
        )}

        {/* Rows */}
        {!loading &&
          filtered.map((q, i) => (
            <div
              key={q.id}
              style={{
                display: "grid",
                gridTemplateColumns: "0fr 1fr 140px 90px 70px",
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
              <div>
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
              <div style={{ paddingRight: 16, minWidth: 0 }}>
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
              <div>
                <Badge
                  label={q.difficulty}
                  color={diffColor[q.difficulty] || T.em}
                />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setModal({ mode: "edit", question: q })}
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
        <QuestionModal
          question={modal.question}
          onSave={handleSave}
          onClose={() => setModal(null)}
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
