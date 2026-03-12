"use client";

export function HeroButtons() {
  return (
    <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
      <a
        href="#"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 28px",
          background: "#007A51",
          color: "#e8f5e9",
          borderRadius: "3px",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textDecoration: "none",
          fontFamily: "var(--font-geist-sans), sans-serif",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#00955f")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#007A51")}
      >
        Ver Fichas
      </a>
      <a
        href="#"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "12px 28px",
          border: "1px solid #007A51",
          color: "#81c784",
          borderRadius: "3px",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textDecoration: "none",
          fontFamily: "var(--font-geist-sans), sans-serif",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,122,81,0.12)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Campanhas
      </a>
    </div>
  );
}