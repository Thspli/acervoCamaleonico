"use client";

import { NavLinks } from "./NavLinks";
import { HeaderAccent } from "./HeaderAccent";

export default function Header() {
  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          height: "68px",
          background: "rgba(5,5,5,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "2px solid #007A51",
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          <img
            src="/2.png"
            alt="Logo Acervo Camaleônico"
            style={{ width: 38, height: 38, objectFit: "contain" }}
          />
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: "#007A51",
              fontFamily: "var(--font-museo), sans-serif",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00955f")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#007A51")}
          >
            Acervo Camaleônico
          </span>
        </a>
        <NavLinks />
      </nav>

      <HeaderAccent />
    </>
  );
}