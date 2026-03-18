"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useSystemContext } from "@/contexts/SystemContext";
import { AVAILABLE_SYSTEMS } from "@/data/systems";
import { useState } from "react";

const SYSTEM_COVERS: Record<string, { cover: string; tagline: string; genre: string }> = {
  "som-das-seis": {
    cover: "/somdaseis.jpg",
    tagline: "Revólveres, duelos e justiça nas ruas poeirentas do Velho Oeste.",
    genre: "Western",
  },
};

const COMING_SOON = [
  { id: "cs-1", name: "Sistema 2" },
  { id: "cs-2", name: "Sistema 3" },
  { id: "cs-3", name: "Sistema 4" },
];

function AvailableSystemCard({
  system, selected, onClick,
}: {
  system: { id: string; name: string; description: string };
  selected: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const meta = SYSTEM_COVERS[system.id];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "220px", height: "320px", padding: 0,
        border: `2px solid ${selected ? "#007A51" : hover ? "rgba(0,122,81,0.6)" : "rgba(0,122,81,0.25)"}`,
        borderRadius: "6px", cursor: "pointer",
        position: "relative", overflow: "hidden",
        background: "#050f08",
        transition: "border-color 0.25s, box-shadow 0.25s, transform 0.2s",
        boxShadow: selected
          ? "0 0 40px rgba(0,122,81,0.5), 0 8px 32px rgba(0,0,0,0.6)"
          : hover
          ? "0 0 24px rgba(0,122,81,0.25), 0 8px 24px rgba(0,0,0,0.5)"
          : "0 4px 16px rgba(0,0,0,0.5)",
        transform: hover || selected ? "translateY(-4px)" : "none",
        flexShrink: 0, fontFamily: "var(--font-museo), sans-serif", textAlign: "left",
      }}
    >
      {/* Capa */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${meta?.cover}')`,
        backgroundSize: "cover", backgroundPosition: "center top",
        transition: "transform 0.4s ease",
        transform: hover ? "scale(1.04)" : "scale(1)",
      }} />

      {/* Gradiente inferior */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,8,4,0.78) 65%, rgba(0,8,4,0.97) 100%)",
      }} />

      {selected && <div style={{ position: "absolute", inset: 0, background: "rgba(0,122,81,0.1)", pointerEvents: "none" }} />}

      {/* Badge gênero */}
      <div style={{
        position: "absolute", top: 12, left: 12,
        padding: "3px 9px",
        background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,122,81,0.4)", borderRadius: "20px",
        fontSize: "8px", fontWeight: 700, color: "#007A51", letterSpacing: "0.14em",
        textTransform: "uppercase", backdropFilter: "blur(4px)",
      }}>
        {meta?.genre}
      </div>

      {/* Check seleção */}
      {selected && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          width: 24, height: 24, borderRadius: "50%",
          background: "#007A51", border: "2px solid #81c784",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 14px rgba(0,122,81,0.7)",
        }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {/* Cantos hover/selected */}
      {(hover || selected) && [["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
        <div key={`${v}${h}`} style={{
          position: "absolute", [v]: 8, [h]: 8, width: 12, height: 12,
          borderTop:    v === "top"    ? "1.5px solid rgba(0,200,100,0.5)" : "none",
          borderBottom: v === "bottom" ? "1.5px solid rgba(0,200,100,0.5)" : "none",
          borderLeft:   h === "left"   ? "1.5px solid rgba(0,200,100,0.5)" : "none",
          borderRight:  h === "right"  ? "1.5px solid rgba(0,200,100,0.5)" : "none",
          pointerEvents: "none",
        }} />
      ))}

      {/* Texto inferior */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px" }}>
        <div style={{ fontSize: "16px", fontWeight: 700, color: "#e8f5e9", letterSpacing: "0.01em", marginBottom: "6px", lineHeight: 1.2 }}>
          {system.name}
        </div>
        <div style={{ fontSize: "10px", color: "#4a7a5a", lineHeight: 1.5, opacity: hover || selected ? 1 : 0.7, transition: "opacity 0.2s" }}>
          {meta?.tagline}
        </div>
      </div>
    </button>
  );
}

function ComingSoonCard({ name }: { name: string }) {
  return (
    <div style={{
      width: "220px", height: "320px",
      border: "2px dashed rgba(0,122,81,0.12)", borderRadius: "6px",
      position: "relative", overflow: "hidden",
      background: "rgba(0,8,4,0.5)", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,122,81,0.02) 20px, rgba(0,122,81,0.02) 21px)",
      }} />
      <div style={{
        position: "absolute", top: 12, left: 12, padding: "3px 9px",
        background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,122,81,0.12)", borderRadius: "20px",
        fontSize: "8px", fontWeight: 700, color: "rgba(0,122,81,0.3)", letterSpacing: "0.14em", textTransform: "uppercase",
      }}>
        Em Breve
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1px dashed rgba(0,122,81,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="rgba(0,122,81,0.25)" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <span style={{ fontSize: "10px", color: "rgba(0,122,81,0.2)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-museo), sans-serif" }}>
          {name}
        </span>
      </div>
      {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
        <div key={`${v}${h}`} style={{
          position: "absolute", [v]: 8, [h]: 8, width: 10, height: 10,
          borderTop:    v === "top"    ? "1px solid rgba(0,122,81,0.1)" : "none",
          borderBottom: v === "bottom" ? "1px solid rgba(0,122,81,0.1)" : "none",
          borderLeft:   h === "left"   ? "1px solid rgba(0,122,81,0.1)" : "none",
          borderRight:  h === "right"  ? "1px solid rgba(0,122,81,0.1)" : "none",
        }} />
      ))}
    </div>
  );
}

const SYSTEM_BG: Record<string, string> = {
  "som-das-seis": "/velhoseis.webp",
};

export default function SelecionarSistemaPage() {
  const router = useRouter();
  const { setSelectedSystem } = useSystemContext();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedId) return;
    setSelectedSystem(selectedId);
    router.push(`/fichas/nova/personagem?sistema=${selectedId}`);
  };

  const activeBg = selectedId ? SYSTEM_BG[selectedId] : null;

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#c8e6c9",
      fontFamily: "var(--font-museo), sans-serif",
      overflowX: "hidden", position: "relative",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(0,122,81,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(0,122,81,0.04) 0%, transparent 50%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      {/* Fundo padrão — igual às outras páginas */}
      <div style={{
        position: "fixed", top: "68px", left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/fundo.jpg')",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: activeBg ? 0 : 0.04,
        transition: "opacity 0.6s ease",
        pointerEvents: "none", zIndex: 0,
      }} />
      {/* Fundo do sistema selecionado */}
      <div style={{
        position: "fixed", top: "68px", left: 0, right: 0, bottom: 0,
        backgroundImage: activeBg ? `url('${activeBg}')` : "none",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: activeBg ? 0.06 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: "none", zIndex: 0,
      }} />

      <Header />

      <main style={{ flex: 1, position: "relative", zIndex: 1, padding: "48px 60px 80px", display: "flex", flexDirection: "column" }}>

        {/* Voltar */}
        <button
          onClick={() => router.push("/fichas")}
          style={{
            background: "none", border: "none", color: "#4a7a5a", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "12px", fontFamily: "var(--font-museo), sans-serif",
            marginBottom: "40px", padding: 0, transition: "color 0.2s", alignSelf: "flex-start",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#81c784")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4a7a5a")}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Minhas Fichas
        </button>

        {/* Cabeçalho */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", color: "#007A51", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "10px" }}>
            — Nova Ficha
          </p>
          <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#e8f5e9", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            Selecione o Sistema
          </h1>
          <p style={{ fontSize: "13px", color: "#4a7a5a" }}>
            Escolha o universo da sua próxima aventura.
          </p>
          <div style={{ marginTop: "20px", height: "1px", background: "rgba(0,122,81,0.15)" }} />
        </div>

        {/* Grade de sistemas */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "48px" }}>
          {AVAILABLE_SYSTEMS.map((s) => (
            <AvailableSystemCard
              key={s.id}
              system={s}
              selected={selectedId === s.id}
              onClick={() => setSelectedId(s.id)}
            />
          ))}
          {COMING_SOON.map((s) => (
            <ComingSoonCard key={s.id} name={s.name} />
          ))}
        </div>

        {/* Rodapé */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(0,122,81,0.15)", paddingTop: "28px", marginTop: "auto",
        }}>
          <div style={{ fontSize: "13px", color: "#2d4a35", fontStyle: "italic" }}>
            {selectedId
              ? <span style={{ color: "#4a7a5a", fontStyle: "normal" }}>
                  <span style={{ color: "#81c784", fontWeight: 700 }}>
                    {AVAILABLE_SYSTEMS.find(s => s.id === selectedId)?.name}
                  </span>{" "}selecionado — clique em Continuar.
                </span>
              : "Nenhum sistema selecionado."}
          </div>

          <button
            disabled={!selectedId}
            onClick={handleContinue}
            style={{
              padding: "12px 36px",
              background: selectedId ? "#007A51" : "rgba(0,122,81,0.08)",
              border: `1px solid ${selectedId ? "#007A51" : "rgba(0,122,81,0.15)"}`,
              color: selectedId ? "#e8f5e9" : "#2d4a35",
              borderRadius: "3px", cursor: selectedId ? "pointer" : "not-allowed",
              fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              fontFamily: "var(--font-museo), sans-serif",
              display: "flex", alignItems: "center", gap: "10px", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { if (selectedId) e.currentTarget.style.background = "#00955f"; }}
            onMouseLeave={(e) => { if (selectedId) e.currentTarget.style.background = "#007A51"; }}
          >
            Continuar
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}