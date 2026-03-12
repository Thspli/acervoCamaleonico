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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/Camalogonico.png"
            alt="Logo Acervo Camaleônico"
            style={{ width: 38, height: 38, objectFit: "contain" }}
          />
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: "#e8f5e9",
              fontFamily: "var(--font-museo), sans-serif",
            }}
          >
            Acervo Camaleônico
          </span>
        </div>
        <NavLinks />
      </nav>

      <HeaderAccent />
    </>
  );
}