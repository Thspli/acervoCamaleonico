'use client';

import React from 'react';

const TOTAL_POINTS = 4;
const MAX_PER_ATTR = 2;
const MAX_SYSTEM   = 5;

interface AttrConfig {
  id: string;
  label: string;
  bonus: string;
  description: string;
  color: string;
  glow: string;
  icon: React.ReactNode;
}

const ATTRS: AttrConfig[] = [
  {
    id: "fisico",
    label: "Físico",
    bonus: "+1d6 de Vida",
    description: "Resistência, força bruta e presença intimidadora.",
    color: "#c0392b",
    glow: "rgba(192,57,43,0.3)",
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6.5 6.5a4 4 0 0 1 5.5 0l.5.5.5-.5a4 4 0 0 1 5.5 5.5l-6 6-6-6a4 4 0 0 1 0-5.5z" />
      </svg>
    ),
  },
  {
    id: "agilidade",
    label: "Agilidade",
    bonus: "+1 Ação",
    description: "Reflexos de pistoleiro e gatilho mais rápido.",
    color: "#d4a017",
    glow: "rgba(212,160,23,0.3)",
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "intelecto",
    label: "Intelecto",
    bonus: "+1 Antecedente",
    description: "Estratégia, leitura de homens e conhecimento.",
    color: "#2980b9",
    glow: "rgba(41,128,185,0.3)",
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    id: "coragem",
    label: "Coragem",
    bonus: "+1 Iniciativa",
    description: "Sangue-frio diante da morte e vontade de ferro.",
    color: "#8e44ad",
    glow: "rgba(142,68,173,0.3)",
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

// ─── Dots de progresso ────────────────────────────────────────────────────────
function Dots({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {Array.from({ length: MAX_SYSTEM }).map((_, i) => {
        const filled = i < value;
        const locked = i >= MAX_PER_ATTR;
        return (
          <React.Fragment key={i}>
            {i === MAX_PER_ATTR && (
              <div style={{ width: 1, height: 10, background: "rgba(0,122,81,0.15)", margin: "0 1px" }} />
            )}
            <div style={{
              width:  locked ? 8 : 11,
              height: locked ? 8 : 11,
              borderRadius: "50%",
              border: locked
                ? "1px dashed rgba(0,122,81,0.12)"
                : `1.5px solid ${filled ? color : "rgba(0,122,81,0.2)"}`,
              background: filled
                ? `radial-gradient(circle at 35% 35%, ${color}ee, ${color}77)`
                : "transparent",
              boxShadow: filled && !locked ? `0 0 5px ${color}66` : "none",
              opacity: locked ? 0.3 : 1,
              flexShrink: 0,
              transition: "all 0.15s",
            }} />
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Card de atributo ─────────────────────────────────────────────────────────
function AttrCard({
  cfg,
  value,
  onIncrement,
  onDecrement,
  canIncrease,
}: {
  cfg: AttrConfig;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canIncrease: boolean;
}) {
  const atMax = value >= MAX_PER_ATTR;
  const atMin = value <= 0;

  return (
    <div style={{
      background: value > 0
        ? `linear-gradient(135deg, rgba(0,10,5,0.9) 0%, ${cfg.color}0d 100%)`
        : "rgba(0,10,5,0.7)",
      border: `1px solid ${value > 0 ? cfg.color + "35" : "rgba(0,122,81,0.15)"}`,
      borderRadius: "8px",
      overflow: "hidden",
      transition: "all 0.25s ease",
      boxShadow: value > 0 ? `0 0 20px ${cfg.glow}` : "none",
    }}>
      {/* Linha colorida no topo */}
      <div style={{
        height: "2px",
        background: value > 0
          ? `linear-gradient(90deg, ${cfg.color}, ${cfg.color}44)`
          : "rgba(0,122,81,0.08)",
        transition: "background 0.3s",
      }} />

      <div style={{ padding: "20px" }}>
        {/* Header: ícone + nome + bonus */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "6px", flexShrink: 0,
            background: value > 0 ? `${cfg.color}18` : "rgba(0,122,81,0.06)",
            border: `1px solid ${value > 0 ? cfg.color + "40" : "rgba(0,122,81,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: value > 0 ? cfg.color : "#2d4a35",
            transition: "all 0.25s",
          }}>
            {cfg.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "13px", fontWeight: 700,
              color: value > 0 ? "#e8f5e9" : "#81c784",
              fontFamily: "var(--font-museo), sans-serif",
              marginBottom: "3px",
              transition: "color 0.2s",
            }}>
              {cfg.label}
            </div>
            <div style={{
              fontSize: "9px", fontWeight: 700,
              color: value > 0 ? cfg.color : "rgba(0,122,81,0.3)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "var(--font-museo), sans-serif",
              transition: "color 0.25s",
            }}>
              {cfg.bonus}
            </div>
          </div>
        </div>

        {/* Descrição */}
        <p style={{
          fontSize: "11px",
          color: value > 0 ? "#4a7a5a" : "#1e3328",
          lineHeight: 1.6,
          marginBottom: "16px",
          fontFamily: "var(--font-museo), sans-serif",
          transition: "color 0.2s",
        }}>
          {cfg.description}
        </p>

        {/* Dots */}
        <div style={{ marginBottom: "16px" }}>
          <Dots value={value} color={cfg.color} />
        </div>

        {/* Controles */}
        <div style={{
          display: "flex", alignItems: "center",
          borderTop: "1px solid rgba(0,122,81,0.08)",
          paddingTop: "14px", gap: "10px",
        }}>
          <button
            onClick={onDecrement}
            disabled={atMin}
            style={{
              width: 32, height: 32,
              border: `1px solid ${atMin ? "rgba(0,122,81,0.08)" : "rgba(0,122,81,0.22)"}`,
              borderRadius: "4px",
              background: "transparent",
              color: atMin ? "#1e3328" : "#81c784",
              cursor: atMin ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", lineHeight: 1,
              transition: "all 0.15s",
              fontFamily: "monospace",
            }}
            onMouseEnter={e => { if (!atMin) e.currentTarget.style.background = "rgba(0,122,81,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            −
          </button>

          {/* Valor numérico */}
          <div style={{
            flex: 1,
            height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <span style={{
              fontSize: "22px", fontWeight: 700,
              color: value > 0 ? cfg.color : "#2d4a35",
              fontFamily: "var(--font-museo), sans-serif",
              transition: "color 0.2s",
              lineHeight: 1,
            }}>
              {value}
            </span>
            <span style={{
              fontSize: "9px", color: "rgba(0,122,81,0.25)",
              position: "absolute", right: 0, bottom: 2,
              fontFamily: "var(--font-museo), sans-serif",
            }}>
              /{MAX_PER_ATTR}
            </span>
          </div>

          <button
            onClick={onIncrement}
            disabled={!canIncrease || atMax}
            style={{
              width: 32, height: 32,
              border: `1px solid ${!canIncrease || atMax ? "rgba(0,122,81,0.08)" : cfg.color + "50"}`,
              borderRadius: "4px",
              background: !canIncrease || atMax ? "transparent" : `${cfg.color}12`,
              color: !canIncrease || atMax ? "#1e3328" : cfg.color,
              cursor: !canIncrease || atMax ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", lineHeight: 1,
              transition: "all 0.15s",
              fontFamily: "monospace",
            }}
            onMouseEnter={e => { if (canIncrease && !atMax) e.currentTarget.style.background = `${cfg.color}25`; }}
            onMouseLeave={e => { if (canIncrease && !atMax) e.currentTarget.style.background = `${cfg.color}12`; }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Painel lateral de resumo ─────────────────────────────────────────────────
function Summary({ values }: { values: Record<string, number> }) {
  const spent     = Object.values(values).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_POINTS - spent;
  const pct       = Math.min((spent / TOTAL_POINTS) * 100, 100);
  const done      = remaining === 0;

  return (
    <div style={{
      background: "rgba(0,10,5,0.75)",
      border: "1px solid rgba(0,122,81,0.18)",
      borderRadius: "8px",
      padding: "20px",
      backdropFilter: "blur(8px)",
      position: "sticky",
      top: "88px",
    }}>
      {/* Título */}
      <div style={{
        fontSize: "9px", fontWeight: 700, color: "#007A51",
        letterSpacing: "0.2em", textTransform: "uppercase",
        fontFamily: "var(--font-museo), sans-serif",
        paddingBottom: "14px",
        borderBottom: "1px solid rgba(0,122,81,0.1)",
        marginBottom: "16px",
      }}>
        Pontos
      </div>

      {/* Contador grande */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{
          fontSize: "42px", fontWeight: 700, lineHeight: 1,
          color: done ? "#81c784" : "#e8f5e9",
          fontFamily: "var(--font-museo), sans-serif",
          transition: "color 0.3s",
        }}>
          {remaining}
        </div>
        <div style={{
          fontSize: "9px", color: "#4a7a5a",
          letterSpacing: "0.1em", textTransform: "uppercase",
          fontFamily: "var(--font-museo), sans-serif",
          marginTop: "4px",
        }}>
          {done ? "distribuído" : `restante${remaining > 1 ? "s" : ""}`}
        </div>
      </div>

      {/* Barra de progresso */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{
          height: "3px", borderRadius: "2px",
          background: "rgba(0,122,81,0.12)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            borderRadius: "2px",
            background: done
              ? "linear-gradient(90deg, #007A51, #81c784)"
              : "linear-gradient(90deg, #007A51, #4a7a5a)",
            transition: "width 0.3s ease",
          }} />
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: "5px",
          fontSize: "9px", color: "#2d4a35",
          fontFamily: "var(--font-museo), sans-serif",
        }}>
          <span>0</span>
          <span>{TOTAL_POINTS}</span>
        </div>
      </div>

      {/* Lista de atributos */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {ATTRS.map(cfg => {
          const val = values[cfg.id] ?? 0;
          return (
            <div key={cfg.id} style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: "8px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: val > 0 ? cfg.color : "rgba(0,122,81,0.15)",
                  boxShadow: val > 0 ? `0 0 5px ${cfg.color}` : "none",
                  transition: "all 0.2s", flexShrink: 0,
                }} />
                <span style={{
                  fontSize: "11px",
                  color: val > 0 ? "#81c784" : "#2d4a35",
                  fontFamily: "var(--font-museo), sans-serif",
                  transition: "color 0.2s",
                }}>
                  {cfg.label}
                </span>
              </div>
              {/* Mini dots */}
              <div style={{ display: "flex", gap: "3px" }}>
                {Array.from({ length: MAX_PER_ATTR }).map((_, i) => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    border: `1px solid ${i < val ? cfg.color : "rgba(0,122,81,0.12)"}`,
                    background: i < val
                      ? `radial-gradient(circle, ${cfg.color}, ${cfg.color}88)`
                      : "transparent",
                    transition: "all 0.15s",
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Regra */}
      <div style={{
        padding: "10px 12px",
        background: "rgba(0,122,81,0.04)",
        border: "1px solid rgba(0,122,81,0.1)",
        borderRadius: "4px",
      }}>
        <p style={{
          fontSize: "9px", color: "#2d4a35", lineHeight: 1.6,
          fontFamily: "var(--font-museo), sans-serif", margin: 0,
        }}>
          Máx. <strong style={{ color: "#4a7a5a" }}>{MAX_PER_ATTR}</strong> por atributo no nível 1.<br />
          Os {TOTAL_POINTS} pontos são <strong style={{ color: "#4a7a5a" }}>opcionais</strong> — você pode avançar sem distribuir.
        </p>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
interface AttributesStepProps {
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

export function AttributesStep({ values, onChange }: AttributesStepProps) {
  const spent = Object.values(values).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_POINTS - spent;

  return (
    <>
      <style>{`
        .attrs-outer{display:flex;gap:20px;align-items:flex-start}
        .attrs-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .attrs-panel{width:160px;flex-shrink:0}
        @media(max-width:640px){
          .attrs-outer{flex-direction:column!important}
          .attrs-panel{width:100%!important}
        }
        @media(max-width:440px){
          .attrs-grid{grid-template-columns:1fr!important}
        }
      `}</style>
      <div className="attrs-outer">
        <div className="attrs-grid">
          {ATTRS.map(cfg => (
            <AttrCard
              key={cfg.id}
              cfg={cfg}
              value={values[cfg.id] ?? 0}
              canIncrease={remaining > 0}
              onIncrement={() => onChange(cfg.id, (values[cfg.id] ?? 0) + 1)}
              onDecrement={() => onChange(cfg.id, (values[cfg.id] ?? 0) - 1)}
            />
          ))}
        </div>
        <div className="attrs-panel">
          <Summary values={values} />
        </div>
      </div>
    </>
  );
}