'use client';

import React, { useState } from 'react';

// ─── Constantes de regras ─────────────────────────────────────────────────────
const TOTAL_POINTS = 4;       // pontos disponíveis para distribuir
const MAX_PER_ATTR = 2;       // máximo por atributo no nível 1
const MAX_SYSTEM   = 5;       // máximo absoluto do sistema (dots exibidos)

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface AttributeConfig {
  id: string;
  label: string;
  bonus: string;
  bonusShort: string;
  flavor: string;
  icon: React.ReactNode;
  accentColor: string;
  glowColor: string;
}

interface AttributesStepProps {
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

// ─── Configuração visual de cada atributo ────────────────────────────────────
const ATTRIBUTE_CONFIGS: AttributeConfig[] = [
  {
    id: "fisico",
    label: "Físico",
    bonus: "+1d6 de Vida",
    bonusShort: "por ponto",
    flavor: "Resistência, brutalidade e presença imponente nas ruas do Oeste.",
    accentColor: "#c0392b",
    glowColor: "rgba(192,57,43,0.35)",
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5a4 4 0 0 1 5.5 0l.5.5.5-.5a4 4 0 0 1 5.5 5.5l-6 6-6-6a4 4 0 0 1 0-5.5z" />
      </svg>
    ),
  },
  {
    id: "agilidade",
    label: "Agilidade",
    bonus: "+1 Ação",
    bonusShort: "por ponto",
    flavor: "Reflexos de pistoleiro, passos silenciosos e gatilho mais rápido.",
    accentColor: "#d4a017",
    glowColor: "rgba(212,160,23,0.35)",
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "intelecto",
    label: "Intelecto",
    bonus: "+1 Antecedente",
    bonusShort: "por ponto",
    flavor: "Estratégia, leitura de homens e conhecimento das terras selvagens.",
    accentColor: "#2980b9",
    glowColor: "rgba(41,128,185,0.35)",
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    id: "coragem",
    label: "Coragem",
    bonus: "+1 Iniciativa",
    bonusShort: "por ponto",
    flavor: "Sangue-frio diante da morte, vontade de ferro e lenda viva.",
    accentColor: "#8e44ad",
    glowColor: "rgba(142,68,173,0.35)",
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

// ─── Card de Atributo ─────────────────────────────────────────────────────────
function AttributeCard({
  config,
  value,
  onChange,
  spentTotal,
}: {
  config: AttributeConfig;
  value: number;
  onChange: (v: number) => void;
  spentTotal: number;
}) {
  const [hover, setHover] = useState(false);

  const pointsLeft  = TOTAL_POINTS - spentTotal;
  const canIncrease = value < MAX_PER_ATTR && pointsLeft > 0;
  const canDecrease = value > 0;
  // dots bloqueados acima do MAX_PER_ATTR (reservados para níveis superiores)
  const lockedAbove = MAX_SYSTEM - MAX_PER_ATTR; // = 3

  const decrement = () => { if (canDecrease) onChange(value - 1); };
  const increment = () => { if (canIncrease) onChange(value + 1); };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: hover
          ? `linear-gradient(135deg, rgba(0,10,5,0.95) 0%, ${config.accentColor}14 100%)`
          : "rgba(0,10,5,0.8)",
        border: `1px solid ${hover ? config.accentColor + "60" : "rgba(0,122,81,0.2)"}`,
        borderRadius: "6px",
        padding: "24px",
        transition: "all 0.3s ease",
        boxShadow: hover
          ? `0 0 28px ${config.glowColor}, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 ${config.accentColor}20`
          : "0 4px 16px rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cantos decorativos */}
      {["tl","tr","bl","br"].map((pos) => (
        <div key={pos} style={{
          position: "absolute",
          top:    pos.startsWith("t") ? 8 : "auto",
          bottom: pos.startsWith("b") ? 8 : "auto",
          left:   pos.endsWith("l")   ? 8 : "auto",
          right:  pos.endsWith("r")   ? 8 : "auto",
          width: 12, height: 12,
          borderTop:    pos.startsWith("t") ? `1.5px solid ${hover ? config.accentColor : "rgba(0,122,81,0.25)"}` : "none",
          borderBottom: pos.startsWith("b") ? `1.5px solid ${hover ? config.accentColor : "rgba(0,122,81,0.25)"}` : "none",
          borderLeft:   pos.endsWith("l")   ? `1.5px solid ${hover ? config.accentColor : "rgba(0,122,81,0.25)"}` : "none",
          borderRight:  pos.endsWith("r")   ? `1.5px solid ${hover ? config.accentColor : "rgba(0,122,81,0.25)"}` : "none",
          transition: "border-color 0.3s",
        }} />
      ))}

      {/* Glow de fundo */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: config.glowColor,
        filter: "blur(40px)",
        opacity: hover ? 0.6 : 0.2,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "4px", flexShrink: 0,
          background: hover ? `${config.accentColor}20` : "rgba(0,122,81,0.06)",
          border: `1px solid ${hover ? config.accentColor + "50" : "rgba(0,122,81,0.15)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: hover ? config.accentColor : "#4a7a5a",
          transition: "all 0.3s ease",
        }}>
          {config.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: "16px", fontWeight: 700,
            color: hover ? "#e8f5e9" : "#c8e6c9",
            letterSpacing: "0.02em",
            fontFamily: "var(--font-museo), sans-serif",
            marginBottom: "5px", transition: "color 0.2s",
          }}>
            {config.label}
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "3px 9px",
            background: hover ? `${config.accentColor}18` : "rgba(0,122,81,0.08)",
            border: `1px solid ${hover ? config.accentColor + "40" : "rgba(0,122,81,0.15)"}`,
            borderRadius: "20px", transition: "all 0.3s ease",
          }}>
            <span style={{
              fontSize: "11px", fontWeight: 700,
              color: hover ? config.accentColor : "#007A51",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-museo), sans-serif", transition: "color 0.3s",
            }}>
              {config.bonus}
            </span>
            <span style={{
              fontSize: "9px",
              color: hover ? config.accentColor + "90" : "rgba(0,122,81,0.5)",
              transition: "color 0.3s",
            }}>
              {config.bonusShort}
            </span>
          </div>
        </div>
      </div>

      {/* Flavor */}
      <p style={{
        fontSize: "11px", color: hover ? "#4a7a5a" : "#2d4a35",
        lineHeight: 1.6, letterSpacing: "0.02em", marginBottom: "0",
        fontFamily: "var(--font-museo), sans-serif", transition: "color 0.2s",
        minHeight: "34px",
      }}>
        {config.flavor}
      </p>

      {/* Dots — 5 total, primeiros 2 desbloqueados, últimos 3 bloqueados */}
      <div style={{ display: "flex", gap: "7px", marginBottom: "16px", alignItems: "center", marginTop: "auto" }}>
        {Array.from({ length: MAX_SYSTEM }).map((_, i) => {
          const filled  = i < value;
          const locked  = i >= MAX_PER_ATTR; // slots reservados para níveis maiores

          return (
            <React.Fragment key={i}>
              {/* Separador visual entre desbloqueados e bloqueados */}
              {i === MAX_PER_ATTR && (
                <div style={{
                  width: "1px", height: "18px",
                  background: "rgba(0,122,81,0.2)",
                  margin: "0 2px",
                }} />
              )}
              <div
                title={locked ? `Disponível a partir do nível ${i + 1}` : undefined}
                style={{
                  width: locked ? 14 : 18,
                  height: locked ? 14 : 18,
                  borderRadius: "50%",
                  border: locked
                    ? "1.5px dashed rgba(0,122,81,0.15)"
                    : `1.5px solid ${filled ? config.accentColor : "rgba(0,122,81,0.25)"}`,
                  background: filled
                    ? `radial-gradient(circle at 35% 35%, ${config.accentColor}ee, ${config.accentColor}88)`
                    : "transparent",
                  transition: "all 0.15s ease",
                  boxShadow: filled ? `0 0 6px ${config.glowColor}` : "none",
                  opacity: locked ? 0.35 : 1,
                  flexShrink: 0,
                  cursor: "default",
                }}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* Controles −/+ */}
      <div style={{
        display: "flex", alignItems: "center",
        borderTop: "1px solid rgba(0,122,81,0.1)", paddingTop: "16px",
      }}>
        <button
          onClick={decrement}
          disabled={!canDecrease}
          style={{
            width: 32, height: 32,
            background: canDecrease ? "rgba(0,122,81,0.08)" : "transparent",
            border: `1px solid ${canDecrease ? "rgba(0,122,81,0.25)" : "rgba(0,122,81,0.08)"}`,
            borderRadius: "3px 0 0 3px",
            color: canDecrease ? "#81c784" : "#1e3328",
            cursor: canDecrease ? "pointer" : "not-allowed",
            fontSize: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s", fontFamily: "monospace",
          }}
          onMouseEnter={(e) => { if (canDecrease) e.currentTarget.style.background = "rgba(0,122,81,0.15)"; }}
          onMouseLeave={(e) => { if (canDecrease) e.currentTarget.style.background = "rgba(0,122,81,0.08)"; }}
        >
          −
        </button>

        <div style={{
          flex: 1, height: 32,
          background: "rgba(0,15,8,0.9)",
          border: "1px solid rgba(0,122,81,0.18)",
          borderLeft: "none", borderRight: "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
        }}>
          <span style={{
            fontSize: "18px", fontWeight: 700,
            color: value > 0 ? config.accentColor : "#2d4a35",
            fontFamily: "var(--font-museo), sans-serif",
            transition: "color 0.2s", minWidth: "20px", textAlign: "center",
          }}>
            {value}
          </span>
          <span style={{ fontSize: "9px", color: "#2d4a35" }}>/ {MAX_PER_ATTR}</span>
        </div>

        <button
          onClick={increment}
          disabled={!canIncrease}
          style={{
            width: 32, height: 32,
            background: canIncrease ? `${config.accentColor}18` : "transparent",
            border: `1px solid ${canIncrease ? config.accentColor + "40" : "rgba(0,122,81,0.08)"}`,
            borderRadius: "0 3px 3px 0",
            color: canIncrease ? config.accentColor : "#1e3328",
            cursor: canIncrease ? "pointer" : "not-allowed",
            fontSize: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s", fontFamily: "monospace",
          }}
          onMouseEnter={(e) => { if (canIncrease) e.currentTarget.style.background = `${config.accentColor}30`; }}
          onMouseLeave={(e) => { if (canIncrease) e.currentTarget.style.background = `${config.accentColor}18`; }}
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── Painel de Resumo ─────────────────────────────────────────────────────────
function AttributeSummary({ values }: { values: Record<string, number> }) {
  const spent     = Object.values(values).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_POINTS - spent;
  const pct       = (spent / TOTAL_POINTS) * 100;

  return (
    <div style={{
      background: "rgba(0,10,5,0.7)",
      border: "1px solid rgba(0,122,81,0.2)",
      borderRadius: "6px", padding: "20px",
      backdropFilter: "blur(8px)",
      display: "flex", flexDirection: "column", gap: "12px",
    }}>
      {/* Título */}
      <div style={{
        fontSize: "9px", fontWeight: 700, color: "#007A51",
        letterSpacing: "0.18em", textTransform: "uppercase",
        fontFamily: "var(--font-museo), sans-serif",
        paddingBottom: "10px", borderBottom: "1px solid rgba(0,122,81,0.12)",
      }}>
        Pontos
      </div>

      {/* Barra de progresso */}
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: "6px",
        }}>
          <span style={{ fontSize: "10px", color: "#4a7a5a", fontFamily: "var(--font-museo), sans-serif" }}>
            Usados
          </span>
          <span style={{
            fontSize: "12px", fontWeight: 700,
            color: remaining === 0 ? "#81c784" : "#c8e6c9",
            fontFamily: "var(--font-museo), sans-serif",
          }}>
            {spent} / {TOTAL_POINTS}
          </span>
        </div>
        <div style={{
          height: "4px", borderRadius: "2px",
          background: "rgba(0,122,81,0.15)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "2px",
            background: remaining === 0
              ? "linear-gradient(90deg, #007A51, #81c784)"
              : "linear-gradient(90deg, #007A51, #4a7a5a)",
            transition: "width 0.3s ease",
          }} />
        </div>
        <div style={{
          marginTop: "6px", textAlign: "center",
          fontSize: "11px", fontWeight: 700,
          color: remaining > 0 ? "#4a7a5a" : "#81c784",
          fontFamily: "var(--font-museo), sans-serif",
          transition: "color 0.2s",
        }}>
          {remaining > 0 ? `${remaining} restante${remaining > 1 ? "s" : ""}` : "✓ Distribuído"}
        </div>
      </div>

      {/* Lista de atributos */}
      <div style={{ borderTop: "1px solid rgba(0,122,81,0.1)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {ATTRIBUTE_CONFIGS.map((config) => {
          const val = values[config.id] ?? 0;
          return (
            <div key={config.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: val > 0 ? config.accentColor : "rgba(0,122,81,0.2)",
                  boxShadow: val > 0 ? `0 0 5px ${config.accentColor}` : "none",
                  transition: "all 0.2s",
                }} />
                <span style={{
                  fontSize: "11px", fontFamily: "var(--font-museo), sans-serif",
                  color: val > 0 ? "#81c784" : "#2d4a35", transition: "color 0.2s",
                }}>
                  {config.label}
                </span>
              </div>
              {/* Mini dots */}
              <div style={{ display: "flex", gap: "3px" }}>
                {Array.from({ length: MAX_PER_ATTR }).map((_, i) => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    border: `1px solid ${i < val ? config.accentColor : "rgba(0,122,81,0.15)"}`,
                    background: i < val
                      ? `radial-gradient(circle, ${config.accentColor}, ${config.accentColor}88)`
                      : "transparent",
                    transition: "all 0.15s",
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Regra de nível */}
      <div style={{
        marginTop: "2px", padding: "8px 10px",
        background: "rgba(0,122,81,0.05)",
        border: "1px solid rgba(0,122,81,0.1)",
        borderRadius: "3px",
      }}>
        <p style={{
          fontSize: "9px", color: "#2d4a35", lineHeight: 1.5,
          letterSpacing: "0.04em", fontFamily: "var(--font-museo), sans-serif",
          margin: 0,
        }}>
          Máx. <strong style={{ color: "#4a7a5a" }}>{MAX_PER_ATTR}</strong> por atributo no nível 1.
          Limite do sistema: <strong style={{ color: "#4a7a5a" }}>{MAX_SYSTEM}</strong>.
        </p>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function AttributesStep({ values, onChange }: AttributesStepProps) {
  const spent = Object.values(values).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
      {/* Grid 2x2 */}
      <div style={{
        flex: 1,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px",
      }}>
        {ATTRIBUTE_CONFIGS.map((config) => (
          <AttributeCard
            key={config.id}
            config={config}
            value={values[config.id] ?? 0}
            onChange={(v) => onChange(config.id, v)}
            spentTotal={spent}
          />
        ))}
      </div>

      {/* Resumo lateral sticky */}
      <div style={{ width: "168px", flexShrink: 0, position: "sticky", top: "88px" }}>
        <AttributeSummary values={values} />
      </div>
    </div>
  );
}