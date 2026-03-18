"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useSystemContext } from "@/contexts/SystemContext";
import { Ficha } from "@/types/systems";

const MAX = 20;

const IconUser = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#007A51" strokeWidth="1.2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconTrash = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const SYSTEM_LABELS: Record<string, string> = {
  "som-das-seis": "Som das Seis",
};

function FichaCard({
  ficha,
  onClick,
  onDelete,
}: {
  ficha: Ficha;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const [hover, setHover] = useState(false);
  const [hoverDelete, setHoverDelete] = useState(false);

  return (
    <div
      style={{ width: "180px", position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setHoverDelete(false); }}
    >
      <button
        onClick={onClick}
        style={{
          width: "100%", height: "220px",
          background: hover ? "rgba(0,122,81,0.1)" : "rgba(0,20,10,0.7)",
          border: `2px solid ${hover ? "#007A51" : "rgba(0,122,81,0.45)"}`,
          borderRadius: "4px", cursor: "pointer",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end",
          padding: "0 0 16px 0",
          transition: "all 0.2s ease",
          boxShadow: hover ? "0 0 22px rgba(0,122,81,0.2)" : "none",
          textAlign: "center",
          fontFamily: "var(--font-museo), sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Área do avatar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "140px",
          background: "rgba(0,122,81,0.06)",
          borderBottom: "1px solid rgba(0,122,81,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: "6px",
        }}>
          <IconUser size={48} />
          <span style={{
            fontSize: "8px", fontWeight: 700,
            color: "#007A51", letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            {SYSTEM_LABELS[ficha.systemId] || ficha.systemId}
          </span>
        </div>

        {/* Nome e jogador */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#c8e6c9" }}>{ficha.characterName}</div>
          <div style={{ fontSize: "10px", color: "#4a7a5a" }}>{ficha.playerName}</div>
        </div>
      </button>

      {/* Botão deletar */}
      {hover && (
        <button
          onClick={onDelete}
          onMouseEnter={() => setHoverDelete(true)}
          onMouseLeave={() => setHoverDelete(false)}
          title="Excluir ficha"
          style={{
            position: "absolute", top: "8px", right: "8px",
            width: 26, height: 26,
            background: hoverDelete ? "rgba(180,40,40,0.3)" : "rgba(0,0,0,0.5)",
            border: `1px solid ${hoverDelete ? "rgba(239,154,154,0.5)" : "rgba(0,122,81,0.3)"}`,
            borderRadius: "3px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: hoverDelete ? "#ef9a9a" : "#4a7a5a",
            transition: "all 0.15s",
            zIndex: 2,
          }}
        >
          <IconTrash />
        </button>
      )}
    </div>
  );
}

function NovaFichaButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <>
      <style>{`@keyframes scanline { 0% { top: -30%; } 100% { top: 110%; } }`}</style>
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "180px", height: "220px",
          background: hover
            ? "linear-gradient(160deg, rgba(0,122,81,0.18) 0%, rgba(0,40,20,0.6) 100%)"
            : "linear-gradient(160deg, rgba(0,122,81,0.06) 0%, rgba(0,10,5,0.8) 100%)",
          border: `2px solid ${hover ? "#007A51" : "rgba(0,122,81,0.3)"}`,
          borderRadius: "4px", cursor: "pointer",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "14px",
          transition: "all 0.25s ease",
          boxShadow: hover
            ? "0 0 28px rgba(0,122,81,0.25), inset 0 0 20px rgba(0,122,81,0.06)"
            : "inset 0 0 12px rgba(0,0,0,0.4)",
          fontFamily: "var(--font-museo), sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        {hover && (
          <div style={{
            position: "absolute", left: 0, right: 0, height: "30%",
            background: "linear-gradient(180deg, transparent, rgba(0,122,81,0.07), transparent)",
            animation: "scanline 1.4s linear infinite", pointerEvents: "none",
          }} />
        )}
        {/* Cantos */}
        {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
          <div key={`${v}${h}`} style={{
            position: "absolute", [v]: 8, [h]: 8, width: 16, height: 16,
            borderTop:    v === "top"    ? `1.5px solid ${hover ? "#007A51" : "rgba(0,122,81,0.3)"}` : "none",
            borderBottom: v === "bottom" ? `1.5px solid ${hover ? "#007A51" : "rgba(0,122,81,0.3)"}` : "none",
            borderLeft:   h === "left"   ? `1.5px solid ${hover ? "#007A51" : "rgba(0,122,81,0.3)"}` : "none",
            borderRight:  h === "right"  ? `1.5px solid ${hover ? "#007A51" : "rgba(0,122,81,0.3)"}` : "none",
            transition: "border-color 0.25s",
          }} />
        ))}

        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          border: `1.5px solid ${hover ? "#007A51" : "rgba(0,122,81,0.25)"}`,
          background: hover ? "rgba(0,122,81,0.12)" : "rgba(0,122,81,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s", boxShadow: hover ? "0 0 16px rgba(0,122,81,0.25)" : "none",
          position: "relative", zIndex: 1,
        }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
            stroke={hover ? "#81c784" : "rgba(0,122,81,0.5)"}
            strokeWidth="1.8" strokeLinecap="round" style={{ transition: "stroke 0.25s" }}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <span style={{
          position: "relative", zIndex: 1,
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          color: hover ? "#81c784" : "rgba(0,122,81,0.45)", transition: "color 0.25s",
        }}>
          Nova Ficha
        </span>
      </button>
    </>
  );
}

export default function FichasPage() {
  const router = useRouter();
  const { fichas, deleteFicha } = useSystemContext();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Tem certeza que quer excluir esta ficha?")) {
      deleteFicha(id);
    }
  };

  const handleOpen = (ficha: Ficha) => {
    router.push(`/fichas/${ficha.id}`);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#c8e6c9",
      fontFamily: "var(--font-museo), sans-serif",
      overflowX: "hidden", position: "relative",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `radial-gradient(ellipse at 15% 40%, rgba(0,122,81,0.05) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 70%, rgba(0,122,81,0.03) 0%, transparent 50%)`,
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", top: "68px", left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/fundo.jpg')", backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.04, pointerEvents: "none", zIndex: 0,
      }} />

      <Header />

      <main style={{ flex: 1, position: "relative", zIndex: 1, padding: "48px 60px 80px" }}>
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "11px", color: "#007A51", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
            — Minhas Fichas
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "20px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#e8f5e9", letterSpacing: "-0.01em" }}>Fichas</h1>
            <span style={{
              fontSize: "12px",
              color: fichas.length >= MAX ? "#ef9a9a" : "#007A51",
              border: `1px solid ${fichas.length >= MAX ? "rgba(239,154,154,0.3)" : "rgba(0,122,81,0.3)"}`,
              borderRadius: "20px", padding: "2px 10px", letterSpacing: "0.06em", fontWeight: 600,
            }}>
              {fichas.length}/{MAX}
            </span>
          </div>
          <div style={{ marginTop: "16px", height: "1px", background: "rgba(0,122,81,0.2)" }} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start" }}>
          {fichas.length < MAX && (
            <NovaFichaButton onClick={() => router.push("/fichas/nova")} />
          )}
          {fichas.map((f) => (
            <FichaCard
              key={f.id}
              ficha={f}
              onClick={() => handleOpen(f)}
              onDelete={(e) => handleDelete(e, f.id)}
            />
          ))}
        </div>

        {fichas.length === 0 && (
          <div style={{ marginTop: "20px", fontSize: "13px", color: "#2d4a35", fontStyle: "italic" }}>
            Nenhuma ficha criada ainda. Clique em "Nova Ficha" para começar.
          </div>
        )}

        {fichas.length >= MAX && (
          <div style={{
            marginTop: "32px", padding: "14px 20px",
            background: "rgba(180,40,40,0.06)", border: "1px solid rgba(239,154,154,0.15)",
            borderRadius: "3px", fontSize: "13px", color: "#ef9a9a",
            display: "inline-flex", alignItems: "center", gap: "10px",
          }}>
            <span>⚠</span> Você atingiu o limite máximo de {MAX} fichas.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}