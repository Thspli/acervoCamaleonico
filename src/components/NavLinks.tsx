"use client";

import { useState } from "react";

const IconUser = ({ size = 20, color = "#007A51" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconFriends = ({ size = 20, color = "#007A51" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    <path d="M16 3.5a3.5 3.5 0 0 1 0 7" />
    <path d="M22 20c0-3.5-2.5-6-6-6" />
  </svg>
);

const IconLogout = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#007A51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconBell = ({ size = 22, color = "#007A51" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconClose = ({ size = 18, color = "#2d4a35" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const menuItems = [
  { label: "Perfil", Icon: IconUser },
  { label: "Amizades", Icon: IconFriends },
];

export function NavLinks() {
  const [bell, setBell] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [hoverClose, setHoverClose] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverAvatar, setHoverAvatar] = useState(false);

  return (
    <>
      <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
        {["Fichas", "Campanhas", "Configurações"].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              color: "#007A51",
              fontSize: "15px",
              letterSpacing: "0.05em",
              textDecoration: "none",
              transition: "color 0.2s",
              fontFamily: "var(--font-museo), sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00955f")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#007A51")}
          >
            {item}
          </a>
        ))}

        {/* Sininho */}
        <div
          style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => setBell((v) => !v)}
        >
          <IconBell />
          <div style={{
            position: "absolute", top: "calc(100% + 12px)", right: 0,
            width: "260px", background: "#0d1a14",
            border: "1px solid rgba(0,122,81,0.4)", borderRadius: "4px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 200, overflow: "hidden",
            opacity: bell ? 1 : 0,
            transform: bell ? "translateY(0)" : "translateY(-8px)",
            pointerEvents: bell ? "auto" : "none",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,122,81,0.2)", fontSize: "11px", color: "#007A51", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
              Notificações
            </div>
            <div style={{ padding: "32px 16px", textAlign: "center", fontSize: "13px", color: "#2d4a35" }}>
              Nenhuma notificação por enquanto.
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div
          onClick={() => setSidebar(true)}
          onMouseEnter={() => setHoverAvatar(true)}
          onMouseLeave={() => setHoverAvatar(false)}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            border: `2px solid ${hoverAvatar ? "#00955f" : "#007A51"}`,
            background: hoverAvatar ? "rgba(0,122,81,0.2)" : "#0d1a14",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          <IconUser size={18} color={hoverAvatar ? "#00e87a" : "#007A51"} />
        </div>
      </div>

      {/* Overlay */}
      {sidebar && (
        <div
          onClick={() => setSidebar(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: "300px", height: "100vh",
        background: "#060d08",
        borderLeft: "1px solid rgba(0,122,81,0.3)",
        zIndex: 400,
        display: "flex", flexDirection: "column",
        transform: sidebar ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: sidebar ? "-16px 0 48px rgba(0,0,0,0.7)" : "none",
      }}>

        {/* Header da sidebar */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(0,122,81,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "11px", color: "#007A51", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
            Minha Conta
          </span>
          <button
            onClick={() => setSidebar(false)}
            onMouseEnter={() => setHoverClose(true)}
            onMouseLeave={() => setHoverClose(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "3px", transition: "background 0.2s" }}
          >
            <IconClose color={hoverClose ? "#81c784" : "#2d4a35"} />
          </button>
        </div>

        {/* Perfil do usuário */}
        <div style={{
          padding: "28px 24px",
          borderBottom: "1px solid rgba(0,122,81,0.1)",
          display: "flex", alignItems: "center", gap: "16px",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            border: "2px solid rgba(0,122,81,0.6)",
            background: "rgba(0,122,81,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <IconUser size={24} color="#007A51" />
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#c8e6c9", marginBottom: "4px", fontFamily: "var(--font-museo), sans-serif" }}>
              Aventureiro
            </div>
            <div style={{ fontSize: "12px", color: "#2d4a35", letterSpacing: "0.02em" }}>
              aventureiro@acervo.com
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {menuItems.map(({ label, Icon }) => (
            <SidebarItem key={label} label={label} Icon={Icon} />
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 16px 28px", borderTop: "1px solid rgba(0,122,81,0.1)" }}>
          <a
            href="#"
            onMouseEnter={() => setHoverLogout(true)}
            onMouseLeave={() => setHoverLogout(false)}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "12px 16px", borderRadius: "4px",
              fontSize: "14px",
              color: hoverLogout ? "#ef9a9a" : "#4a7a5a",
              textDecoration: "none",
              background: hoverLogout ? "rgba(180,40,40,0.08)" : "transparent",
              transition: "all 0.2s",
              fontFamily: "var(--font-museo), sans-serif",
            }}
          >
            <IconLogout size={20} />
            Sair
          </a>
        </div>
      </div>
    </>
  );
}

function SidebarItem({ label, Icon }: { label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "14px",
        padding: "12px 16px", borderRadius: "4px",
        fontSize: "14px",
        color: hover ? "#c8e6c9" : "#81c784",
        textDecoration: "none",
        background: hover ? "rgba(0,122,81,0.1)" : "transparent",
        transition: "all 0.2s",
        fontFamily: "var(--font-museo), sans-serif",
      }}
    >
      <Icon size={18} color={hover ? "#00e87a" : "#007A51"} />
      {label}
    </a>
  );
}