"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Ficha } from "@/types/systems";

// ─── Carrega ficha do localStorage ───────────────────────────────────────────
function loadFichaById(id: string): Ficha | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("acervo_fichas");
    if (!raw) return null;
    const fichas: Ficha[] = JSON.parse(raw);
    return fichas.find((f) => f.id === id) ?? null;
  } catch {
    return null;
  }
}

// ─── Tipos locais ─────────────────────────────────────────────────────────────
interface SomDasSeisFicha {
  "character-name": string;
  "player-name": string;
  nivel: number;
  tormento: string;
  recompensa: number;
  dinheiro: number;
  reputacao: number;
  fisico: number;
  agilidade: number;
  intelecto: number;
  coragem: number;
  escolhidas: string[];
  combate: number;
  labuta: number;
  montaria: number;
  medicina: number;
  roubo: number;
  exploracao: number;
  negocios: number;
  tradicao: number;
}

// ─── Dados das habilidades ─────────────────────────────────────────────────────
const HABILIDADES_MAP: Record<string, { nome: string; resumo: string; tag: string; tagColor: string }> = {
  "light-my-fire":              { nome: "Light My Fire",              resumo: "+1 no teste com revólver e +1 de dano por Agilidade.",          tag: "Combate",     tagColor: "#c0392b" },
  "lets-dance":                 { nome: "Let's Dance",                resumo: "Dois disparos em uma ação com -1 no teste (martelo).",           tag: "Combate",     tagColor: "#c0392b" },
  "fortunate-son":              { nome: "Fortunate Son",              resumo: "Ao cair a 0 PVs, recupera 3 PVs e levanta — uma vez por combate.", tag: "Especial",  tagColor: "#d4a017" },
  "dont-stop-believing":        { nome: "Don't Stop Believing",       resumo: "+1 no teste com armas longas e +1 de dano por Intelecto.",       tag: "Combate",     tagColor: "#c0392b" },
  "immigrant-song":             { nome: "Immigrant Song",             resumo: "Ataques desarmados passam de 1d3 para 1d6, +1 por Físico.",      tag: "Combate",     tagColor: "#c0392b" },
  "gimme-shelter":              { nome: "Gimme Shelter",              resumo: "Ataques surpresa com faca causam +1d6 a cada 2 níveis.",         tag: "Furtividade", tagColor: "#8e44ad" },
  "another-one-bites-the-dust": { nome: "Another One Bites the Dust", resumo: "Aprenda um estilo de luta corpo a corpo.",                      tag: "Especial",    tagColor: "#d4a017" },
  "riders-on-the-storm":        { nome: "Riders on the Storm",        resumo: "Sacrifica PVs para aumentar dano corpo a corpo em +1d6/3 PVs.", tag: "Combate",     tagColor: "#c0392b" },
  "born-to-be-wild":            { nome: "Born to Be Wild",            resumo: "+1 em testes de furtividade e percepção.",                      tag: "Furtividade", tagColor: "#8e44ad" },
  "smoke-on-the-water":         { nome: "Smoke on the Water",         resumo: "+1 em testes e +1 de dano por Físico com armas rústicas.",      tag: "Combate",     tagColor: "#c0392b" },
  "under-pressure":             { nome: "Under Pressure",             resumo: "+1 em resistências e +1 PV por Físico ao descansar.",           tag: "Utilidade",   tagColor: "#2980b9" },
  "heartbreaker":               { nome: "Heartbreaker",               resumo: "Uma vez por sessão, alvo(s) têm -1 contra você ou um aliado.", tag: "Social",      tagColor: "#c07020" },
  "barracuda":                  { nome: "Barracuda",                  resumo: "+1 por nível (máx 5) para descobrir informações.",              tag: "Social",      tagColor: "#c07020" },
  "sweet-emotion":              { nome: "Sweet Emotion",              resumo: "Inspire aliados com bônus crescentes por nível.",               tag: "Suporte",     tagColor: "#2e7d6b" },
  "crazy-train":                { nome: "Crazy Train",                resumo: "Uma vez por nível, aumente dano de uma arma em +1d6.",          tag: "Utilidade",   tagColor: "#2980b9" },
  "carry-on":                   { nome: "Carry On My Wayward Son",    resumo: "Rejogue testes fracassados — uma vez por nível por sessão.",    tag: "Especial",    tagColor: "#d4a017" },
  "war-pigs":                   { nome: "War Pigs",                   resumo: "+1 no teste com explosivos e +1 de dano por Intelecto.",        tag: "Combate",     tagColor: "#c0392b" },
  "ace-of-spades":              { nome: "Ace of Spades",              resumo: "+1 em testes de Roubo para trapacear em jogos.",               tag: "Furtividade", tagColor: "#8e44ad" },
  "a-horse-with-no-name":       { nome: "A Horse with No Name",       resumo: "+1 em todos os testes com sua própria montaria.",              tag: "Utilidade",   tagColor: "#2980b9" },
  "i-want-to-hold-your-hand":   { nome: "I Want to Hold Your Hand",   resumo: "Cura +1d6 PVs por nível ao tratar aliados.",                  tag: "Suporte",     tagColor: "#2e7d6b" },
  "paranoid":                   { nome: "Paranoid",                   resumo: "+1 em Iniciativa. Nunca é pega de surpresa.",                  tag: "Utilidade",   tagColor: "#2980b9" },
  "ramble-on":                  { nome: "Ramble On",                  resumo: "Move-se duas vezes com uma ação e +1 em fuga.",                tag: "Furtividade", tagColor: "#8e44ad" },
  "aqualung":                   { nome: "Aqualung",                   resumo: "+1 em testes atléticos: natação, escalada, salto.",            tag: "Utilidade",   tagColor: "#2980b9" },
  "more-than-a-feeling":        { nome: "More Than a Feeling",        resumo: "Teste de Negócios para 2 perguntas à Juíza. Uma vez/sessão.", tag: "Social",      tagColor: "#c07020" },
};

const ANTECEDENTES_META: Record<string, { label: string; color: string }> = {
  combate:    { label: "Combate",    color: "#c0392b" },
  labuta:     { label: "Labuta",     color: "#a0522d" },
  montaria:   { label: "Montaria",   color: "#8b6914" },
  medicina:   { label: "Medicina",   color: "#2e7d6b" },
  roubo:      { label: "Roubo",      color: "#5c4a8a" },
  exploracao: { label: "Exploração", color: "#2980b9" },
  negocios:   { label: "Negócios",   color: "#c07020" },
  tradicao:   { label: "Tradição",   color: "#27ae60" },
};

const ATTR_META = [
  { id: "fisico",    label: "Físico",    color: "#c0392b", bonus: "+1d6 Vida"    },
  { id: "agilidade", label: "Agilidade", color: "#d4a017", bonus: "+1 Ação"      },
  { id: "intelecto", label: "Intelecto", color: "#2980b9", bonus: "+1 Antec."    },
  { id: "coragem",   label: "Coragem",   color: "#8e44ad", bonus: "+1 Iniciativa" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcVida(fisico: number, nivel: number) {
  return 6 + fisico * 4 * nivel;
}
function calcAcoes(agilidade: number) {
  return 1 + agilidade;
}
function calcIniciativa(coragem: number) {
  return coragem;
}
function calcDefesa(agilidade: number) {
  return 10 + agilidade;
}
function getReputLabel(val: number): { text: string; color: string } {
  const vis = ((val + 2) / 4) * 100;
  if (vis <= 20) return { text: "Lendário",   color: "#81c784" };
  if (vis <= 40) return { text: "Respeitado", color: "#a5d6a7" };
  if (vis <= 60) return { text: "Neutro",     color: "#b0bec5" };
  if (vis <= 80) return { text: "Suspeito",   color: "#ef9a9a" };
  return { text: "Infame", color: "#e53935" };
}

// ─── Componentes visuais ──────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
      <span style={{
        fontSize: "9px", fontWeight: 700, color: "#007A51",
        letterSpacing: "0.2em", textTransform: "uppercase",
        fontFamily: "var(--font-museo), sans-serif",
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: "1px", background: "rgba(0,122,81,0.18)" }} />
    </div>
  );
}

function DotRow({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: i < 2 ? 13 : 10,
          height: i < 2 ? 13 : 10,
          borderRadius: "50%",
          border: i < value
            ? `1.5px solid ${color}`
            : i >= 2
            ? "1px dashed rgba(0,122,81,0.15)"
            : "1.5px solid rgba(0,122,81,0.2)",
          background: i < value
            ? `radial-gradient(circle at 35% 35%, ${color}ee, ${color}77)`
            : "transparent",
          boxShadow: i < value ? `0 0 5px ${color}66` : "none",
          opacity: i >= 2 ? 0.4 : 1,
          transition: "all 0.15s",
        }} />
      ))}
    </div>
  );
}

function StatBox({ label, value, sub, color, large }: {
  label: string; value: string | number; sub?: string; color: string; large?: boolean;
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: large ? "20px 28px" : "16px 20px",
      background: "rgba(0,10,5,0.7)",
      border: `1px solid ${color}40`,
      borderRadius: "6px",
      position: "relative", overflow: "hidden",
      backdropFilter: "blur(8px)",
      flex: 1,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 0%, ${color}12, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <span style={{
        fontSize: "9px", fontWeight: 700, color: color,
        letterSpacing: "0.18em", textTransform: "uppercase",
        fontFamily: "var(--font-museo), sans-serif",
        marginBottom: "8px", opacity: 0.85,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: large ? "36px" : "28px", fontWeight: 700,
        color: "#e8f5e9",
        fontFamily: "var(--font-museo), sans-serif",
        lineHeight: 1,
      }}>
        {value}
      </span>
      {sub && (
        <span style={{
          fontSize: "9px", color: `${color}99`,
          fontFamily: "var(--font-museo), sans-serif",
          marginTop: "5px", letterSpacing: "0.06em",
        }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function AttrCard({ label, color, bonus, value }: {
  label: string; color: string; bonus: string; value: number;
}) {
  return (
    <div style={{
      background: "rgba(0,10,5,0.7)",
      border: `1px solid ${color}30`,
      borderRadius: "6px",
      padding: "16px 18px",
      backdropFilter: "blur(8px)",
      display: "flex", flexDirection: "column", gap: "10px",
      position: "relative", overflow: "hidden",
      flex: 1,
    }}>
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 80, height: 80, borderRadius: "50%",
        background: color,
        filter: "blur(30px)", opacity: 0.12,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#c8e6c9", fontFamily: "var(--font-museo), sans-serif" }}>
          {label}
        </span>
        <span style={{
          fontSize: "9px", color: color,
          fontFamily: "var(--font-museo), sans-serif",
          border: `1px solid ${color}30`, borderRadius: "20px",
          padding: "2px 8px", letterSpacing: "0.06em",
        }}>
          {bonus}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <DotRow value={value} color={color} />
        <span style={{
          fontSize: "22px", fontWeight: 700,
          color: value > 0 ? color : "#2d4a35",
          fontFamily: "var(--font-museo), sans-serif",
          transition: "color 0.2s",
        }}>
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── Loading / Not found ──────────────────────────────────────────────────────
function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#c8e6c9",
      fontFamily: "var(--font-museo), sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      <Header />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "13px", color: "#4a7a5a" }}>Ficha não encontrada.</p>
        <button
          onClick={onBack}
          style={{
            padding: "10px 22px", background: "#007A51", border: "none",
            color: "#e8f5e9", borderRadius: "3px", cursor: "pointer",
            fontSize: "13px", fontFamily: "var(--font-museo), sans-serif",
          }}
        >
          Voltar para Fichas
        </button>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function FichaViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [ficha, setFicha] = useState<Ficha | null | undefined>(undefined); // undefined = carregando

  useEffect(() => {
    if (id) {
      const found = loadFichaById(id);
      setFicha(found);
    }
  }, [id]);

  // Carregando
  if (ficha === undefined) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a", color: "#c8e6c9",
        fontFamily: "var(--font-museo), sans-serif",
        display: "flex", flexDirection: "column",
      }}>
        <Header />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "13px", color: "#4a7a5a" }}>Carregando ficha...</span>
        </div>
      </div>
    );
  }

  // Não encontrado
  if (!ficha) return <NotFound onBack={() => router.push("/fichas")} />;

  // ── Extrai dados da ficha ──
  const characterData = ficha.data;

  const raw: Partial<SomDasSeisFicha> = {
    ...(characterData["character-basics"] as any || {}),
    ...(characterData["attributes"] as any || {}),
    escolhidas: (characterData["habilidades"]?.["escolhidas"] as string[]) ?? [],
    ...(characterData["antecedentes"] as any || {}),
  };

  const nome       = (raw["character-name"] as string) || "Sem nome";
  const jogador    = (raw["player-name"]    as string) || "—";
  const nivel      = Number(raw.nivel)      || 1;
  const tormento   = (raw.tormento as string) || "";
  const recompensa = Number(raw.recompensa) || 0;
  const dinheiro   = Number(raw.dinheiro)   || 0;
  const reputacao  = Number(raw.reputacao)  ?? 0;

  const fisico    = Number(raw.fisico)    || 0;
  const agilidade = Number(raw.agilidade) || 0;
  const intelecto = Number(raw.intelecto) || 0;
  const coragem   = Number(raw.coragem)   || 0;

  const escolhidas = (raw.escolhidas as string[]) || [];

  const vida       = calcVida(fisico, nivel);
  const acoes      = calcAcoes(agilidade);
  const iniciativa = calcIniciativa(coragem);
  const defesa     = calcDefesa(agilidade);

  const { text: reputLabel, color: reputColor } = getReputLabel(reputacao);

  const antecedentesEntries = Object.entries(ANTECEDENTES_META).map(([id, meta]) => ({
    id, ...meta, value: Number((characterData["antecedentes"] as any)?.[id]) || 0,
  }));

  const systemName = ficha.systemId === "som-das-seis" ? "Som das Seis" : ficha.systemId;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#c8e6c9",
      fontFamily: "var(--font-museo), sans-serif",
      overflowX: "hidden",
      position: "relative",
      display: "flex", flexDirection: "column",
    }}>
      {/* Fundos */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `
          radial-gradient(ellipse at 15% 30%, rgba(0,122,81,0.07) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 75%, rgba(0,122,81,0.05) 0%, transparent 50%)
        `,
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", top: "68px", left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/velhoseis.webp')",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.05, pointerEvents: "none", zIndex: 0,
      }} />

      <Header />

      <main style={{
        flex: 1, position: "relative", zIndex: 1,
        maxWidth: "780px", margin: "0 auto", width: "100%",
        padding: "40px 48px 80px",
      }}>

        {/* Voltar */}
        <button
          onClick={() => router.push("/fichas")}
          style={{
            background: "none", border: "none",
            color: "#4a7a5a", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "12px", fontFamily: "var(--font-museo), sans-serif",
            marginBottom: "32px", padding: 0, transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#81c784")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4a7a5a")}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Minhas Fichas
        </button>

        {/* ── Hero ── */}
        <div style={{
          background: "rgba(0,10,5,0.75)",
          border: "1px solid rgba(0,122,81,0.25)",
          borderRadius: "8px",
          padding: "32px 36px",
          marginBottom: "24px",
          backdropFilter: "blur(10px)",
          position: "relative", overflow: "hidden",
        }}>
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
            <div key={`${v}${h}`} style={{
              position: "absolute",
              [v]: 10, [h]: 10,
              width: 16, height: 16,
              borderTop:    v === "top"    ? "1.5px solid rgba(0,122,81,0.4)" : "none",
              borderBottom: v === "bottom" ? "1.5px solid rgba(0,122,81,0.4)" : "none",
              borderLeft:   h === "left"   ? "1.5px solid rgba(0,122,81,0.4)" : "none",
              borderRight:  h === "right"  ? "1.5px solid rgba(0,122,81,0.4)" : "none",
            }} />
          ))}

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "3px 10px",
                border: "1px solid rgba(0,122,81,0.3)",
                borderRadius: "20px",
                fontSize: "9px", fontWeight: 700,
                color: "#007A51", letterSpacing: "0.14em", textTransform: "uppercase",
                marginBottom: "14px",
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#007A51", boxShadow: "0 0 6px #007A51" }} />
                {systemName}
              </div>

              <h1 style={{
                fontSize: "34px", fontWeight: 700,
                color: "#e8f5e9", letterSpacing: "-0.02em",
                lineHeight: 1.1, marginBottom: "10px",
              }}>
                {nome}
              </h1>

              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#4a7a5a" }}>
                  Jogador: <span style={{ color: "#81c784" }}>{jogador}</span>
                </span>
                <div style={{ width: 1, height: 14, background: "rgba(0,122,81,0.25)" }} />
                <span style={{ fontSize: "13px", color: "#4a7a5a" }}>
                  Nível: <span style={{ color: "#81c784", fontWeight: 700 }}>{nivel}</span>
                </span>
              </div>
            </div>

            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              padding: "14px 20px",
              border: `1px solid ${reputColor}30`,
              borderRadius: "6px",
              background: `${reputColor}08`,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "9px", color: "#4a7a5a", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Reputação
              </span>
              <span style={{ fontSize: "18px", fontWeight: 700, color: reputColor }}>
                {reputLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ── Combate & Estatísticas ── */}
        <div style={{
          background: "rgba(0,10,5,0.6)",
          border: "1px solid rgba(0,122,81,0.2)",
          borderRadius: "8px",
          padding: "28px 32px",
          marginBottom: "24px",
          backdropFilter: "blur(8px)",
        }}>
          <SectionLabel>Combate &amp; Estatísticas</SectionLabel>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <StatBox label="Vida"       value={vida}           sub={`base + ${fisico} Físico × ${nivel}`} color="#c0392b" large />
            <StatBox label="Defesa"     value={defesa}         sub="10 + Agilidade"                       color="#d4a017" />
            <StatBox label="Ações"      value={acoes}          sub="1 + Agilidade"                        color="#2e7d6b" />
            <StatBox label="Iniciativa" value={`+${iniciativa}`} sub="Coragem"                            color="#8e44ad" />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {ATTR_META.map((a) => {
              const val = a.id === "fisico" ? fisico : a.id === "agilidade" ? agilidade : a.id === "intelecto" ? intelecto : coragem;
              return <AttrCard key={a.id} label={a.label} color={a.color} bonus={a.bonus} value={val} />;
            })}
          </div>
        </div>

        {/* ── Recursos, Habilidades, Antecedentes, Tormento ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Recursos */}
          <div style={{
            background: "rgba(0,10,5,0.6)", border: "1px solid rgba(0,122,81,0.18)",
            borderRadius: "8px", padding: "24px 32px", backdropFilter: "blur(8px)",
          }}>
            <SectionLabel>Recursos</SectionLabel>
            <div style={{ display: "flex", gap: "16px" }}>
              {[
                { label: "Dinheiro",   value: `$ ${dinheiro}`,   color: "#d4a017" },
                { label: "Recompensa", value: `$ ${recompensa}`, color: "#c07020" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  flex: 1, padding: "16px 20px",
                  background: "rgba(0,15,8,0.7)",
                  border: `1px solid ${color}25`, borderRadius: "6px",
                  display: "flex", flexDirection: "column", gap: "6px",
                }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, color, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    {label}
                  </span>
                  <span style={{ fontSize: "24px", fontWeight: 700, color: "#e8f5e9", fontFamily: "var(--font-museo), sans-serif" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div style={{
            background: "rgba(0,10,5,0.6)", border: "1px solid rgba(0,122,81,0.18)",
            borderRadius: "8px", padding: "24px 32px", backdropFilter: "blur(8px)",
          }}>
            <SectionLabel>Habilidades</SectionLabel>
            {escolhidas.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#2d4a35" }}>Nenhuma habilidade escolhida.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {escolhidas.map((habId) => {
                  const h = HABILIDADES_MAP[habId];
                  if (!h) return null;
                  return (
                    <div key={habId} style={{
                      display: "flex", alignItems: "center", gap: "14px",
                      padding: "14px 16px",
                      background: "rgba(0,15,8,0.7)",
                      border: `1px solid ${h.tagColor}25`,
                      borderRadius: "5px",
                      borderLeft: `3px solid ${h.tagColor}`,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#e8f5e9" }}>{h.nome}</span>
                          <span style={{
                            fontSize: "8px", fontWeight: 700, color: h.tagColor,
                            border: `1px solid ${h.tagColor}30`, borderRadius: "10px",
                            padding: "2px 7px", letterSpacing: "0.1em", textTransform: "uppercase",
                          }}>
                            {h.tag}
                          </span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#4a7a5a" }}>{h.resumo}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Antecedentes */}
          <div style={{
            background: "rgba(0,10,5,0.6)", border: "1px solid rgba(0,122,81,0.18)",
            borderRadius: "8px", padding: "24px 32px", backdropFilter: "blur(8px)",
          }}>
            <SectionLabel>Antecedentes</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {antecedentesEntries.map(({ id: antId, label, color, value }) => (
                <div key={antId} style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "10px 14px",
                  background: value > 0 ? "rgba(0,15,8,0.8)" : "rgba(0,10,5,0.4)",
                  border: `1px solid ${value > 0 ? color + "30" : "rgba(0,122,81,0.1)"}`,
                  borderRadius: "5px",
                  borderLeft: `3px solid ${value > 0 ? color : "rgba(0,122,81,0.12)"}`,
                  opacity: value === 0 ? 0.45 : 1,
                }}>
                  <span style={{
                    fontSize: "12px", fontWeight: 700,
                    color: value > 0 ? "#c8e6c9" : "#2d4a35",
                    minWidth: "90px",
                    fontFamily: "var(--font-museo), sans-serif",
                  }}>
                    {label}
                  </span>
                  <DotRow value={value} color={color} />
                  <span style={{
                    marginLeft: "auto",
                    fontSize: "16px", fontWeight: 700,
                    color: value > 0 ? color : "#2d4a35",
                    fontFamily: "var(--font-museo), sans-serif",
                    minWidth: "16px", textAlign: "right",
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tormento */}
          {tormento && (
            <div style={{
              background: "rgba(0,10,5,0.6)", border: "1px solid rgba(0,122,81,0.18)",
              borderRadius: "8px", padding: "24px 32px", backdropFilter: "blur(8px)",
            }}>
              <SectionLabel>Tormento</SectionLabel>
              <p style={{
                fontSize: "14px", color: "#4a7a5a",
                lineHeight: 1.75, fontStyle: "italic",
                borderLeft: "2px solid rgba(0,122,81,0.2)",
                paddingLeft: "16px",
              }}>
                {tormento}
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}