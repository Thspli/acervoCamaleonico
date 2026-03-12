"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";

// ——— Passos da criação ———
const STEPS = [
  { id: 1, label: "Sistema"    },
  { id: 2, label: "Personagem" },
  { id: 3, label: "Atributos"  },
  { id: 4, label: "Revisão"    },
];

// ——— Sistemas disponíveis ———
const SYSTEMS = [
  {
    id: "som-das-seis",
    name: "Som das Seis",
    cover: "/somdaseis.jpg",
    description: "Um sistema original de aventuras épicas em um mundo de magia e música.",
    tag: "",
  },
  // mais sistemas virão aqui
];

// ——— Componente: Linha de Passos ———
function StepBar({ current }: { current: number }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0",
      padding: "28px 0 36px",
      position: "relative",
    }}>
      {STEPS.map((step, i) => {
        const done    = step.id < current;
        const active  = step.id === current;
        const pending = step.id > current;

        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            {/* Linha conectora à esquerda */}
            {i > 0 && (
              <div style={{
                width: "80px", height: "1px",
                background: done || active
                  ? "linear-gradient(90deg, #007A51, rgba(0,122,81,0.4))"
                  : "rgba(0,122,81,0.15)",
                transition: "background 0.4s",
              }} />
            )}

            {/* Nó do passo */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: "50%",
                border: `2px solid ${active ? "#007A51" : done ? "#007A51" : "rgba(0,122,81,0.2)"}`,
                background: active
                  ? "rgba(0,122,81,0.15)"
                  : done
                  ? "#007A51"
                  : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
                boxShadow: active ? "0 0 14px rgba(0,122,81,0.4)" : "none",
              }}>
                {done ? (
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{
                    fontSize: "12px", fontWeight: 700,
                    color: active ? "#81c784" : "rgba(0,122,81,0.35)",
                    letterSpacing: "0",
                    fontFamily: "var(--font-museo), sans-serif",
                  }}>
                    {step.id}
                  </span>
                )}
              </div>

              <span style={{
                fontSize: "10px",
                fontWeight: active ? 700 : 400,
                color: active ? "#81c784" : done ? "#007A51" : "rgba(0,122,81,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "var(--font-museo), sans-serif",
                transition: "color 0.3s",
              }}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ——— Card de Sistema ———
function SystemCard({
  system,
  selected,
  onSelect,
}: {
  system: typeof SYSTEMS[0];
  selected: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  const active = selected || hover;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "220px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontFamily: "var(--font-museo), sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0",
      }}
    >
      {/* Capa */}
      <div style={{
        width: "220px",
        height: "310px",
        borderRadius: "4px",
        overflow: "hidden",
        border: `2px solid ${selected ? "#007A51" : hover ? "rgba(0,122,81,0.6)" : "rgba(0,122,81,0.2)"}`,
        boxShadow: selected
          ? "0 0 32px rgba(0,122,81,0.45), 0 8px 40px rgba(0,0,0,0.6)"
          : hover
          ? "0 0 20px rgba(0,122,81,0.2), 0 8px 32px rgba(0,0,0,0.5)"
          : "0 4px 20px rgba(0,0,0,0.4)",
        transition: "all 0.25s ease",
        position: "relative",
        background: "#060e08",
      }}>
        <img
          src={system.cover}
          alt={system.name}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            filter: active ? "brightness(1.05)" : "brightness(0.85)",
            transition: "filter 0.25s ease",
          }}
        />

        {system.tag && (
          <div style={{
            position: "absolute", top: "10px", left: "10px",
            padding: "3px 8px",
            background: "rgba(0,0,0,0.65)",
            border: "1px solid rgba(0,122,81,0.4)",
            borderRadius: "2px",
            fontSize: "9px", color: "#007A51",
            letterSpacing: "0.12em", textTransform: "uppercase",
            fontWeight: 700,
            backdropFilter: "blur(4px)",
          }}>
            {system.tag}
          </div>
        )}

        {/* Overlay de selecionado */}
        {selected && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,122,81,0.08)",
            display: "flex", alignItems: "flex-end",
            padding: "12px",
          }}>
            <div style={{
              width: "100%", padding: "6px",
              background: "rgba(0,122,81,0.85)",
              borderRadius: "2px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#0a0a0a", letterSpacing: "0.1em" }}>
                SELECIONADO
              </span>
            </div>
          </div>
        )}

        {/* Cantos decorativos quando hover/selected */}
        {active && (
          <>
            <div style={{ position: "absolute", top: 6, left: 6, width: 14, height: 14, borderTop: "2px solid #007A51", borderLeft: "2px solid #007A51" }} />
            <div style={{ position: "absolute", top: 6, right: 6, width: 14, height: 14, borderTop: "2px solid #007A51", borderRight: "2px solid #007A51" }} />
            <div style={{ position: "absolute", bottom: 6, left: 6, width: 14, height: 14, borderBottom: "2px solid #007A51", borderLeft: "2px solid #007A51" }} />
            <div style={{ position: "absolute", bottom: 6, right: 6, width: 14, height: 14, borderBottom: "2px solid #007A51", borderRight: "2px solid #007A51" }} />
          </>
        )}
      </div>

      {/* Info abaixo da capa */}
      <div style={{ padding: "14px 4px 0", textAlign: "center" }}>
        <div style={{
          fontSize: "14px", fontWeight: 700,
          color: selected ? "#e8f5e9" : hover ? "#c8e6c9" : "#81c784",
          letterSpacing: "0.02em",
          transition: "color 0.2s",
          marginBottom: "4px",
        }}>
          {system.name}
        </div>
        <div style={{
          fontSize: "11px",
          color: "rgba(0,122,81,0.6)",
          lineHeight: 1.5,
          maxWidth: "200px",
        }}>
          {system.description}
        </div>
      </div>
    </button>
  );
}

// ——— Página ———
export default function NovaFichaPage() {
  const router = useRouter();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [hoverNext, setHoverNext] = useState(false);

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#c8e6c9",
      fontFamily: "var(--font-museo), sans-serif",
      overflowX: "hidden", position: "relative",
      display: "flex", flexDirection: "column",
    }}>
      {/* Fundo */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `radial-gradient(ellipse at 20% 30%, rgba(0,122,81,0.06) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, rgba(0,122,81,0.04) 0%, transparent 50%)`,
        pointerEvents: "none", zIndex: 0,
      }} />
      {selectedSystem && (
        <div style={{
          position: "fixed", inset: 0,
          backgroundImage: `url('/velhoseis.webp')`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.08, pointerEvents: "none", zIndex: 0,
          transition: "opacity 0.6s ease",
        }} />
      )}

      <Header />

      <main style={{ flex: 1, position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto", width: "100%", padding: "0 48px 80px" }}>

        {/* Linha de passos */}
        <StepBar current={1} />

        {/* Título do passo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", color: "#007A51", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "10px" }}>
            Passo 1 de {STEPS.length}
          </p>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#e8f5e9", letterSpacing: "-0.01em", marginBottom: "8px" }}>
            Escolha o Sistema
          </h2>
          <p style={{ fontSize: "14px", color: "#4a7a5a", lineHeight: 1.6 }}>
            Selecione o sistema de RPG da sua campanha para definir as regras da ficha.
          </p>
        </div>

        {/* Grid de sistemas */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          justifyContent: "center",
          marginBottom: "60px",
        }}>
          {SYSTEMS.map((s) => (
            <SystemCard
              key={s.id}
              system={s}
              selected={selectedSystem === s.id}
              onSelect={() => setSelectedSystem(s.id)}
            />
          ))}

          {/* Placeholder "Em breve" */}
          {[1, 2].map((i) => (
            <div key={i} style={{
              width: "220px", height: "310px",
              borderRadius: "4px",
              border: "1px dashed rgba(0,122,81,0.15)",
              background: "rgba(0,10,5,0.4)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "10px",
            }}>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="rgba(0,122,81,0.2)" strokeWidth="1.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: "10px", color: "rgba(0,122,81,0.25)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Em breve
              </span>
            </div>
          ))}
        </div>

        {/* Navegação */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid rgba(0,122,81,0.15)",
          paddingTop: "28px",
        }}>
          <button
            onClick={() => router.push("/fichas")}
            style={{
              background: "none", border: "1px solid rgba(0,122,81,0.25)",
              color: "#4a7a5a", padding: "10px 22px", borderRadius: "3px",
              cursor: "pointer", fontSize: "13px",
              fontFamily: "var(--font-museo), sans-serif",
              display: "flex", alignItems: "center", gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#007A51"; e.currentTarget.style.color = "#81c784"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,122,81,0.25)"; e.currentTarget.style.color = "#4a7a5a"; }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>

          <button
            disabled={!selectedSystem}
            onMouseEnter={() => setHoverNext(true)}
            onMouseLeave={() => setHoverNext(false)}
            onClick={() => selectedSystem && router.push(`/fichas/nova/personagem?sistema=${selectedSystem}`)}
            style={{
              padding: "11px 32px",
              background: selectedSystem
                ? hoverNext ? "#00955f" : "#007A51"
                : "rgba(0,122,81,0.12)",
              border: "none",
              color: selectedSystem ? "#e8f5e9" : "#2d4a35",
              borderRadius: "3px",
              cursor: selectedSystem ? "pointer" : "not-allowed",
              fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "var(--font-museo), sans-serif",
              display: "flex", alignItems: "center", gap: "10px",
              transition: "all 0.2s",
              boxShadow: selectedSystem && hoverNext ? "0 0 20px rgba(0,122,81,0.3)" : "none",
            }}
          >
            Próximo
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}