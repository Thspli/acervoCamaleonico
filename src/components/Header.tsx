"use client";

import { NavLinks } from "./NavLinks";
import { HeaderAccent } from "./HeaderAccent";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Fichas",        href: "/fichas" },
  { label: "Campanhas",     href: "/campanhas" },
  { label: "Configurações", href: "/configuracoes" },
];

function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão hamburguer — só mobile */}
      <button
        className="hide-desktop"
        onClick={() => setOpen(v => !v)}
        style={{
          background: "none", border: "1px solid rgba(0,122,81,0.3)",
          borderRadius: "4px", cursor: "pointer",
          width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#007A51", flexShrink: 0,
        }}
      >
        {open ? (
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Drawer mobile */}
      {open && (
        <div style={{
          position: "fixed", top: "71px", left: 0, right: 0,
          background: "rgba(5,14,9,0.98)",
          borderBottom: "1px solid rgba(0,122,81,0.3)",
          backdropFilter: "blur(12px)",
          zIndex: 200,
          padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: "4px",
        }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                color: "#81c784", fontSize: "15px",
                padding: "12px 0",
                borderBottom: "1px solid rgba(0,122,81,0.1)",
                fontFamily: "var(--font-museo), sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
        height: "68px",
        background: "rgba(5,5,5,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "2px solid #007A51",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
          <img src="/2.png" alt="Logo" style={{ width: 34, height: 34, objectFit: "contain" }} />
          <span
            style={{
              fontSize: "16px", fontWeight: 700, letterSpacing: "0.04em",
              color: "#007A51", fontFamily: "var(--font-museo), sans-serif",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#00955f")}
            onMouseLeave={e => (e.currentTarget.style.color = "#007A51")}
          >
            Acervo Camaleônico
          </span>
        </a>

        {/* NavLinks desktop */}
        <div className="hide-mobile">
          <NavLinks />
        </div>

        {/* Hamburguer mobile */}
        <HamburgerMenu />
      </nav>
      <HeaderAccent />
    </>
  );
}