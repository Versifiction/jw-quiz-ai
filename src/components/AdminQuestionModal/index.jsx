import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import emptyQuestion from "../../utils/shapes/emptyQuestion";
import T from "../ui/DesignTokens";
import inputStyle from "../ui/Input";
import { Ic } from "../ui/Icons";
import Avatar from "../ui/Avatar";
import Field from "../ui/Field";
import Sk from "../ui/Sk";
import UserAvatar from "../ui/UserAvatar";
import difficulties from "../../utils/shapes/difficulties";

export default function AdminQuestionModal({
  question,
  onSave,
  onClose,
  saving,
}) {
  const [user] = useAuthState(auth);

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
  useEffect(() => {
    console.log("form : ", form);
  }, [form]);

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
    if (!form.answer) e.answer = "Une bonne réponse est requise";
    if (!form.author) e.author = "L'auteur est requis";
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
          <Field label="Titre de la question" error={errors.entitled}>
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
                (e.target.style.borderColor = errors.text ? T.errBrd : T.border)
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
            <Field label="Auteur" error={errors.author}>
              <select
                value={form.author}
                onChange={(e) => setF("author", e.target.value)}
                placeholder="Auteur"
                style={{
                  ...inputStyle(false),
                  cursor: "pointer",
                  appearance: "none",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = errors.author
                    ? T.errBrd
                    : T.emBrd)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.author
                    ? T.errBrd
                    : T.border)
                }
              >
                <option value="Auteur">Auteur</option>
                <option value={user?.uid}>{user?.displayName}</option>
              </select>
            </Field>
            <Field label="Difficulté" error={errors.difficulty}>
              <select
                value={form.difficulty}
                onChange={(e) => setF("difficulty", e.target.value)}
                style={{
                  ...inputStyle(false),
                  cursor: "pointer",
                  appearance: "none",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = errors.difficulty
                    ? T.errBrd
                    : T.emBrd)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.difficulty
                    ? T.errBrd
                    : T.border)
                }
              >
                {difficulties.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.name}
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
                        form.answer === i ? T.emDim : "rgba(255,255,255,0.04)",
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
          <Field
            label="Tags"
            helper="Permet de retrouver la question par tri"
            error={errors.tags}
          >
            <textarea
              value={form.tags}
              onChange={(e) => setF("tags", e.target.value)}
              rows={3}
              placeholder="Exemple : adam,jesus,dieu"
              style={{
                ...inputStyle(errors.tags),
                resize: "vertical",
                lineHeight: 1.55,
              }}
              onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.tags ? T.errBrd : T.border)
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
                <Sk w={14} h={14} r={99} style={{ display: "inline-block" }} />{" "}
                Enregistrement…
              </>
            ) : (
              <>
                <Ic.Check />{" "}
                {isEdit ? "Enregistrer les modifications" : "Créer la question"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
