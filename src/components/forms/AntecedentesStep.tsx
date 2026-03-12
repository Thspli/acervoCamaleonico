'use client';

import React, { useState } from 'react';

// ─── Constantes ───────────────────────────────────────────────────────────────
const BASE_POINTS   = 4;
const MAX_PER_LEVEL = 2;   // máximo por antecedente no nível 1
const MAX_SYSTEM    = 5;   // máximo absoluto do sistema

// ─── Dados dos antecedentes ───────────────────────────────────────────────────
interface Antecedente {
  id: string;
  label: string;
  icon: React.ReactNode;
  summary: string;
  description: string;
  accentColor: string;
  glowColor: string;
}

const ANTECEDENTES: Antecedente[] = [
  {
    id: "combate",
    label: "Combate",
    accentColor: "#c0392b",
    glowColor: "rgba(192,57,43,0.3)",
    summary: "Tiroteios, socos e estratégia em batalha.",
    description: `Seja uma veterana da Guerra Civil, ou um errante solitário acompanhado apenas de seu revólver, você costuma se meter em pelejas e tiroteios. O motivo? Qualquer um. Alguém que te olhou torto e te chamou de bunda mole, ofendeu sua mula, trapaceou no carteado ou só tem uma fuça que você não gostou.

Viver pela violência é sua mácula mas é o único modo que você encontrou para sobreviver. Este Antecedente é o mais importante para atirar com suas armas, sair no soco e até ter noção de estratégias em batalhas maiores.

É recomendado ao menos um ponto neste Antecedente devido à temática e estilo do jogo, mas não é obrigatório.`,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2.5l7 7-7 7-7-7 7-7z" />
        <path d="M2 12l5 5" />
        <path d="M7 17l-5 5" />
      </svg>
    ),
  },
  {
    id: "labuta",
    label: "Labuta",
    accentColor: "#a0522d",
    glowColor: "rgba(160,82,45,0.3)",
    summary: "Resistência física, ofícios e trabalho pesado.",
    description: `O trabalho pesado deixou seu corpo resistente e calejado para aguentar longas horas debaixo do sol, no frio, na chuva, ou na escuridão das minas de carvão ou túneis ferroviários.

A labuta te deu o conhecimento para construir e consertar coisas, mas também é o Antecedente que determina suas aptidões físicas. É o que marca se sua personagem sabe nadar, correr, saltar mais longe ou realizar diversos outros feitos sem derramar uma gota de suor.

Este Antecedente pode ser usado em diversos testes referentes a ofícios, trabalhos e esforço físico.`,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2a2 2 0 0 1 2 2v4l3 3-3 3v4a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-4L5 11l3-3V4a2 2 0 0 1 2-2h4z" />
      </svg>
    ),
  },
  {
    id: "montaria",
    label: "Montaria",
    accentColor: "#8b6914",
    glowColor: "rgba(139,105,20,0.3)",
    summary: "Cavalos, manobras e conhecimento de pecuária.",
    description: `Este Antecedente é o que lhe dá domínio sobre cavalos, burricos e qualquer animal de montaria. Você trabalhava num estábulo ou era alguém que pastoreava gado, uma profissão bastante comum na época.

Este Antecedente lhe dá bônus para qualquer manobra que fizer com sua montaria, além de torná-la mais confiante e veloz. Você sabe avaliar a qualidade de um belo corcel, sabe rastrear gado roubado e até conhece os envolvidos na pecuária da região.`,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4-8 4 4 3-6 4 10" />
        <circle cx="19" cy="17" r="2" />
        <circle cx="5" cy="17" r="2" />
      </svg>
    ),
  },
  {
    id: "medicina",
    label: "Medicina",
    accentColor: "#2e7d6b",
    glowColor: "rgba(46,125,107,0.3)",
    summary: "Cura, cirurgia e tratamento de doenças.",
    description: `Você tem conhecimento acadêmico sobre anatomia e cura, é especialista em procedimentos cirúrgicos e sabe remover balas de um corpo como ninguém, mesmo que envolva muito sangue e material de procedência duvidosa.

Você também sabe como tratar diversas doenças terríveis que assolam as pessoas do Oeste.

Faça testes com esse Antecedente para ajudar na recuperação de Pontos de Vida de seus aliados durante o descanso. Também use-o para criar remédios e obter informações sobre novas infecções e doenças.`,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
  },
  {
    id: "roubo",
    label: "Roubo",
    accentColor: "#5c4a8a",
    glowColor: "rgba(92,74,138,0.3)",
    summary: "Furtividade, trapaça e dedos ágeis.",
    description: `Sua maneira de ganhar a vida não é lá muito honesta. Você pode ter escapado da forca algumas vezes e sabe se virar com pouco entre tantos que tem muito. Sua personagem é furtiva, ligeira e sabe fugir de uma encrenca como ninguém.

É provável que seu casaco tenha vários bolsos e você tenha muitas cartas na manga. Você não precisa blefar, seus dedos ágeis estão prontos para aplicar uma bela de uma trapaça ou bater algumas carteiras.

Se tudo der certo você faz uma grana boa. Se der errado... bom, a gente vê o que acontece depois.`,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: "exploracao",
    label: "Exploração",
    accentColor: "#2980b9",
    glowColor: "rgba(41,128,185,0.3)",
    summary: "Sobrevivência, percepção e rastreamento.",
    description: `Ainda há muito o que desbravar pela vastidão da América. O território é inóspito e novo, cheio de surpresas e paisagens deslumbrantes. Para isso é preciso se adaptar e sobreviver nos ermos e territórios mais hostis do país.

Sua personagem está bem atenta aos arredores e de prontidão para perceber qualquer coisa fora do lugar ou movimento suspeito.

Este Antecedente pode ser usado para perceber ameaças, sobreviver na selva, no deserto, na chuva, na fazenda ou numa casinha de sapê. Também pode ser usado para rastrear e apagar os próprios rastros.`,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: "negocios",
    label: "Negócios",
    accentColor: "#c07020",
    glowColor: "rgba(192,112,32,0.3)",
    summary: "Charme, negociação, sedução e mentiras.",
    description: `Engana-se quem acha que falo apenas de velhos com barba escrota atrás de suas grandes mesas de mogno. Me refiro a negociatas de saloon, acordos entre comerciantes. Falo de quem seduz e fascina, de quem usa de flertes, charme, e de quem tem a língua afiada para enganar e mentir.

Daqueles que dominam a arte de soltar os mais abomináveis xingamentos e ameaças camuflados de sorrisos.

Use este Antecedente para seduzir, negociar, descobrir mentiras e más intenções, convencer pessoas e em tudo que envolva diálogos carregados de intrigas e subtexto.`,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "tradicao",
    label: "Tradição",
    accentColor: "#27ae60",
    glowColor: "rgba(39,174,96,0.3)",
    summary: "Cultura, flora, fauna e sabedoria ancestral.",
    description: `Você faz questão de preservar sua origem e sua cultura. As histórias, as crenças, e os conhecimentos transmitidos através de inúmeras gerações até chegarem em você.

Você conhece a fauna e a flora como ninguém e sabe a melhor maneira de tirar proveito de toda essa sabedoria, sempre respeitando a terra e tudo o que é gerado por ela.

Este Antecedente serve para muitas coisas: desde o conhecimento sobre venenos e remédios feitos com plantas silvestres a detalhes sobre os animais da região. Você também sabe encontrar rastros em territórios ermos e consegue se comunicar com outras culturas sem qualquer problema.`,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 0 20" />
        <path d="M12 2a10 10 0 0 0 0 20" />
        <path d="M2 12h20" />
        <path d="M12 2c-2.5 4-2.5 14 0 20" />
        <path d="M12 2c2.5 4 2.5 14 0 20" />
      </svg>
    ),
  },
];

// ─── Linha de dots ─────────────────────────────────────────────────────────────
function DotsRow({
  value,
  accentColor,
  glowColor,
}: {
  value: number;
  accentColor: string;
  glowColor: string;
}) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {Array.from({ length: MAX_SYSTEM }).map((_, i) => {
        const filled = i < value;
        const locked = i >= MAX_PER_LEVEL;
        return (
          <React.Fragment key={i}>
            {i === MAX_PER_LEVEL && (
              <div style={{ width: 1, height: 12, background: "rgba(0,122,81,0.2)", margin: "0 1px" }} />
            )}
            <div style={{
              width:  locked ? 10 : 13,
              height: locked ? 10 : 13,
              borderRadius: "50%",
              border: locked
                ? "1px dashed rgba(0,122,81,0.15)"
                : `1.5px solid ${filled ? accentColor : "rgba(0,122,81,0.22)"}`,
              background: filled
                ? `radial-gradient(circle at 35% 35%, ${accentColor}ee, ${accentColor}88)`
                : "transparent",
              boxShadow: filled ? `0 0 5px ${glowColor}` : "none",
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

// ─── Row de antecedente ────────────────────────────────────────────────────────
function AntecedenteRow({
  ant,
  value,
  onChange,
  canIncrease,
  expanded,
  onToggle,
}: {
  ant: Antecedente;
  value: number;
  onChange: (v: number) => void;
  canIncrease: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const canDecrease = value > 0;
  const atMax = value >= MAX_PER_LEVEL;

  return (
    <div style={{
      border: `1px solid ${expanded ? ant.accentColor + "50" : value > 0 ? ant.accentColor + "30" : "rgba(0,122,81,0.15)"}`,
      borderRadius: "5px",
      overflow: "hidden",
      transition: "border-color 0.25s",
      background: expanded ? `rgba(0,10,5,0.9)` : "rgba(0,10,5,0.6)",
    }}>
      {/* Linha principal */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0",
        padding: "0",
        minHeight: "52px",
      }}>
        {/* Acento colorido lateral */}
        <div style={{
          width: 3,
          alignSelf: "stretch",
          background: value > 0
            ? `linear-gradient(180deg, ${ant.accentColor}, ${ant.accentColor}66)`
            : "rgba(0,122,81,0.12)",
          transition: "background 0.25s",
          flexShrink: 0,
        }} />

        {/* Ícone */}
        <div style={{
          width: 44, height: 52,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: value > 0 ? ant.accentColor : "#2d4a35",
          flexShrink: 0,
          transition: "color 0.2s",
        }}>
          {ant.icon}
        </div>

        {/* Nome + summary + dots */}
        <div style={{ flex: 1, padding: "10px 8px 10px 0", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{
              fontSize: "13px", fontWeight: 700,
              color: value > 0 ? "#e8f5e9" : "#81c784",
              fontFamily: "var(--font-museo), sans-serif",
              letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}>
              {ant.label}
            </span>
            {value >= MAX_PER_LEVEL && (
              <span style={{
                fontSize: "8px", fontWeight: 700,
                color: ant.accentColor,
                border: `1px solid ${ant.accentColor}50`,
                borderRadius: "10px",
                padding: "1px 6px",
                letterSpacing: "0.1em",
                fontFamily: "var(--font-museo), sans-serif",
              }}>
                MAX
              </span>
            )}
          </div>
          <DotsRow value={value} accentColor={ant.accentColor} glowColor={ant.glowColor} />
        </div>

        {/* Botão de info */}
        <button
          onClick={onToggle}
          title="Ver descrição"
          style={{
            width: 36, height: 52,
            background: expanded ? `${ant.accentColor}15` : "transparent",
            border: "none",
            borderLeft: `1px solid ${expanded ? ant.accentColor + "30" : "rgba(0,122,81,0.1)"}`,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: expanded ? ant.accentColor : "#2d4a35",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${ant.accentColor}20`;
            e.currentTarget.style.color = ant.accentColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = expanded ? `${ant.accentColor}15` : "transparent";
            e.currentTarget.style.color = expanded ? ant.accentColor : "#2d4a35";
          }}
        >
          <svg
            width={14} height={14}
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Controles −/+ */}
        <div style={{
          display: "flex", alignItems: "center",
          borderLeft: "1px solid rgba(0,122,81,0.1)",
          height: 52, flexShrink: 0,
        }}>
          <button
            onClick={() => { if (canDecrease) onChange(value - 1); }}
            disabled={!canDecrease}
            style={{
              width: 36, height: "100%",
              background: "transparent",
              border: "none",
              color: canDecrease ? "#81c784" : "#1e3328",
              cursor: canDecrease ? "pointer" : "not-allowed",
              fontSize: "20px", lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
              fontFamily: "monospace",
            }}
            onMouseEnter={(e) => { if (canDecrease) e.currentTarget.style.background = "rgba(0,122,81,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            −
          </button>

          <div style={{
            width: 36, height: "100%",
            borderLeft: "1px solid rgba(0,122,81,0.08)",
            borderRight: "1px solid rgba(0,122,81,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,15,8,0.6)",
          }}>
            <span style={{
              fontSize: "16px", fontWeight: 700,
              color: value > 0 ? ant.accentColor : "#2d4a35",
              fontFamily: "var(--font-museo), sans-serif",
              transition: "color 0.2s",
              minWidth: "12px", textAlign: "center",
            }}>
              {value}
            </span>
          </div>

          <button
            onClick={() => { if (canIncrease && !atMax) onChange(value + 1); }}
            disabled={!canIncrease || atMax}
            style={{
              width: 36, height: "100%",
              background: "transparent",
              border: "none",
              color: canIncrease && !atMax ? ant.accentColor : "#1e3328",
              cursor: canIncrease && !atMax ? "pointer" : "not-allowed",
              fontSize: "20px", lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
              fontFamily: "monospace",
            }}
            onMouseEnter={(e) => { if (canIncrease && !atMax) e.currentTarget.style.background = `${ant.accentColor}15`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            +
          </button>
        </div>
      </div>

      {/* Painel de descrição expansível */}
      <div style={{
        maxHeight: expanded ? "400px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{
          padding: "16px 20px 18px 20px",
          borderTop: `1px solid ${ant.accentColor}25`,
          background: `linear-gradient(135deg, rgba(0,10,5,0.95) 0%, ${ant.accentColor}08 100%)`,
        }}>
          {/* Header da descrição */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            marginBottom: "12px",
          }}>
            <div style={{
              width: 4, height: 16, borderRadius: "2px",
              background: ant.accentColor,
              boxShadow: `0 0 8px ${ant.glowColor}`,
            }} />
            <span style={{
              fontSize: "9px", fontWeight: 700,
              color: ant.accentColor,
              letterSpacing: "0.16em", textTransform: "uppercase",
              fontFamily: "var(--font-museo), sans-serif",
            }}>
              Sobre o Antecedente
            </span>
          </div>

          {/* Texto */}
          {ant.description.split("\n\n").map((para, i) => (
            <p key={i} style={{
              fontSize: "12px",
              color: "#4a7a5a",
              lineHeight: 1.75,
              fontFamily: "var(--font-museo), sans-serif",
              marginBottom: i < ant.description.split("\n\n").length - 1 ? "10px" : 0,
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Painel de resumo lateral ─────────────────────────────────────────────────
function AntecedentesSummary({
  values,
  totalPoints,
}: {
  values: Record<string, number>;
  totalPoints: number;
}) {
  const spent     = Object.values(values).reduce((a, b) => a + b, 0);
  const remaining = totalPoints - spent;
  const pct       = Math.min((spent / totalPoints) * 100, 100);

  return (
    <div style={{
      background: "rgba(0,10,5,0.7)",
      border: "1px solid rgba(0,122,81,0.2)",
      borderRadius: "6px", padding: "18px",
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

      {/* Barra */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "10px", color: "#4a7a5a", fontFamily: "var(--font-museo), sans-serif" }}>Usados</span>
          <span style={{
            fontSize: "12px", fontWeight: 700,
            color: remaining === 0 ? "#81c784" : "#c8e6c9",
            fontFamily: "var(--font-museo), sans-serif",
          }}>
            {spent} / {totalPoints}
          </span>
        </div>
        <div style={{ height: "4px", borderRadius: "2px", background: "rgba(0,122,81,0.15)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: "2px",
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

      {/* Lista rápida */}
      <div style={{ borderTop: "1px solid rgba(0,122,81,0.1)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "7px" }}>
        {ANTECEDENTES.map((ant) => {
          const val = values[ant.id] ?? 0;
          if (val === 0) return null;
          return (
            <div key={ant.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: ant.accentColor,
                  boxShadow: `0 0 4px ${ant.accentColor}`,
                }} />
                <span style={{ fontSize: "10px", color: "#81c784", fontFamily: "var(--font-museo), sans-serif" }}>
                  {ant.label}
                </span>
              </div>
              <span style={{
                fontSize: "11px", fontWeight: 700,
                color: ant.accentColor,
                fontFamily: "var(--font-museo), sans-serif",
              }}>
                {val}
              </span>
            </div>
          );
        })}
        {Object.values(values).every(v => v === 0) && (
          <span style={{ fontSize: "10px", color: "#1e3328", fontFamily: "var(--font-museo), sans-serif", textAlign: "center" }}>
            Nenhum ponto alocado
          </span>
        )}
      </div>

      {/* Regra */}
      <div style={{
        marginTop: "2px", padding: "8px 10px",
        background: "rgba(0,122,81,0.04)",
        border: "1px solid rgba(0,122,81,0.1)",
        borderRadius: "3px",
      }}>
        <p style={{
          fontSize: "9px", color: "#2d4a35", lineHeight: 1.5,
          fontFamily: "var(--font-museo), sans-serif", margin: 0,
        }}>
          Máx. <strong style={{ color: "#4a7a5a" }}>{MAX_PER_LEVEL}</strong> por antecedente no nível 1.<br />
          Limite do sistema: <strong style={{ color: "#4a7a5a" }}>{MAX_SYSTEM}</strong>.
        </p>
      </div>

      {/* Bônus de intelecto */}
      {totalPoints > BASE_POINTS && (
        <div style={{
          padding: "8px 10px",
          background: "rgba(41,128,185,0.08)",
          border: "1px solid rgba(41,128,185,0.2)",
          borderRadius: "3px",
        }}>
          <p style={{
            fontSize: "9px", color: "#2980b9", lineHeight: 1.5,
            fontFamily: "var(--font-museo), sans-serif", margin: 0,
          }}>
            +{totalPoints - BASE_POINTS} ponto{totalPoints - BASE_POINTS > 1 ? "s" : ""} de <strong>Intelecto</strong>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
interface AntecedentesStepProps {
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
  /** Pontos de Intelecto do personagem (cada ponto = +1 ponto de antecedente) */
  intelecto?: number;
}

export function AntecedentesStep({ values, onChange, intelecto = 0 }: AntecedentesStepProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalPoints = BASE_POINTS + intelecto;
  const spent       = Object.values(values).reduce((a, b) => a + b, 0);
  const remaining   = totalPoints - spent;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
      {/* Lista de antecedentes */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        {ANTECEDENTES.map((ant) => (
          <AntecedenteRow
            key={ant.id}
            ant={ant}
            value={values[ant.id] ?? 0}
            onChange={(v) => onChange(ant.id, v)}
            canIncrease={remaining > 0}
            expanded={expandedId === ant.id}
            onToggle={() => toggleExpand(ant.id)}
          />
        ))}
      </div>

      {/* Painel lateral sticky */}
      <div style={{ width: "168px", flexShrink: 0, position: "sticky", top: "88px" }}>
        <AntecedentesSummary values={values} totalPoints={totalPoints} />
      </div>
    </div>
  );
}