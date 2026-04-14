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
import { Ic } from "../ui/Icons";
import Sk from "../ui/Sk";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import Field from "../ui/Field";

export default function AdminUsersTab({ db, toast }) {
  const {
    data: users,
    loading,
    error,
    refetch,
  } = useCollection(db, "users", [orderBy("createdAt", "desc")]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = users.filter((u) => {
    const name = (u.displayName || u.email || "").toLowerCase();
    const match =
      !search ||
      name.includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    const role = !filterRole || u.role === filterRole;
    return match && role;
  });

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.user?.id) {
        await updateDoc(doc(db, "users", modal.user.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        toast("Utilisateur mis à jour");
      } else {
        await addDoc(collection(db, "users"), {
          ...form,
          totalScore: 0,
          quizzesCompleted: 0,
          createdAt: serverTimestamp(),
        });
        toast("Utilisateur créé");
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
      await deleteDoc(doc(db, "users", deleteTarget.id));
      toast("Utilisateur supprimé");
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ══════════════════════════ USER FORM MODAL ═════════════════════════════════*/
  function UserModal({ user, onSave, onClose, saving }) {
    const isEdit = !!user?.id;
    const [form, setForm] = useState({
      displayName: user?.displayName || "",
      email: user?.email || "",
      role: user?.role || "user",
      status: user?.status || "active",
    });
    const [errors, setErrors] = useState({});
    const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const validate = () => {
      const e = {};
      if (!form.displayName.trim()) e.displayName = "Le nom est requis";
      if (!form.email.trim() || !form.email.includes("@"))
        e.email = "Email invalide";
      setErrors(e);
      return !Object.keys(e).length;
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
            maxWidth: 460,
            background: T.surf,
            border: `1px solid ${T.border}`,
            borderRadius: 22,
            padding: 28,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06),0 32px 64px rgba(0,0,0,0.65)",
            animation: "fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 22,
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
              {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
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
              }}
            >
              <Ic.X />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Nom complet" error={errors.displayName}>
              <input
                value={form.displayName}
                onChange={(e) => setF("displayName", e.target.value)}
                placeholder="Prénom Nom"
                style={inputStyle(errors.displayName)}
                onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.displayName
                    ? T.errBrd
                    : T.border)
                }
              />
            </Field>
            <Field label="Adresse e-mail" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setF("email", e.target.value)}
                placeholder="email@exemple.com"
                style={inputStyle(errors.email)}
                onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.email
                    ? T.errBrd
                    : T.border)
                }
              />
            </Field>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field label="Rôle">
                <select
                  value={form.role}
                  onChange={(e) => setF("role", e.target.value)}
                  style={{
                    ...inputStyle(false),
                    cursor: "pointer",
                    appearance: "none",
                  }}
                >
                  <option value="user">Utilisateur</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </Field>
              <Field label="Statut">
                <select
                  value={form.status}
                  onChange={(e) => setF("status", e.target.value)}
                  style={{
                    ...inputStyle(false),
                    cursor: "pointer",
                    appearance: "none",
                  }}
                >
                  <option value="active">Actif</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </Field>
            </div>
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
                transition: "all 0.2s",
              }}
              onMouseDown={(e) => {
                if (!saving) e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
            >
              {saving ? (
                "Enregistrement…"
              ) : (
                <>
                  <Ic.Check /> {isEdit ? "Enregistrer" : "Créer l'utilisateur"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const roleColor = { admin: "#f59e0b", moderator: "#6366f1", user: T.em };

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
            placeholder="Rechercher un utilisateur…"
            style={{ ...inputStyle(false), paddingLeft: 36, width: "100%" }}
            onFocus={(e) => (e.target.style.borderColor = T.emBrd)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{
            ...inputStyle(false),
            width: "auto",
            cursor: "pointer",
            appearance: "none",
          }}
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Administrateurs</option>
          <option value="moderator">Modérateurs</option>
          <option value="user">Utilisateurs</option>
        </select>
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
          onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
        >
          <Ic.Refresh />
        </button>
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
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-1px)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        >
          <Ic.Plus /> Nouvel utilisateur
        </button>
      </div>

      <div
        style={{
          fontFamily: T.mono,
          fontSize: 11,
          color: "rgba(255,255,255,0.28)",
          marginBottom: 10,
        }}
      >
        {filtered.length} utilisateur{filtered.length !== 1 ? "s" : ""}
      </div>

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
            gridTemplateColumns: "1fr 160px 110px 100px 90px",
            padding: "11px 20px",
            borderBottom: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {["Utilisateur", "Email", "Rôle", "Statut", "Actions"].map((h) => (
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

        {loading && (
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 160px 110px 100px 90px",
                  alignItems: "center",
                  gap: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Sk w={32} h={32} r={99} />
                  <Sk h={14} w="60%" />
                </div>
                <Sk h={13} w="80%" />
                <Sk h={22} w={70} r={99} />
                <Sk h={22} w={60} r={99} />
                <Sk h={28} w={70} r={8} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ padding: 32, textAlign: "center", color: T.err }}>
            <Ic.Warning />
            <br />
            <span style={{ fontFamily: T.sans, fontSize: 14 }}>{error}</span>
          </div>
        )}

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
              {search || filterRole
                ? "Aucun utilisateur ne correspond"
                : "Aucun utilisateur pour l'instant."}
            </div>
          </div>
        )}

        {!loading &&
          filtered.map((u, i) => (
            <div
              key={u.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px 110px 100px 90px",
                padding: "12px 20px",
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  paddingRight: 12,
                  minWidth: 0,
                }}
              >
                <Avatar name={u.displayName || u.email} size={32} />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.displayName || "—"}
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {u.id.slice(0, 12)}…
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 11,
                  color: T.muted,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingRight: 8,
                }}
              >
                {u.email || "—"}
              </div>
              <div>
                <Badge
                  label={u.role || "user"}
                  color={roleColor[u.role] || T.em}
                />
              </div>
              <div>
                <Badge
                  label={u.status === "suspended" ? "Suspendu" : "Actif"}
                  color={u.status === "suspended" ? T.err : T.em}
                />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setModal({ mode: "edit", user: u })}
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
                  onClick={() => setDeleteTarget(u)}
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

      {modal && (
        <UserModal
          user={modal.user}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          label={deleteTarget.displayName || deleteTarget.email}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
