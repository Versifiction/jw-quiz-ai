import T from "../DesignTokens"

const inputStyle = (hasError) => ({
  width: "100%",
  padding: "10px 13px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${hasError ? T.errBrd : T.border}`,
  fontFamily: T.sans,
  fontSize: 14,
  color: T.text,
  outline: "none",
  transition: "border-color 0.2s",
});

export default inputStyle