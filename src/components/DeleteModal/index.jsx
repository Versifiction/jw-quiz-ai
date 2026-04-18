import { Ic } from "../ui/Icons";
import T from "../ui/DesignTokens";
import Sk from "../ui/Sk";

/* Confirm delete modal */
export default function DeleteModal({ label, onConfirm, onCancel, loading }) {
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
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onCancel}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 400,
          background: T.surf,
          border: `1px solid ${T.errBrd}`,
          borderRadius: 20,
          padding: 28,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.6)",
          animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: T.errDim,
            border: `1px solid ${T.errBrd}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.err,
            marginBottom: 16,
          }}
        >
          <Ic.Warning />
        </div>
        <h3
          style={{
            fontFamily: T.sans,
            fontSize: 17,
            fontWeight: 700,
            color: T.text,
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Confirmer la suppression
        </h3>
        <p
          style={{
            fontFamily: T.sans,
            fontSize: 14,
            color: T.muted,
            marginBottom: 22,
            lineHeight: 1.6,
          }}
        >
          Supprimer <strong style={{ color: T.text }}>{label}</strong> ? Cette
          action est irréversible et supprimera les données de Firebase.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${T.border}`,
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 13,
              color: T.muted,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              e.currentTarget.style.color = T.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = T.muted;
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: T.err,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            onMouseDown={(e) => {
              if (!loading) e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          >
            {loading ? (
              <>
                <Sk w={14} h={14} r={99} style={{ display: "inline-block" }} />{" "}
                Suppression…
              </>
            ) : (
              <>
                <Ic.Trash /> Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
