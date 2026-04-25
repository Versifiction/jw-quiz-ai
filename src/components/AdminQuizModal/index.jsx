// ─── CreateQuizPage.jsx ───────────────────────────────────────────────────
// Deps: firebase/firestore (already installed)
// Usage: <CreateQuizPage firebaseApp={app} currentUser={user} />
// ─────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../config/firebase";
import emptyQuestion from "../../utils/shapes/emptyQuestion";
import emptyQuiz from "../../utils/shapes/emptyQuiz";

/* ══════════════════════════ DESIGN TOKENS ══════════════════════════════════*/
const T = {
  bg: "#07050f",
  surf: "#0f0a1e",
  surf2: "#14102a",
  em: "#10b981",
  emDim: "rgba(16,185,129,0.10)",
  emBrd: "rgba(16,185,129,0.25)",
  warn: "#f59e0b",
  warnDim: "rgba(245,158,11,0.10)",
  warnBrd: "rgba(245,158,11,0.25)",
  err: "#ef4444",
  errDim: "rgba(239,68,68,0.10)",
  errBrd: "rgba(239,68,68,0.28)",
  border: "rgba(255,255,255,0.08)",
  text: "#f1f5f9",
  muted: "rgba(241,245,249,0.45)",
  mono: "'JetBrains Mono', monospace",
  sans: "'Outfit', sans-serif",
};

const DIFF_CFG = {
  easy: { label: "Facile", color: T.em, dim: T.emDim, brd: T.emBrd, pts: 10 },
  medium: {
    label: "Moyen",
    color: T.warn,
    dim: T.warnDim,
    brd: T.warnBrd,
    pts: 20,
  },
  hard: {
    label: "Difficile",
    color: T.err,
    dim: T.errDim,
    brd: T.errBrd,
    pts: 30,
  },
};

/* ══════════════════════════ SVG ICONS ══════════════════════════════════════*/
const Ic = {
  Plus: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
    >
      <path d="M128 40v176M40 128h176" />
    </svg>
  ),
  X: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="22"
      strokeLinecap="round"
    >
      <path d="M200 56 56 200M56 56l144 144" />
    </svg>
  ),
  Check: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m40 128 72 72L216 56" />
    </svg>
  ),
  ChevR: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m96 48 96 80-96 80" />
    </svg>
  ),
  ChevL: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m160 48-96 80 96 80" />
    </svg>
  ),
  ChevD: () => (
    <svg
      width="12"
      height="12"
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
  ChevUp: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m48 160 80-80 80 80" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M216 56H40M168 56V40a16 16 0 0 0-16-16h-48a16 16 0 0 0-16 16v16M200 56l-16 144a16 16 0 0 1-16 16H88a16 16 0 0 1-16-16L56 56" />
      <path d="M104 104v64M152 104v64" />
    </svg>
  ),
  Edit: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M227.31 73.37 182.63 28.69a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69A15.86 15.86 0 0 0 104 219.31l83-83" />
      <path d="m160 64 32 32" />
    </svg>
  ),
  Book: () => (
    <svg
      width="13"
      height="13"
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
  Users: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M84 168c0-33.14 19.6-60 44-60s44 26.86 44 60" />
      <circle cx="128" cy="72" r="36" />
      <path d="M196 184c0-28.37 12.54-52 30-60" />
      <circle cx="196" cy="100" r="28" />
    </svg>
  ),
  Tag: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m243.31 136-104-104A16 16 0 0 0 128 28H40a12 12 0 0 0-12 12v88a16 16 0 0 0 4.69 11.31l104 104a16 16 0 0 0 22.62 0l84-84a16 16 0 0 0 0-23.31Z" />
      <circle cx="84" cy="84" r="12" fill="currentColor" stroke="none" />
    </svg>
  ),
  Warning: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M114 40 24 200h208L142 40a16 16 0 0 0-28 0Z" />
      <path d="M128 136v40" />
      <circle cx="128" cy="196" r="4" fill="currentColor" />
    </svg>
  ),
  Scroll: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M64 40h128a8 8 0 0 1 8 8v120a8 8 0 0 1-8 8H64" />
      <path d="M64 40a32 32 0 0 0 0 64M64 40a32 32 0 0 1 0 64" />
      <path d="M64 176a32 32 0 0 0 32 32h128" />
    </svg>
  ),
  Star: () => (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
      <path d="m234.5 114.38-45.1 39.36 13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31-51 31a16 16 0 0 1-23.84-17.34l13.49-58.54-45.11-39.42a16 16 0 0 1 9.12-28.06l59.46-5.15 23.21-55.36a15.95 15.95 0 0 1 29.44 0L166 81.17l59.44 5.15a16 16 0 0 1 9.11 28.06Z" />
    </svg>
  ),
  Refresh: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M176 48h48v48" />
      <path d="M224 48A104 104 0 0 0 56 56.8" />
      <path d="M80 208H32v-48" />
      <path d="M32 208a104 104 0 0 0 168-8.8" />
    </svg>
  ),
  Hash: () => (
    <svg
      width="11"
      height="11"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M40 100h176M40 156h176M100 40l-16 176M172 40l-16 176" />
    </svg>
  ),
  Lock: () => (
    <svg
      width="11"
      height="11"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="40" y="112" width="176" height="128" rx="8" />
      <path d="M88 112V80a40 40 0 0 1 80 0v32" />
    </svg>
  ),
  Unlock: () => (
    <svg
      width="11"
      height="11"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="40" y="112" width="176" height="128" rx="8" />
      <path d="M88 112V80a40 40 0 0 1 79.25-7" />
    </svg>
  ),
  Globe: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="128" cy="128" r="104" />
      <path d="M168 128c0 40-18 80-40 104M88 128c0 40 18 80 40 104M168 128c0-40-18-80-40-104M88 128c0-40 18-80 40-104M24 128h208" />
    </svg>
  ),
};

/* ══════════════════════════ FORM PRIMITIVES ═════════════════════════════════*/

/* Styled field wrapper — Rule 6: label above, error below */
function Field({ label, helper, error, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: T.sans,
          fontSize: 12,
          fontWeight: 600,
          color: error ? T.err : "rgba(255,255,255,0.55)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {label}
        {required && <span style={{ color: T.err }}>*</span>}
      </label>
      {children}
      {helper && !error && (
        <span
          style={{
            fontFamily: T.sans,
            fontSize: 11,
            color: "rgba(255,255,255,0.28)",
          }}
        >
          {helper}
        </span>
      )}
      {error && (
        <span
          style={{
            fontFamily: T.sans,
            fontSize: 11,
            color: T.err,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Ic.Warning /> {error}
        </span>
      )}
    </div>
  );
}

const inputBase = (err = false) => ({
  width: "100%",
  padding: "10px 13px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${err ? T.errBrd : T.border}`,
  fontFamily: T.sans,
  fontSize: 14,
  color: T.text,
  outline: "none",
  transition: "border-color 0.2s",
  resize: "vertical",
});

/* Segment pills */
function SegGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        const cfg = opt.cfg || { color: T.em, dim: T.emDim, brd: T.emBrd };
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              background: active ? cfg.dim : "rgba(255,255,255,0.04)",
              outline: active
                ? `1px solid ${cfg.brd}`
                : "1px solid rgba(255,255,255,0.09)",
              fontFamily: T.sans,
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              color: active ? cfg.color : T.muted,
              transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.96)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          >
            {opt.icon && (
              <span
                style={{ color: active ? cfg.color : "rgba(255,255,255,0.3)" }}
              >
                {opt.icon}
              </span>
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* Tag input */
function TagInput({ tags, onChange, placeholder = "Ajouter…" }) {
  const [input, setInput] = useState("");
  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val) && tags.length < 10) {
      onChange([...tags, val]);
      setInput("");
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 0,
        }}
      >
        {tags?.map((tag) => (
          <span
            key={tag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 10px",
              borderRadius: 99,
              background: T.emDim,
              border: `1px solid ${T.emBrd}`,
              fontFamily: T.mono,
              fontSize: 10,
              color: T.em,
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.em,
                display: "flex",
                lineHeight: 1,
              }}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 256 256"
                fill="none"
                stroke="currentColor"
                strokeWidth="30"
                strokeLinecap="round"
              >
                <path d="M200 56 56 200M56 56l144 144" />
              </svg>
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          style={{ ...inputBase(), flex: 1 }}
          onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
          onBlur={(e) => {
            e.target.style.borderColor = T.border;
            addTag();
          }}
        />
        <button
          type="button"
          onClick={addTag}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: T.emDim,
            border: `1px solid ${T.emBrd}`,
            cursor: "pointer",
            color: T.em,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Ic.Plus />
        </button>
      </div>
    </div>
  );
}

/* Toast */
let _tid = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = ++_tid;
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  return [toasts, push];
}

/* ══════════════════════════ STEP PROGRESS BAR ═══════════════════════════════*/
function StepBar({ step }) {
  const steps = ["Informations", "Questions"];
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
      {steps.map((s, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <div
            key={s}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              paddingRight: i < steps.length - 1 ? 12 : 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: done
                    ? T.em
                    : active
                      ? T.emDim
                      : "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${done ? T.em : active ? T.emBrd : T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: T.mono,
                  fontSize: 10,
                  fontWeight: 700,
                  color: done
                    ? "#fff"
                    : active
                      ? T.em
                      : "rgba(255,255,255,0.3)",
                  flexShrink: 0,
                  transition: "all 0.3s",
                }}
              >
                {done ? <Ic.Check /> : i + 1}
              </div>
              <span
                style={{
                  fontFamily: T.sans,
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  color: active ? T.text : done ? T.em : T.muted,
                  transition: "color 0.3s",
                }}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: done ? T.em : T.border,
                    transition: "background 0.4s",
                    marginLeft: 4,
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuestionForm({ question, onChange, onSave, onCancel, index }) {
  const errors = {};
  if (!question.entitled.trim()) errors.entitled = "L'énoncé est requis";
  if (question.choices.some((c) => !c.trim()))
    errors.choices = "Les 4 choix sont requis";
  if (!question.answer) errors.answer = "Sélectionnez la bonne réponse";
  // if (!question.explanation.trim())
  //   errors.explanation = "L'explication est requise";

  const [touched, setTouched] = useState({});
  const touch = (key) => setTouched((p) => ({ ...p, [key]: true }));

  const handleSave = () => {
    setTouched({
      entitled: true,
      choices: true,
      answer: true,
      explanation: true,
    });
    if (Object.keys(errors).length === 0) onSave();
  };

  return (
    <div
      style={{
        background: "rgba(16,185,129,0.04)",
        border: `1px solid ${T.emBrd}`,
        borderRadius: 16,
        padding: "20px 20px",
        animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 10,
          color: T.em,
          letterSpacing: "0.1em",
          marginBottom: 16,
        }}
      >
        QUESTION {index !== undefined ? index + 1 : "·"} — EN COURS D'ÉDITION
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Entitled */}
        <Field
          label="Énoncé"
          required
          error={touched.entitled && errors.entitled}
        >
          <textarea
            value={question.entitled}
            onChange={(e) => {
              onChange({ ...question, entitled: e.target.value });
              touch("entitled");
            }}
            rows={2}
            placeholder="Formulez votre question ici…"
            style={inputBase(touched.entitled && errors.entitled)}
            onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
            onBlur={(e) => {
              e.target.style.borderColor =
                touched.entitled && errors.entitled ? T.errBrd : T.border;
              touch("entitled");
            }}
          />
        </Field>

        {/* Choices */}
        <Field
          label="Choix de réponse"
          helper="Cochez le bouton à gauche pour marquer la bonne réponse"
          required
          error={touched.choices && (errors.choices || errors.answer)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {question.choices.map((choice, ci) => {
              const isCorrect = question.answer === choice && choice.trim();
              return (
                <div
                  key={ci}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (choice.trim())
                        onChange({ ...question, answer: choice });
                      touch("answer");
                    }}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      flexShrink: 0,
                      border: `1.5px solid ${isCorrect ? T.emBrd : T.border}`,
                      background: isCorrect
                        ? T.emDim
                        : "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isCorrect ? T.em : T.muted,
                      transition: "all 0.18s",
                    }}
                  >
                    {isCorrect ? (
                      <Ic.Check />
                    ) : (
                      <span style={{ fontFamily: T.mono, fontSize: 10 }}>
                        {["A", "B", "C", "D"][ci]}
                      </span>
                    )}
                  </button>
                  <input
                    value={choice}
                    onChange={(e) => {
                      const nc = [...question.choices];
                      nc[ci] = e.target.value;
                      const ans =
                        question.answer === choice
                          ? e.target.value
                          : question.answer;
                      onChange({ ...question, choices: nc, answer: ans });
                      touch("choices");
                    }}
                    placeholder={`Choix ${["A", "B", "C", "D"][ci]}…`}
                    style={{
                      ...inputBase(touched.choices && !choice.trim()),
                      flex: 1,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                    onBlur={(e) => {
                      e.target.style.borderColor =
                        touched.choices && !choice.trim() ? T.errBrd : T.border;
                      touch("choices");
                    }}
                  />
                </div>
              );
            })}
          </div>
        </Field>

        {/* Difficulty + Books row */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <Field label="Difficulté">
            <SegGroup
              value={question.difficulty}
              onChange={(v) => onChange({ ...question, difficulty: v })}
              options={["easy", "medium", "hard"].map((d) => ({
                value: d,
                label: DIFF_CFG[d].label,
                cfg: DIFF_CFG[d],
              }))}
            />
          </Field>
          {/* <Field
            label="Livres bibliques"
            helper="Appuyez sur Entrée pour ajouter"
          >
            <TagInput
              tags={question.books}
              onChange={(books) => onChange({ ...question, books })}
              placeholder="Ex: Genèse…"
            />
          </Field> */}
        </div>

        {/* Tags */}
        {/* <Field
          label="Tags / Personnages"
          helper="Personnages bibliques, thèmes (max 8)"
        >
          <TagInput
            tags={question.tags}
            onChange={(tags) => onChange({ ...question, tags })}
            placeholder="Ex: Moïse, Alliance…"
          />
        </Field> */}

        {/* Explanation */}
        <Field
          label="Explication"
          required
          error={touched.explanation && errors.explanation}
        >
          <textarea
            value={question.explanation}
            onChange={(e) => {
              onChange({ ...question, explanation: e.target.value });
              touch("explanation");
            }}
            rows={2}
            placeholder="Explication affichée après la réponse…"
            style={inputBase(touched.explanation && errors.explanation)}
            onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
            onBlur={(e) => {
              e.target.style.borderColor =
                touched.explanation && errors.explanation ? T.errBrd : T.border;
              touch("explanation");
            }}
          />
        </Field>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            paddingTop: 4,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${T.border}`,
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 12,
              color: T.muted,
              transition: "all 0.18s",
            }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: 10,
              background: `linear-gradient(135deg,${T.em},#059669)`,
              border: "none",
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              transition: "all 0.2s",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.97)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          >
            <Ic.Check /> Valider la question
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ QUESTION ROW (saved) ════════════════════════════*/
function QuestionRow({
  q,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  const cfg = DIFF_CFG[q.difficulty] || DIFF_CFG.medium;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 0",
        borderBottom: `1px solid ${T.border}`,
        animation: "fadeUp 0.28s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      {/* Number */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 7,
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.mono,
          fontSize: 10,
          color: T.muted,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {index + 1}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 500,
              color: T.text,
              lineHeight: 1.4,
            }}
          >
            {q.entitled.length > 70
              ? q.entitled.slice(0, 68) + "…"
              : q.entitled}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              padding: "2px 8px",
              borderRadius: 99,
              background: cfg.dim,
              border: `1px solid ${cfg.brd}`,
              fontFamily: T.mono,
              fontSize: 9,
              color: cfg.color,
            }}
          >
            {cfg.label}
          </span>
          <span
            style={{
              fontFamily: T.mono,
              fontSize: 10,
              color: "rgba(255,255,255,0.28)",
            }}
          >
            Rép:{" "}
            <strong style={{ color: T.em }}>
              {q.answer.length > 24 ? q.answer.slice(0, 22) + "…" : q.answer}
            </strong>
          </span>
          {/* {q.books?.length > 0 && (
            <span
              style={{
                fontFamily: T.mono,
                fontSize: 9,
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {q.books?.slice(0, 2).join(", ")}
              {q.books?.length > 2 ? `+${q.books?.length - 2}` : ""}
            </span>
          )} */}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${T.border}`,
            cursor: index === 0 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: index === 0 ? "rgba(255,255,255,0.15)" : T.muted,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (index !== 0) e.currentTarget.style.color = T.text;
          }}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color =
              index === 0 ? "rgba(255,255,255,0.15)" : T.muted)
          }
        >
          <Ic.ChevUp />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${T.border}`,
            cursor: index === total - 1 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: index === total - 1 ? "rgba(255,255,255,0.15)" : T.muted,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (index !== total - 1) e.currentTarget.style.color = T.text;
          }}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color =
              index === total - 1 ? "rgba(255,255,255,0.15)" : T.muted)
          }
        >
          <Ic.ChevD />
        </button>
        <button
          type="button"
          onClick={onEdit}
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
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
        >
          <Ic.Edit />
        </button>
        <button
          type="button"
          onClick={onDelete}
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
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
        >
          <Ic.Trash />
        </button>
      </div>
    </div>
  );
}

function CreateQuizModal({ onClose, onCreated, toast, quiz, isEdit }) {
  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState(isEdit ? quiz : emptyQuiz);
  const [questions, setQuestions] = useState([]);
  const [editIdx, setEditIdx] = useState(null); // null = no form open, -1 = new, N = edit index
  const [draft, setDraft] = useState(emptyQuestion);
  const [saving, setSaving] = useState(false);
  const [metaErrors, setMetaErrors] = useState({});
  const [user] = useAuthState(auth);
  const db = getFirestore();

  useEffect(() => {
    console.log("isEdit : ", isEdit);
    console.log("meta : ", meta);
  }, [meta]);

  /* Escape key */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") {
        if (editIdx !== null) setEditIdx(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [editIdx, onClose]);

  /* ── Step 1 validation ── */
  const validateMeta = () => {
    const e = {};
    if (!meta.entitled.trim()) e.entitled = "Le titre est requis";
    if (!meta.description.trim()) e.description = "La description est requise";
    if (!meta.difficulty) e.difficulty = "Choisissez un niveau";
    if (!meta.type) e.type = "Choisissez un type";
    setMetaErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToStep2 = () => {
    if (validateMeta()) setStep(1);
  };

  /* ── Question management ── */
  const openNew = () => {
    setDraft({ ...emptyQuestion });
    setEditIdx(-1);
  };
  const openEdit = (i) => {
    setDraft({ ...questions[i] });
    setEditIdx(i);
  };
  const saveQ = () => {
    if (editIdx === -1) setQuestions((p) => [...p, draft]);
    else {
      setQuestions((p) => {
        const n = [...p];
        n[editIdx] = draft;
        return n;
      });
    }
    setEditIdx(null);
    setDraft(emptyQuestion);
  };
  const deleteQ = (i) => setQuestions((p) => p.filter((_, idx) => idx !== i));
  const moveUp = (i) =>
    setQuestions((p) => {
      const n = [...p];
      [n[i - 1], n[i]] = [n[i], n[i - 1]];
      return n;
    });
  const moveDown = (i) =>
    setQuestions((p) => {
      const n = [...p];
      [n[i], n[i + 1]] = [n[i + 1], n[i]];
      return n;
    });

  /* ── Firebase save ── */
  const handleSave = () => {
    if (questions.length === 0) {
      toast("Ajoutez au moins une question", "error");
      return;
    }
    setSaving(true);
    try {
      const questionIds = [];
      Promise.all(
        questions.map((q) => {
          console.log("q : ", q);
          console.log("user : ", user);
          const newQuestionRef = doc(collection(db, "questions"));
          addDoc(collection(db, "questions"), {
            answer: q.answer,
            author: user?.uid || "anonymous",
            books: q.books,
            choices: q.choices,
            createdAt: serverTimestamp(),
            entitled: q.entitled,
            explanation: q.explanation,
            difficulty: q.difficulty,
            id: newQuestionRef.id,
            tags: q.tags,
            updatedAt: null,
          });
          questionIds.push(newQuestionRef.id);
        }),
      );

      console.log("questionIds : ", questionIds);

      const newQuizRef = doc(collection(db, "quizzes"));

      const quizObject = {
        author: user?.uid || "anonymous",
        createdAt: serverTimestamp(),
        description: meta.description,
        difficulty: meta.difficulty,
        entitled: meta.entitled,
        id: newQuizRef.id,
        questions: questionIds, // array of question document IDs
        type: meta.type,
      };

      console.log("quizObject : ", quizObject);

      const quizRef = addDoc(collection(db, "quizzes"), quizObject);

      // Simulate async save
      new Promise((r) => setTimeout(r, 1200));
      toast(
        `Quiz "${meta.entitled}" créé avec ${questions.length} question${questions.length > 1 ? "s" : ""} !`,
      );
      onCreated({ id: Date.now().toString(), ...meta, questions });
      onClose();
    } catch (err) {
      toast(`Erreur lors de la sauvegarde : ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Layout ── */
  const diffOpts = ["easy", "medium", "hard"].map((d) => ({
    value: d,
    label: DIFF_CFG[d].label,
    cfg: DIFF_CFG[d],
  }));
  const typeOpts = [
    {
      value: "book",
      label: "Par livre",
      icon: <Ic.Book />,
      cfg: { color: T.em, dim: T.emDim, brd: T.emBrd },
    },
    {
      value: "character",
      label: "Personnage",
      icon: <Ic.Users />,
      cfg: { color: T.warn, dim: T.warnDim, brd: T.warnBrd },
    },
    {
      value: "theme",
      label: "Thème / Tag",
      icon: <Ic.Tag />,
      cfg: {
        color: "#6366f1",
        dim: "rgba(99,102,241,0.1)",
        brd: "rgba(99,102,241,0.3)",
      },
    },
  ];
  const visOpts = [
    {
      value: "public",
      label: "Public",
      icon: <Ic.Globe />,
      cfg: { color: T.em, dim: T.emDim, brd: T.emBrd },
    },
    {
      value: "private",
      label: "Privé",
      icon: <Ic.Lock />,
      cfg: { color: T.muted, dim: "rgba(255,255,255,0.04)", brd: T.border },
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(10px)",
        }}
        onClick={() => {
          if (editIdx === null) onClose();
        }}
      />

      {/* Slide panel from right */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          marginLeft: "auto",
          marginRight: "auto",
          zIndex: 101,
          width: "min(640px, 100vw)",
          background: T.surf,
          border: `1px solid ${T.border}`,
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.05), -24px 0 64px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          animation: "slidePanel 0.38s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 10,
                color: T.em,
                letterSpacing: "0.12em",
                marginBottom: 4,
              }}
            >
              NOUVEAU QUIZ
            </div>
            <h2
              style={{
                fontFamily: T.sans,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: T.text,
              }}
            >
              {step === 0 ? "Informations générales" : "Questions"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${T.border}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.muted,
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.text;
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.muted;
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          >
            <Ic.X />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px" }}>
          <StepBar step={step} />

          {/* ── STEP 0: Metadata ── */}
          {step === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                animation: "fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              <Field label="Titre du quiz" required error={metaErrors.entitled}>
                <input
                  value={meta.entitled}
                  onChange={(e) => {
                    setMeta((p) => ({ ...p, entitled: e.target.value }));
                    setMetaErrors((p) => ({ ...p, entitled: "" }));
                  }}
                  placeholder="Ex: Les miracles de Jésus dans les Évangiles"
                  style={inputBase(!!metaErrors.entitled)}
                  onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = metaErrors.entitled
                      ? T.errBrd
                      : T.border)
                  }
                />
              </Field>

              <Field
                label="Description"
                required
                error={metaErrors.description}
                helper="Décrivez le contenu et les thèmes abordés (affiché dans le catalogue)"
              >
                <textarea
                  value={meta.description}
                  onChange={(e) => {
                    setMeta((p) => ({ ...p, description: e.target.value }));
                    setMetaErrors((p) => ({ ...p, description: "" }));
                  }}
                  rows={3}
                  placeholder="Ce quiz explore les principaux miracles rapportés dans les quatre évangiles…"
                  style={inputBase(!!metaErrors.description)}
                  onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = metaErrors.description
                      ? T.errBrd
                      : T.border)
                  }
                />
              </Field>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <Field
                  label="Niveau de difficulté"
                  required
                  error={metaErrors.difficulty}
                >
                  <SegGroup
                    value={meta.difficulty}
                    onChange={(v) => {
                      setMeta((p) => ({ ...p, difficulty: v }));
                      setMetaErrors((p) => ({ ...p, difficulty: "" }));
                    }}
                    options={diffOpts}
                  />
                </Field>
              </div>

              <Field
                label="Type de quiz"
                required
                error={metaErrors.type}
                helper="Détermine comment le quiz apparaît dans le catalogue"
              >
                <SegGroup
                  value={meta.type}
                  onChange={(v) => {
                    setMeta((p) => ({ ...p, type: v }));
                    setMetaErrors((p) => ({ ...p, type: "" }));
                  }}
                  options={typeOpts}
                />
              </Field>

              {/* <Field
                label="Livres bibliques associés"
                helper="Livres de la Bible couverts par ce quiz"
              >
                <TagInput
                  tags={meta.books}
                  onChange={(books) => setMeta((p) => ({ ...p, books }))}
                  placeholder="Ex: Matthieu, Luc, Jean…"
                />
              </Field> */}
            </div>
          )}

          {/* ── STEP 1: Questions ── */}
          {step === 1 && (
            <div
              style={{
                animation: "fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {/* Summary of meta */}
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${T.border}`,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.text,
                    flex: 1,
                  }}
                >
                  {meta.entitled}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "2px 9px",
                    borderRadius: 99,
                    background: DIFF_CFG[meta.difficulty].dim,
                    border: `1px solid ${DIFF_CFG[meta.difficulty].brd}`,
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: DIFF_CFG[meta.difficulty].color,
                  }}
                >
                  {DIFF_CFG[meta.difficulty].label}
                </span>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: T.sans,
                    fontSize: 11,
                    color: T.em,
                  }}
                >
                  <Ic.Edit /> Modifier
                </button>
              </div>

              {/* Questions header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {questions.length} QUESTION{questions.length !== 1 ? "S" : ""}
                </div>
                {editIdx === null && (
                  <button
                    type="button"
                    onClick={openNew}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      borderRadius: 10,
                      background: T.emDim,
                      border: `1px solid ${T.emBrd}`,
                      cursor: "pointer",
                      fontFamily: T.sans,
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.em,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(16,185,129,0.18)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = T.emDim)
                    }
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.96)")
                    }
                    onMouseUp={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <Ic.Plus /> Ajouter une question
                  </button>
                )}
              </div>

              {/* New question form */}
              {editIdx === -1 && (
                <div style={{ marginBottom: 16 }}>
                  <QuestionForm
                    question={draft}
                    onChange={setDraft}
                    onSave={saveQ}
                    onCancel={() => {
                      setEditIdx(null);
                      setDraft(emptyQuestion);
                    }}
                    index={questions.length}
                  />
                </div>
              )}

              {/* Saved questions */}
              {questions.length === 0 && editIdx === null ? (
                <div style={{ padding: "48px 0", textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 32,
                      color: "rgba(255,255,255,0.05)",
                      marginBottom: 14,
                    }}
                  >
                    ?
                  </div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.3)",
                      marginBottom: 8,
                    }}
                  >
                    Aucun quiz pour l'instant
                  </div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    Cliquez sur "Ajouter une question" pour commencer
                  </div>
                </div>
              ) : (
                <div>
                  {questions.map((q, i) =>
                    editIdx === i ? (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <QuestionForm
                          question={draft}
                          onChange={setDraft}
                          onSave={saveQ}
                          onCancel={() => {
                            setEditIdx(null);
                            setDraft(BLANK_Q);
                          }}
                          index={i}
                        />
                      </div>
                    ) : (
                      <QuestionRow
                        key={i}
                        q={q}
                        index={i}
                        total={questions.length}
                        onEdit={() => openEdit(i)}
                        onDelete={() => deleteQ(i)}
                        onMoveUp={() => moveUp(i)}
                        onMoveDown={() => moveDown(i)}
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          {step === 0 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: T.muted,
                  transition: "all 0.18s",
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={goToStep2}
                style={{
                  flex: 2,
                  padding: "11px 0",
                  borderRadius: 12,
                  background: `linear-gradient(135deg,${T.em},#059669)`,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: T.sans,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  transition: "all 0.22s",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.97)")
                }
                onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              >
                Questions <Ic.ChevR />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(0)}
                style={{
                  padding: "11px 14px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: T.muted,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.18s",
                }}
              >
                <Ic.ChevL /> Retour
              </button>
              <div
                style={{
                  flex: 1,
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.25)",
                  textAlign: "center",
                }}
              >
                {questions.length} question{questions.length !== 1 ? "s" : ""} ·{" "}
                {DIFF_CFG[meta.difficulty].label}
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || questions.length === 0}
                style={{
                  flex: 2,
                  padding: "11px 0",
                  borderRadius: 12,
                  border: "none",
                  background:
                    saving || questions.length === 0
                      ? "rgba(16,185,129,0.4)"
                      : `linear-gradient(135deg,${T.em},#059669)`,
                  cursor:
                    saving || questions.length === 0
                      ? "not-allowed"
                      : "pointer",
                  fontFamily: T.sans,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  transition: "all 0.22s",
                }}
                onMouseDown={(e) => {
                  if (!saving && questions.length)
                    e.currentTarget.style.transform = "scale(0.97)";
                }}
                onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              >
                {saving ? (
                  <>
                    <Ic.Refresh /> Enregistrement…
                  </>
                ) : (
                  <>
                    <Ic.Check /> Publier le quiz
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════ QUIZ DRAFT CARD ═════════════════════════════════*/
function DraftCard({ quiz, onEdit, onDelete, index }) {
  const [hov, setHov] = useState(false);
  const cfg = DIFF_CFG[quiz.difficulty] || DIFF_CFG.medium;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surf,
        border: `1px solid ${hov ? cfg.brd : T.border}`,
        borderRadius: 18,
        overflow: "hidden",
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateY(-3px)" : "none",
        animation: `fadeUp 0.38s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s both`,
      }}
    >
      <div style={{ padding: "20px 20px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              padding: "2px 9px",
              borderRadius: 99,
              background: cfg.dim,
              border: `1px solid ${cfg.brd}`,
              fontFamily: T.mono,
              fontSize: 9,
              color: cfg.color,
            }}
          >
            {cfg.label}
          </span>
          <span
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              color: "rgba(255,255,255,0.25)",
              marginTop: 2,
            }}
          >
            {quiz.questions?.length || 0} Q
          </span>
        </div>
        <h3
          style={{
            fontFamily: T.sans,
            fontSize: 14,
            fontWeight: 700,
            color: T.text,
            marginBottom: 6,
            letterSpacing: "-0.02em",
            lineHeight: 1.35,
          }}
        >
          {quiz.entitled}
        </h3>
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
        {/* {quiz.books?.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginBottom: 10,
            }}
          >
            {quiz.books.slice(0, 3).map((b) => (
              <span
                key={b}
                style={{
                  fontFamily: T.mono,
                  fontSize: 9,
                  padding: "2px 7px",
                  borderRadius: 5,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.border}`,
                  color: T.muted,
                }}
              >
                {b}
              </span>
            ))}
            {quiz.books.length > 3 && (
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                +{quiz.books.length - 3}
              </span>
            )}
          </div>
        )} */}
      </div>
      <div
        style={{
          padding: "10px 20px",
          background: "rgba(255,255,255,0.015)",
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 9,
            background: T.emDim,
            border: `1px solid ${T.emBrd}`,
            cursor: "pointer",
            fontFamily: T.sans,
            fontSize: 12,
            fontWeight: 600,
            color: T.em,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(16,185,129,0.18)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = T.emDim)}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        >
          <Ic.Edit /> Modifier
        </button>
        <button
          onClick={onDelete}
          style={{
            width: 32,
            borderRadius: 9,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${T.border}`,
            cursor: "pointer",
            color: T.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = T.err;
            e.currentTarget.style.borderColor = T.errBrd;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = T.muted;
            e.currentTarget.style.borderColor = T.border;
          }}
        >
          <Ic.Trash />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════ MAIN PAGE ═══════════════════════════════════════*/
export default function AdminQuizModal({ onClose, isEdit, quiz }) {
  const [modalOpen, setModalOpen] = useState(true);
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [toasts, toast] = useToast();

  useEffect(() => {
    console.log("quiz : ", quiz);
  }, [quiz]);

  const handleCreated = useCallback((quiz) => {
    setMyQuizzes((p) => [quiz, ...p]);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      setMyQuizzes((p) => p.filter((q) => q.id !== id));
      toast("Quiz supprimé");
    },
    [toast],
  );

  return (
    <div>
      <div
        style={{ background: T.bg, minHeight: "100dvh", color: T.text }}
      ></div>

      {/* ── MODAL ── */}
      {modalOpen && (
        <CreateQuizModal
          onClose={() => {
            onClose();
            setModalOpen(false);
          }}
          onCreated={handleCreated}
          isEdit={isEdit}
          quiz={quiz}
          toast={toast}
        />
      )}

      {/* ── TOASTS ── */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderRadius: 12,
              background:
                t.type === "error"
                  ? "rgba(30,10,10,0.98)"
                  : "rgba(10,20,16,0.98)",
              border: `1px solid ${t.type === "error" ? T.errBrd : T.emBrd}`,
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              animation: "toastIn 0.32s cubic-bezier(0.16,1,0.3,1) both",
              maxWidth: 340,
              pointerEvents: "auto",
            }}
          >
            <span
              style={{
                color: t.type === "error" ? T.err : T.em,
                flexShrink: 0,
              }}
            >
              {t.type === "error" ? <Ic.Warning /> : <Ic.Check />}
            </span>
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text }}>
              {t.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
