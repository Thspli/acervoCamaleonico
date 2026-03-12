"use client";

export function NavLinks() {
  return (
    <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
      {["Fichas", "Campanhas", "Configurações"].map((item) => (
        <a
          key={item}
          href="#"
          style={{
            color: "#81c784",
            fontSize: "15px",
            letterSpacing: "0.05em",
            textDecoration: "none",
            transition: "color 0.2s",
            fontFamily: "var(--font-geist-sans), sans-serif",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a5d6a7")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#81c784")}
        >
          {item}
        </a>
      ))}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2px solid #007A51",
          background: "#0d1a14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#81c784",
          fontSize: "18px",
        }}
      >
        👤
      </div>
    </div>
  );
}