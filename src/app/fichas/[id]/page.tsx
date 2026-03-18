"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import { Ficha } from "@/types/systems";

// ─── Storage ──────────────────────────────────────────────────────────────────
function loadFichaById(id: string): Ficha | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("acervo_fichas");
    if (!raw) return null;
    const fichas: Ficha[] = JSON.parse(raw);
    return fichas.find((f) => f.id === id) ?? null;
  } catch { return null; }
}

function saveFichaToStorage(ficha: Ficha) {
  try {
    const raw = localStorage.getItem("acervo_fichas");
    const fichas: Ficha[] = raw ? JSON.parse(raw) : [];
    const idx = fichas.findIndex(f => f.id === ficha.id);
    if (idx >= 0) fichas[idx] = ficha;
    else fichas.push(ficha);
    localStorage.setItem("acervo_fichas", JSON.stringify(fichas));
  } catch {}
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calcVida      = (f: number, n: number) => 6 + f * 4 * n;
const calcAcoes     = (a: number) => 1 + a;
const calcDefesa    = (a: number) => 10 + a;
const calcIniciativa = (c: number) => c;

function getReputLabel(val: number) {
  const v = ((val + 2) / 4) * 100;
  if (v <= 20) return { text: "Lendário",   color: "#81c784" };
  if (v <= 40) return { text: "Respeitado", color: "#a5d6a7" };
  if (v <= 60) return { text: "Neutro",     color: "#b0bec5" };
  if (v <= 80) return { text: "Suspeito",   color: "#ef9a9a" };
  return { text: "Infame", color: "#e53935" };
}

// ─── Dados estáticos ──────────────────────────────────────────────────────────
const HABILIDADES_MAP: Record<string, { nome: string; resumo: string; tag: string; tagColor: string }> = {
  "light-my-fire":{ nome:"Light My Fire", resumo:"+1 no teste com revólver e +1 de dano por Agilidade.", tag:"Combate", tagColor:"#c0392b" },
  "lets-dance":{ nome:"Let's Dance", resumo:"Dois disparos em uma ação com -1 no teste (martelo).", tag:"Combate", tagColor:"#c0392b" },
  "fortunate-son":{ nome:"Fortunate Son", resumo:"Ao cair a 0 PVs, recupera 3 PVs e levanta — uma vez por combate.", tag:"Especial", tagColor:"#d4a017" },
  "dont-stop-believing":{ nome:"Don't Stop Believing", resumo:"+1 no teste com armas longas e +1 de dano por Intelecto.", tag:"Combate", tagColor:"#c0392b" },
  "immigrant-song":{ nome:"Immigrant Song", resumo:"Ataques desarmados passam de 1d3 para 1d6, +1 por Físico.", tag:"Combate", tagColor:"#c0392b" },
  "gimme-shelter":{ nome:"Gimme Shelter", resumo:"Ataques surpresa com faca causam +1d6 a cada 2 níveis.", tag:"Furtividade", tagColor:"#8e44ad" },
  "another-one-bites-the-dust":{ nome:"Another One Bites the Dust", resumo:"Aprenda um estilo de luta corpo a corpo.", tag:"Especial", tagColor:"#d4a017" },
  "riders-on-the-storm":{ nome:"Riders on the Storm", resumo:"Sacrifica PVs para aumentar dano corpo a corpo em +1d6/3 PVs.", tag:"Combate", tagColor:"#c0392b" },
  "born-to-be-wild":{ nome:"Born to Be Wild", resumo:"+1 em testes de furtividade e percepção.", tag:"Furtividade", tagColor:"#8e44ad" },
  "smoke-on-the-water":{ nome:"Smoke on the Water", resumo:"+1 em testes e +1 de dano por Físico com armas rústicas.", tag:"Combate", tagColor:"#c0392b" },
  "under-pressure":{ nome:"Under Pressure", resumo:"+1 em resistências e +1 PV por Físico ao descansar.", tag:"Utilidade", tagColor:"#2980b9" },
  "heartbreaker":{ nome:"Heartbreaker", resumo:"Uma vez por sessão, alvo(s) têm -1 contra você ou um aliado.", tag:"Social", tagColor:"#c07020" },
  "barracuda":{ nome:"Barracuda", resumo:"+1 por nível (máx 5) para descobrir informações.", tag:"Social", tagColor:"#c07020" },
  "sweet-emotion":{ nome:"Sweet Emotion", resumo:"Inspire aliados com bônus crescentes por nível.", tag:"Suporte", tagColor:"#2e7d6b" },
  "crazy-train":{ nome:"Crazy Train", resumo:"Uma vez por nível, aumente dano de uma arma em +1d6.", tag:"Utilidade", tagColor:"#2980b9" },
  "carry-on":{ nome:"Carry On My Wayward Son", resumo:"Rejogue testes fracassados — uma vez por nível por sessão.", tag:"Especial", tagColor:"#d4a017" },
  "war-pigs":{ nome:"War Pigs", resumo:"+1 no teste com explosivos e +1 de dano por Intelecto.", tag:"Combate", tagColor:"#c0392b" },
  "ace-of-spades":{ nome:"Ace of Spades", resumo:"+1 em testes de Roubo para trapacear em jogos.", tag:"Furtividade", tagColor:"#8e44ad" },
  "a-horse-with-no-name":{ nome:"A Horse with No Name", resumo:"+1 em todos os testes com sua própria montaria.", tag:"Utilidade", tagColor:"#2980b9" },
  "i-want-to-hold-your-hand":{ nome:"I Want to Hold Your Hand", resumo:"Cura +1d6 PVs por nível ao tratar aliados.", tag:"Suporte", tagColor:"#2e7d6b" },
  "paranoid":{ nome:"Paranoid", resumo:"+1 em Iniciativa. Nunca é pega de surpresa.", tag:"Utilidade", tagColor:"#2980b9" },
  "ramble-on":{ nome:"Ramble On", resumo:"Move-se duas vezes com uma ação e +1 em fuga.", tag:"Furtividade", tagColor:"#8e44ad" },
  "aqualung":{ nome:"Aqualung", resumo:"+1 em testes atléticos: natação, escalada, salto.", tag:"Utilidade", tagColor:"#2980b9" },
  "more-than-a-feeling":{ nome:"More Than a Feeling", resumo:"Teste de Negócios para 2 perguntas à Juíza. Uma vez/sessão.", tag:"Social", tagColor:"#c07020" },
};

const ANTECEDENTES_META: Record<string, { label: string; color: string; descricao: string }> = {
  combate:{ label:"Combate", color:"#c0392b", descricao:"Seja uma veterana da Guerra Civil ou um errante solitário acompanhado de seu revólver. Este Antecedente é o mais importante para atirar com suas armas, sair no soco e ter noção de estratégias em batalha. É recomendado ao menos um ponto neste Antecedente devido à temática do jogo, mas não é obrigatório." },
  labuta:{ label:"Labuta", color:"#a0522d", descricao:"O trabalho pesado deixou seu corpo resistente e calejado. A labuta te deu o conhecimento para construir e consertar coisas, mas também determina suas aptidões físicas — se sua personagem sabe nadar, correr, saltar mais longe ou realizar feitos sem derramar uma gota de suor." },
  montaria:{ label:"Montaria", color:"#8b6914", descricao:"Este Antecedente lhe dá domínio sobre cavalos, burricos e qualquer animal de montaria. Você tem bônus para qualquer manobra com sua montaria, sabe avaliar a qualidade de um corcel, rastrear gado roubado e conhece os envolvidos na pecuária da região." },
  medicina:{ label:"Medicina", color:"#2e7d6b", descricao:"Você tem conhecimento acadêmico sobre anatomia e cura, é especialista em procedimentos cirúrgicos e sabe remover balas de um corpo como ninguém. Faça testes com esse Antecedente para ajudar na recuperação de Pontos de Vida de seus aliados durante o descanso." },
  roubo:{ label:"Roubo", color:"#5c4a8a", descricao:"Sua maneira de ganhar a vida não é lá muito honesta. Sua personagem é furtiva, ligeira e sabe fugir de uma encrenca como ninguém. Seus dedos ágeis estão prontos para aplicar uma bela trapaça ou bater algumas carteiras. Se tudo der certo você faz uma grana boa." },
  exploracao:{ label:"Exploração", color:"#2980b9", descricao:"Sua personagem está bem atenta aos arredores e de prontidão para perceber qualquer coisa fora do lugar. Use este Antecedente para perceber ameaças, sobreviver na selva, no deserto, na chuva ou numa casinha de sapê. Também serve para rastrear e apagar os próprios rastros." },
  negocios:{ label:"Negócios", color:"#c07020", descricao:"Negociatas de saloon, acordos entre comerciantes, sedução e charme. Quem tem a língua afiada para enganar e mentir. Use este Antecedente para seduzir, negociar, descobrir mentiras, convencer pessoas e em tudo que envolva diálogos carregados de intrigas e subtexto." },
  tradicao:{ label:"Tradição", color:"#27ae60", descricao:"Você faz questão de preservar sua origem e cultura. Conhece a fauna e a flora como ninguém. Serve para conhecimento sobre venenos e remédios feitos com plantas silvestres, detalhes sobre animais da região, encontrar rastros em territórios ermos e comunicar com outras culturas." },
};

const ATTR_META = [
  { id:"fisico",    label:"Físico",    color:"#c0392b", max:5 },
  { id:"agilidade", label:"Agilidade", color:"#d4a017", max:5 },
  { id:"intelecto", label:"Intelecto", color:"#2980b9", max:5 },
  { id:"coragem",   label:"Coragem",   color:"#8e44ad", max:5 },
];

// Posições dos círculos do revólver na imagem (% do card)
// Baseado na imagem atributosSS.png: 4 círculos ao redor de um central
const ATTR_POSITIONS: Record<string, { top: string; left: string }> = {
  intelecto: { top: "18%",  left: "52%" }, // topo
  agilidade: { top: "42%",  left: "22%" }, // esquerda
  coragem:   { top: "42%",  left: "78%" }, // direita
  fisico:    { top: "68%",  left: "52%" }, // baixo
};

type Tab = "combate" | "habilidades" | "equipamentos";

// ─── Dot clicável ─────────────────────────────────────────────────────────────
function ClickableDots({
  value, max = 5, color, onChange, maxAllowed = 2,
}: {
  value: number; max?: number; color: string;
  onChange: (v: number) => void; maxAllowed?: number;
}) {
  return (
    <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled  = i < value;
        const locked  = i >= maxAllowed;
        const isNext  = i === value && !locked;
        const isLast  = i === value - 1 && filled;

        return (
          <div
            key={i}
            title={locked ? `Máx. ${maxAllowed} neste nível` : filled ? "Clique para diminuir" : "Clique para aumentar"}
            onClick={() => {
              if (locked) return;
              if (filled) onChange(Math.max(0, value - 1));    // diminui
              else if (isNext) onChange(Math.min(maxAllowed, value + 1)); // aumenta
            }}
            style={{
              width:  locked ? 8 : 12, height: locked ? 8 : 12,
              borderRadius:"50%",
              border: locked
                ? "1px dashed rgba(0,122,81,0.15)"
                : filled
                ? `1.5px solid ${color}`
                : isNext
                ? `1.5px dashed ${color}88`
                : "1.5px solid rgba(0,122,81,0.2)",
              background: filled
                ? `radial-gradient(circle at 35% 35%, ${color}ee, ${color}77)`
                : "transparent",
              boxShadow: filled && !locked ? `0 0 5px ${color}66` : "none",
              opacity: locked ? 0.3 : 1,
              cursor: locked ? "default" : "pointer",
              transition: "all 0.12s",
              transform: isNext && !locked ? "scale(1.1)" : "scale(1)",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Título de seção ──────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"24px" }}>
      <span style={{ fontSize:"10px", fontWeight:700, color:"#007A51", letterSpacing:"0.25em", textTransform:"uppercase", fontFamily:"var(--font-museo), sans-serif" }}>
        {children}
      </span>
      <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg, rgba(0,122,81,0.3), transparent)" }} />
    </div>
  );
}

// ─── Card com imagem de fundo ─────────────────────────────────────────────────
function ImgCard({ img, title, children, minH = 280 }: {
  img: string; title: string; children: React.ReactNode; minH?: number;
}) {
  return (
    <div style={{ position:"relative", borderRadius:"8px", overflow:"hidden", border:"1px solid rgba(0,122,81,0.2)", minHeight:minH }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:`url('/${img}')`, backgroundSize:"cover", backgroundPosition:"center", opacity:0.4 }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,5,2,0.35) 0%, rgba(0,5,2,0.78) 100%)" }} />
      <div style={{ position:"relative", zIndex:1, padding:"18px 20px", height:"100%", display:"flex", flexDirection:"column" }}>
        <p style={{ fontSize:"9px", fontWeight:700, color:"#007A51", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"14px", fontFamily:"var(--font-museo), sans-serif" }}>
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}


// ─── Overlay num círculo do revólver ─────────────────────────────────────────
function AttrCircleOverlay({
  label, color, value, onChange, top, left,
}: {
  label: string; color: string;
  value: number; onChange: (v: number) => void;
  top: string; left: string;
}) {
  const MAX = 2;
  return (
    <div style={{
      position:"absolute", top, left,
      transform:"translate(-50%,-50%)",
      zIndex:4,
      display:"flex", flexDirection:"column",
      alignItems:"center", gap:"4px",
      pointerEvents:"all",
    }}>
      {/* Número grande */}
      <span style={{
        fontSize:"36px", fontWeight:700,
        color: value > 0 ? color : "rgba(255,255,255,0.25)",
        fontFamily:"var(--font-museo),sans-serif",
        lineHeight:1,
        textShadow: value > 0
          ? `0 0 16px ${color}cc, 0 2px 6px rgba(0,0,0,1)`
          : "0 2px 6px rgba(0,0,0,0.9)",
        transition:"all 0.2s",
      }}>{value}</span>

      {/* Botões − + compactos */}
      <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
        <button onClick={() => onChange(Math.max(0,value-1))} disabled={value===0}
          style={{ width:20, height:20, borderRadius:"4px", background:"rgba(0,0,0,0.75)", border:`1px solid ${value>0?color+"70":"rgba(255,255,255,0.12)"}`, color:value>0?color:"rgba(255,255,255,0.2)", cursor:value>0?"pointer":"default", fontSize:"14px", lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center", padding:0, transition:"all 0.15s", backdropFilter:"blur(4px)" }}>−</button>
        <button onClick={() => onChange(Math.min(MAX,value+1))} disabled={value>=MAX}
          style={{ width:20, height:20, borderRadius:"4px", background:"rgba(0,0,0,0.75)", border:`1px solid ${value<MAX?color+"70":"rgba(255,255,255,0.12)"}`, color:value<MAX?color:"rgba(255,255,255,0.2)", cursor:value<MAX?"pointer":"default", fontSize:"14px", lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center", padding:0, transition:"all 0.15s", backdropFilter:"blur(4px)" }}>+</button>
      </div>
    </div>
  );
}

// ─── Título de seção ──────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"24px" }}>
      <span style={{ fontSize:"10px", fontWeight:700, color:"#007A51", letterSpacing:"0.25em", textTransform:"uppercase", fontFamily:"var(--font-museo), sans-serif" }}>
        {children}
      </span>
      <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg, rgba(0,122,81,0.3), transparent)" }} />
    </div>
  );
}

// ─── Card com imagem de fundo ─────────────────────────────────────────────────
function ImgCard({ img, title, children, minH = 280 }: {
  img: string; title: string; children: React.ReactNode; minH?: number;
}) {
  return (
    <div style={{ position:"relative", borderRadius:"8px", overflow:"hidden", border:"1px solid rgba(0,122,81,0.2)", minHeight:minH }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:`url('/${img}')`, backgroundSize:"cover", backgroundPosition:"center", opacity:0.4 }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,5,2,0.35) 0%, rgba(0,5,2,0.78) 100%)" }} />
      <div style={{ position:"relative", zIndex:1, padding:"18px 20px", height:"100%", display:"flex", flexDirection:"column" }}>
        <p style={{ fontSize:"9px", fontWeight:700, color:"#007A51", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"14px", fontFamily:"var(--font-museo), sans-serif" }}>
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}


// ─── Overlay num círculo do revólver ─────────────────────────────────────────
function AttrCircleOverlay({
  attrId, label, color, value, onChange, top, left,
}: {
  label: string; color: string;
  value: number; onChange: (v: number) => void;
  top: string; left: string;
}) {
  const MAX = 2;
  return (
    <div style={{
      position: "absolute",
      top, left,
      transform: "translate(-50%, -50%)",
      zIndex: 3,
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: "5px",
    }}>
      {/* Controles + número */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          style={{
            width:28, height:28, borderRadius:"50%",
            background: value > 0 ? `${color}22` : "rgba(0,0,0,0.5)",
            border: `2px solid ${value > 0 ? color + "80" : "rgba(255,255,255,0.15)"}`,
            color: value > 0 ? color : "rgba(255,255,255,0.25)",
            cursor: value > 0 ? "pointer" : "default",
            fontSize:"16px", lineHeight:1,
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:0, transition:"all 0.15s",
            backdropFilter:"blur(4px)",
          }}
        >−</button>

        <span style={{
          fontSize: "42px", fontWeight: 700,
          color: value > 0 ? color : "rgba(255,255,255,0.2)",
          fontFamily: "var(--font-museo), sans-serif",
          lineHeight: 1,
          textShadow: value > 0
            ? `0 0 20px ${color}, 0 2px 8px rgba(0,0,0,0.9)`
            : "0 2px 8px rgba(0,0,0,0.8)",
          transition: "all 0.2s",
          minWidth: "32px", textAlign: "center",
        }}>
          {value}
        </span>

        <button
          onClick={() => onChange(Math.min(MAX, value + 1))}
          disabled={value >= MAX}
          style={{
            width:28, height:28, borderRadius:"50%",
            background: value < MAX ? `${color}22` : "rgba(0,0,0,0.5)",
            border: `2px solid ${value < MAX ? color + "80" : "rgba(255,255,255,0.15)"}`,
            color: value < MAX ? color : "rgba(255,255,255,0.25)",
            cursor: value < MAX ? "pointer" : "default",
            fontSize:"16px", lineHeight:1,
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:0, transition:"all 0.15s",
            backdropFilter:"blur(4px)",
          }}
        >+</button>
      </div>

      {/* Label com fundo para legibilidade */}
      <div style={{
        background:"rgba(0,0,0,0.65)",
        backdropFilter:"blur(6px)",
        border:`1px solid ${value > 0 ? color + "50" : "rgba(255,255,255,0.1)"}`,
        borderRadius:"20px",
        padding:"3px 12px",
      }}>
        <span style={{
          fontSize: "10px", fontWeight: 700,
          color: value > 0 ? color : "rgba(255,255,255,0.35)",
          letterSpacing: "0.12em", textTransform: "uppercase",
          fontFamily: "var(--font-museo), sans-serif",
          transition: "color 0.15s",
        }}>{label}</span>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function FichaViewPage() {
  const router  = useRouter();
  const params  = useParams();
  const id      = params?.id as string;

  const [ficha,     setFicha]     = useState<Ficha | null | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<Tab>("combate");
  const [avatar,    setAvatar]    = useState<string | null>(null);
  const [saved,     setSaved]     = useState(false);
  const [expandedAnte, setExpandedAnte] = useState<string | null>(null);

  // Valores mutáveis
  const [attrs, setAttrs] = useState<Record<string,number>>({
    fisico:0, agilidade:0, intelecto:0, coragem:0,
  });
  const [antecedentes, setAntecedentes] = useState<Record<string,number>>({});

  useEffect(() => { if (id) setFicha(loadFichaById(id)); }, [id]);

  useEffect(() => {
    if (!id) return;
    try { const s = localStorage.getItem(`avatar_${id}`); if (s) setAvatar(s); } catch {}
  }, [id]);

  // Popula estado local quando a ficha carrega
  useEffect(() => {
    if (!ficha) return;
    const cd = ficha.data;
    setAttrs({
      fisico:    Number((cd["attributes"] as any)?.fisico)    || 0,
      agilidade: Number((cd["attributes"] as any)?.agilidade) || 0,
      intelecto: Number((cd["attributes"] as any)?.intelecto) || 0,
      coragem:   Number((cd["attributes"] as any)?.coragem)   || 0,
    });
    const before: Record<string,number> = {};
    Object.keys(ANTECEDENTES_META).forEach(k => {
      before[k] = Number((cd["antecedentes"] as any)?.[k]) || 0;
    });
    setAntecedentes(before);
  }, [ficha]);

  // Auto-save: persiste attrs e antecedentes de volta na ficha
  const autoSave = useCallback((
    newAttrs: Record<string,number>,
    newAntes: Record<string,number>,
    currentFicha: Ficha,
  ) => {
    const updated: Ficha = {
      ...currentFicha,
      updatedAt: new Date().toISOString(),
      data: {
        ...currentFicha.data,
        attributes:   { ...(currentFicha.data["attributes"] || {}), ...newAttrs },
        antecedentes: { ...(currentFicha.data["antecedentes"] || {}), ...newAntes },
      },
    };
    saveFichaToStorage(updated);
    setFicha(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }, []);

  const setAttr = (key: string, val: number) => {
    if (!ficha) return;
    const next = { ...attrs, [key]: val };
    setAttrs(next);
    autoSave(next, antecedentes, ficha);
  };

  const setAnte = (key: string, val: number) => {
    if (!ficha) return;
    const next = { ...antecedentes, [key]: val };
    setAntecedentes(next);
    autoSave(attrs, next, ficha);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatar(url);
      try { localStorage.setItem(`avatar_${id}`, url); } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setAvatar(null);
    if (id) try { localStorage.removeItem(`avatar_${id}`); } catch {}
  };

  // ── Loading / not found ──
  if (ficha === undefined) {
    return (
      <div style={{ minHeight:"100vh", background:"#070a08", color:"#c8e6c9", fontFamily:"var(--font-museo), sans-serif", display:"flex", flexDirection:"column" }}>
        <Header />
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:"13px", color:"#4a7a5a" }}>Carregando ficha...</span>
        </div>
      </div>
    );
  }
  if (!ficha) {
    return (
      <div style={{ minHeight:"100vh", background:"#070a08", color:"#c8e6c9", fontFamily:"var(--font-museo), sans-serif", display:"flex", flexDirection:"column" }}>
        <Header />
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"16px" }}>
          <p style={{ fontSize:"13px", color:"#4a7a5a" }}>Ficha não encontrada.</p>
          <button onClick={() => router.push("/fichas")} style={{ padding:"10px 22px", background:"#007A51", border:"none", color:"#e8f5e9", borderRadius:"3px", cursor:"pointer", fontSize:"13px", fontFamily:"var(--font-museo), sans-serif" }}>Voltar</button>
        </div>
      </div>
    );
  }

  const cd  = ficha.data;
  const raw: any = { ...(cd["character-basics"] || {}), escolhidas: (cd["habilidades"]?.["escolhidas"] as string[]) ?? [] };

  const nome      = String(raw["character-name"] || "Sem nome");
  const jogador   = String(raw["player-name"] || "—");
  const nivel     = Number(raw.nivel) || 1;
  const reputacao = Number(raw.reputacao) ?? 0;
  const escolhidas = (raw.escolhidas as string[]) || [];

  const { fisico, agilidade, intelecto, coragem } = attrs;
  const { text: reputLabel, color: reputColor } = getReputLabel(reputacao);
  const systemName = ficha.systemId === "som-das-seis" ? "Som das Seis" : ficha.systemId;

  const vida       = calcVida(fisico, nivel);
  const acoes      = calcAcoes(agilidade);
  const defesa     = calcDefesa(agilidade);
  const iniciativa = calcIniciativa(coragem);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id:"combate",      label:"Combate",      icon:<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2.5l7 7-7 7-7-7 7-7z"/><path d="M2 12l5 5"/><path d="M7 17l-5 5"/></svg> },
    { id:"habilidades",  label:"Habilidades",  icon:<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id:"equipamentos", label:"Equipamentos", icon:<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#070a08", color:"#c8e6c9", fontFamily:"var(--font-museo), sans-serif", overflowX:"hidden", position:"relative", display:"flex", flexDirection:"column" }}>
      <style>{`
        .fv-hero  { padding:40px 48px 0; }
        .fv-tabs  { padding:0 48px; }
        .fv-main  { padding:40px 48px 80px; }
        .fv-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .fv-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .fv-grid2r{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .fv-name  { font-size:52px; }
        .fv-vida  { font-size:64px; }
        .tab-btn  { transition:all 0.2s; }
        .tab-btn:hover { background:rgba(0,122,81,0.1) !important; }
        .attr-dot-btn:hover { filter:brightness(1.3); }
        .save-toast {
          position:fixed; bottom:28px; right:28px;
          background:rgba(0,122,81,0.18); border:1px solid rgba(0,122,81,0.4);
          backdrop-filter:blur(10px);
          color:#81c784; padding:10px 18px; border-radius:6px;
          font-size:12px; font-family:var(--font-museo),sans-serif;
          display:flex; align-items:center; gap:8px;
          z-index:999;
          animation: fadeInUp 0.25s ease, fadeOut 0.3s ease 1.3s forwards;
        }
        @keyframes fadeInUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeOut   { to   { opacity:0; transform:translateY(6px); } }
        @media(max-width:700px){
          .fv-hero  { padding:24px 20px 0 !important; }
          .fv-tabs  { padding:0 20px !important; }
          .fv-main  { padding:28px 20px 60px !important; }
          .fv-grid3 { grid-template-columns:1fr !important; }
          .fv-grid2 { grid-template-columns:1fr !important; }
          .fv-grid2r{ grid-template-columns:1fr !important; }
          .fv-name  { font-size:32px !important; }
          .fv-vida  { font-size:44px !important; }
          .fv-hero-row { flex-direction:column !important; align-items:flex-start !important; }
          .acoes-defesa-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* Toast de auto-save */}
      {saved && (
        <div className="save-toast">
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Salvo
        </div>
      )}

      <div style={{ position:"fixed", inset:0, backgroundImage:"radial-gradient(ellipse at 15% 30%,rgba(0,122,81,0.08) 0%,transparent 55%),radial-gradient(ellipse at 85% 75%,rgba(0,122,81,0.05) 0%,transparent 50%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", top:"68px", left:0, right:0, bottom:0, backgroundImage:"url('/velhoseis.webp')", backgroundSize:"cover", backgroundPosition:"center", opacity:0.04, pointerEvents:"none", zIndex:0 }} />

      <Header />

      {/* ══ HERO ══ */}
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }} className="fv-hero">
          <button onClick={() => router.push("/fichas")} style={{ background:"none", border:"none", color:"#4a7a5a", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", fontFamily:"var(--font-museo),sans-serif", marginBottom:"28px", padding:0, transition:"color 0.2s" }}
            onMouseEnter={e=>(e.currentTarget.style.color="#81c784")}
            onMouseLeave={e=>(e.currentTarget.style.color="#4a7a5a")}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Minhas Fichas
          </button>

          <div className="fv-hero-row" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:"32px", flexWrap:"wrap", paddingBottom:"28px", borderBottom:"1px solid rgba(0,122,81,0.12)" }}>
            {/* Avatar + texto */}
            <div style={{ display:"flex", alignItems:"flex-end", gap:"24px", flex:1, minWidth:0 }}>
              {/* Avatar */}
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{ width:96, height:96, borderRadius:"8px", border:"2px solid rgba(0,122,81,0.35)", overflow:"hidden", background:"rgba(0,15,8,0.8)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 24px rgba(0,0,0,0.5)" }}>
                  {avatar
                    ? <img src={avatar} alt="Avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="rgba(0,122,81,0.35)" strokeWidth="1.2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  }
                </div>
                <label style={{ position:"absolute", bottom:-7, right:-7, width:24, height:24, borderRadius:"50%", background:"#007A51", border:"2px solid #070a08", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 0 8px rgba(0,122,81,0.4)", transition:"background 0.2s" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="#00955f")}
                  onMouseLeave={e=>(e.currentTarget.style.background="#007A51")}
                  title={avatar ? "Trocar foto" : "Adicionar foto"}>
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#e8f5e9" strokeWidth="2.5" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display:"none" }} />
                </label>
                {avatar && (
                  <button onClick={handleAvatarRemove} style={{ position:"absolute", top:-7, right:-7, width:20, height:20, borderRadius:"50%", background:"rgba(180,40,40,0.85)", border:"2px solid #070a08", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", transition:"background 0.2s" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(220,50,50,0.95)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="rgba(180,40,40,0.85)")}>
                    <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>

              {/* Info */}
              <div style={{ minWidth:0 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"3px 10px", border:"1px solid rgba(0,122,81,0.25)", borderRadius:"20px", fontSize:"9px", fontWeight:700, color:"#007A51", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"10px" }}>
                  <div style={{ width:4, height:4, borderRadius:"50%", background:"#007A51", boxShadow:"0 0 5px #007A51" }} />
                  {systemName}
                </div>
                <h1 className="fv-name" style={{ fontWeight:700, color:"#e8f5e9", letterSpacing:"-0.03em", lineHeight:1.0, marginBottom:"10px" }}>{nome}</h1>
                <div style={{ display:"flex", gap:"16px", alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"13px", color:"#4a7a5a" }}>Jogador: <span style={{ color:"#81c784" }}>{jogador}</span></span>
                  <div style={{ width:1, height:13, background:"rgba(0,122,81,0.2)" }} />
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <span style={{ fontSize:"13px", color:"#4a7a5a" }}>Nível</span>
                    <div style={{ display:"flex", gap:"4px" }}>
                      {[1,2,3,4,5,6].map(n => (
                        <button key={n} onClick={() => {
                          if (!ficha) return;
                          const updated = { ...ficha, updatedAt:new Date().toISOString(), data:{ ...ficha.data, "character-basics":{ ...(ficha.data["character-basics"]||{}), nivel:n } } };
                          saveFichaToStorage(updated);
                          setFicha(updated);
                          setSaved(true);
                          setTimeout(()=>setSaved(false),1800);
                        }} style={{
                          width:24, height:24, borderRadius:"4px",
                          border: `1.5px solid ${n===nivel?"#007A51":"rgba(0,122,81,0.18)"}`,
                          background: n===nivel?"rgba(0,122,81,0.2)":"rgba(0,15,8,0.6)",
                          color: n===nivel?"#81c784":"#2d4a35",
                          fontSize:"11px", fontWeight:700,
                          fontFamily:"var(--font-museo),sans-serif",
                          cursor:"pointer", transition:"all 0.15s",
                          boxShadow: n===nivel?"0 0 8px rgba(0,122,81,0.3)":"none",
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ width:1, height:13, background:"rgba(0,122,81,0.2)" }} />
                  <span style={{ fontSize:"13px", color:"#4a7a5a" }}>Reputação: <span style={{ color:reputColor, fontWeight:700 }}>{reputLabel}</span></span>
                </div>
              </div>
            </div>

            {/* Vida */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"3px", flexShrink:0 }}>
              <span style={{ fontSize:"9px", fontWeight:700, color:"#c0392b", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"var(--font-museo),sans-serif" }}>Pontos de Vida</span>
              <span className="fv-vida" style={{ fontWeight:700, color:"#c0392b", fontFamily:"var(--font-museo),sans-serif", lineHeight:1, textShadow:"0 0 60px rgba(192,57,43,0.35)" }}>{vida}</span>
              <span style={{ fontSize:"10px", color:"rgba(192,57,43,0.4)" }}>base + {fisico} Físico × {nivel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div style={{ position:"relative", zIndex:1, borderBottom:"1px solid rgba(0,122,81,0.12)" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%", display:"flex", gap:"2px" }} className="fv-tabs">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)} style={{ padding:"14px 22px", background:active?"rgba(0,122,81,0.1)":"transparent", border:"none", borderBottom:`2px solid ${active?"#007A51":"transparent"}`, color:active?"#81c784":"#4a7a5a", cursor:"pointer", fontSize:"11px", fontWeight:active?700:400, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"var(--font-museo),sans-serif", display:"flex", alignItems:"center", gap:"7px", marginBottom:"-1px" }}>
                {tab.icon}{tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ CONTEÚDO ══ */}
      <main style={{ flex:1, position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }} className="fv-main">

          {/* ── TAB: COMBATE ── */}
          {activeTab === "combate" && (
            <div style={{ display:"flex", gap:"28px", alignItems:"flex-start" }} className="combate-cols">
              <style>{`
                .combate-cols { flex-direction: row; }
                .combate-left { flex: 1.4; min-width: 0; }
                .combate-right { width: 320px; flex-shrink: 0; }
                .stats-row { display: flex; gap: 12px; }
                @media(max-width:860px){
                  .combate-cols { flex-direction: column !important; }
                  .combate-right { width: 100% !important; }
                  .stats-row { flex-wrap: wrap; }
                  .stats-row > * { min-width: calc(50% - 6px); }
                }
              `}</style>

              {/* ══ COLUNA ESQUERDA ══ */}
              <div className="combate-left" style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

                {/* Revólver — imagem grande com overlays */}
                <div style={{ position:"relative", borderRadius:"10px", overflow:"hidden", border:"1px solid rgba(0,122,81,0.2)", background:"rgba(0,5,2,0.6)" }}>
                  <div style={{ position:"relative", paddingBottom:"95%", width:"100%" }}>
                    <div style={{ position:"absolute", inset:0 }}>
                      <div style={{ position:"absolute", inset:0, backgroundImage:"url('/atributosSS.png')", backgroundSize:"contain", backgroundPosition:"center", backgroundRepeat:"no-repeat", opacity:0.8 }} />
                      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(0,0,0,0.05) 40%, rgba(0,5,2,0.5) 100%)" }} />

                      {/* Label */}
                      <div style={{ position:"absolute", top:14, left:16, zIndex:2 }}>
                        <span style={{ fontSize:"9px", fontWeight:700, color:"#007A51", letterSpacing:"0.25em", textTransform:"uppercase", fontFamily:"var(--font-museo),sans-serif" }}>Atributos</span>
                      </div>

                      {/* INT — círculo topo-centro */}
                      <AttrCircleOverlay label="Intelecto" color="#2980b9"
                        value={attrs.intelecto ?? 0} onChange={v => setAttr("intelecto", v)}
                        top="21%" left="50%" />
                      {/* AGI — círculo meio-esquerda */}
                      <AttrCircleOverlay label="Agilidade" color="#d4a017"
                        value={attrs.agilidade ?? 0} onChange={v => setAttr("agilidade", v)}
                        top="48%" left="24%" />
                      {/* COR — círculo meio-direita */}
                      <AttrCircleOverlay label="Coragem" color="#8e44ad"
                        value={attrs.coragem ?? 0} onChange={v => setAttr("coragem", v)}
                        top="48%" left="76%" />
                      {/* FIS — círculo baixo-esquerda */}
                      <AttrCircleOverlay label="Físico" color="#c0392b"
                        value={attrs.fisico ?? 0} onChange={v => setAttr("fisico", v)}
                        top="75%" left="30%" />
                    </div>
                  </div>
                </div>

                {/* Stats: Ações + Defesa + Vida */}
                <div className="stats-row">
                  {/* Ações */}
                  <div style={{ flex:1, position:"relative", borderRadius:"8px", overflow:"hidden", border:"1px solid rgba(0,122,81,0.2)", minHeight:130 }}>
                    <div style={{ position:"absolute", inset:0, backgroundImage:"url('/acoesSS.png')", backgroundSize:"cover", backgroundPosition:"center", opacity:0.4 }} />
                    <div style={{ position:"absolute", inset:0, background:"rgba(0,5,2,0.55)" }} />
                    <div style={{ position:"relative", zIndex:1, padding:"14px 16px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                      <span style={{ fontSize:"9px", fontWeight:700, color:"#007A51", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"var(--font-museo),sans-serif" }}>Ações</span>
                      <div>
                        <span style={{ fontSize:"54px", fontWeight:700, color:"#2e7d6b", fontFamily:"var(--font-museo),sans-serif", lineHeight:1, textShadow:"0 0 20px rgba(46,125,107,0.5)" }}>{acoes}</span>
                        <p style={{ fontSize:"9px", color:"rgba(0,122,81,0.45)", marginTop:"2px" }}>1 + Agilidade ({agilidade})</p>
                      </div>
                    </div>
                  </div>

                  {/* Defesa */}
                  <div style={{ flex:1, position:"relative", borderRadius:"8px", overflow:"hidden", border:"1px solid rgba(212,160,23,0.25)", minHeight:130 }}>
                    <div style={{ position:"absolute", inset:0, backgroundImage:"url('/defesaSS.png')", backgroundSize:"cover", backgroundPosition:"center", opacity:0.45 }} />
                    <div style={{ position:"absolute", inset:0, background:"rgba(0,5,2,0.55)" }} />
                    <div style={{ position:"relative", zIndex:1, padding:"14px 16px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                      <span style={{ fontSize:"9px", fontWeight:700, color:"#d4a017", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"var(--font-museo),sans-serif" }}>Defesa</span>
                      <div>
                        <span style={{ fontSize:"54px", fontWeight:700, color:"#d4a017", fontFamily:"var(--font-museo),sans-serif", lineHeight:1, textShadow:"0 0 30px rgba(212,160,23,0.5)" }}>{defesa}</span>
                        <p style={{ fontSize:"9px", color:"rgba(212,160,23,0.45)", marginTop:"2px" }}>10 + Agilidade ({agilidade})</p>
                      </div>
                    </div>
                  </div>

                  {/* Iniciativa */}
                  <div style={{ flex:1, borderRadius:"8px", border:"1px solid rgba(142,68,173,0.25)", background:"rgba(0,5,2,0.7)", minHeight:130, padding:"14px 16px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"9px", fontWeight:700, color:"#8e44ad", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"var(--font-museo),sans-serif" }}>Iniciativa</span>
                    <div>
                      <span style={{ fontSize:"54px", fontWeight:700, color:"#8e44ad", fontFamily:"var(--font-museo),sans-serif", lineHeight:1, textShadow:"0 0 20px rgba(142,68,173,0.4)" }}>+{iniciativa}</span>
                      <p style={{ fontSize:"9px", color:"rgba(142,68,173,0.45)", marginTop:"2px" }}>Coragem ({coragem})</p>
                    </div>
                  </div>

                  {/* Vida */}
                  <div style={{ flex:1, borderRadius:"8px", border:"1px solid rgba(192,57,43,0.25)", background:"rgba(0,5,2,0.7)", minHeight:130, padding:"14px 16px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"9px", fontWeight:700, color:"#c0392b", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"var(--font-museo),sans-serif" }}>Vida</span>
                    <div>
                      <span style={{ fontSize:"54px", fontWeight:700, color:"#c0392b", fontFamily:"var(--font-museo),sans-serif", lineHeight:1, textShadow:"0 0 20px rgba(192,57,43,0.4)" }}>{vida}</span>
                      <p style={{ fontSize:"9px", color:"rgba(192,57,43,0.45)", marginTop:"2px" }}>base + {fisico}×{nivel}</p>
                    </div>
                  </div>
                </div>

                {/* Recursos */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  {[
                    { label:"Dinheiro",   value:`$ ${Number(raw.dinheiro)||0}`,   color:"#d4a017" },
                    { label:"Recompensa", value:`$ ${Number(raw.recompensa)||0}`, color:"#c07020" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ padding:"16px 20px", background:"rgba(0,10,5,0.7)", border:`1px solid ${color}20`, borderRadius:"6px" }}>
                      <p style={{ fontSize:"9px", fontWeight:700, color, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"6px", fontFamily:"var(--font-museo),sans-serif" }}>{label}</p>
                      <p style={{ fontSize:"24px", fontWeight:700, color:"#e8f5e9", fontFamily:"var(--font-museo),sans-serif" }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Tormento */}
                {raw.tormento && (
                  <div style={{ padding:"18px 20px", background:"rgba(0,8,4,0.6)", border:"1px solid rgba(0,122,81,0.12)", borderRadius:"8px" }}>
                    <p style={{ fontSize:"9px", fontWeight:700, color:"#007A51", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px", fontFamily:"var(--font-museo),sans-serif" }}>Tormento</p>
                    <p style={{ fontSize:"13px", color:"#4a7a5a", lineHeight:1.85, fontStyle:"italic", borderLeft:"2px solid rgba(0,122,81,0.2)", paddingLeft:"14px" }}>{raw.tormento}</p>
                  </div>
                )}
              </div>

              {/* ══ COLUNA DIREITA — antecedentes com expansão ══ */}
              <div className="combate-right" style={{ position:"sticky", top:"88px", position:"relative" } as any}>
                {/* Divisor vertical */}
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"1px", background:"linear-gradient(to bottom, transparent, rgba(0,122,81,0.3) 20%, rgba(0,122,81,0.3) 80%, transparent)" }} />

                <p style={{ fontSize:"9px", fontWeight:700, color:"#007A51", letterSpacing:"0.25em", textTransform:"uppercase", fontFamily:"var(--font-museo),sans-serif", marginBottom:"16px", paddingLeft:"20px" }}>Antecedentes</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px", paddingLeft:"20px" }}>
                  {Object.entries(ANTECEDENTES_META).map(([antId, { label, color, descricao }]) => {
                    const value = antecedentes[antId] ?? 0;
                    const expanded = expandedAnte === antId;
                    return (
                      <div key={antId} style={{ borderRadius:"6px", overflow:"hidden", border:`1px solid ${expanded ? color+"50" : value>0 ? color+"25" : "rgba(0,122,81,0.08)"}`, borderLeft:`3px solid ${value>0?color:"rgba(0,122,81,0.15)"}`, background:expanded?"rgba(0,8,4,0.95)":value>0?"rgba(0,10,5,0.82)":"rgba(0,5,2,0.4)", transition:"all 0.2s", opacity:value===0&&!expanded?0.5:1 }}>
                        {/* Linha principal */}
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 12px" }}>
                          {/* Nome clicável */}
                          <button onClick={() => setExpandedAnte(expanded ? null : antId)}
                            style={{ flex:1, background:"none", border:"none", cursor:"pointer", textAlign:"left", padding:0, display:"flex", alignItems:"center", gap:"8px" }}>
                            <span style={{ fontSize:"12px", fontWeight:700, color:value>0?"#c8e6c9":"#2d4a35", fontFamily:"var(--font-museo),sans-serif", transition:"color 0.2s" }}>{label}</span>
                            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={expanded?color:"rgba(0,122,81,0.3)"} strokeWidth="2.5" strokeLinecap="round"
                              style={{ flexShrink:0, transform:expanded?"rotate(180deg)":"rotate(0)", transition:"transform 0.25s, stroke 0.2s" }}>
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                          </button>
                          <ClickableDots value={value} max={5} color={color} maxAllowed={2} onChange={v => setAnte(antId, v)} />
                          <span style={{ fontSize:"15px", fontWeight:700, color:value>0?color:"#2d4a35", fontFamily:"var(--font-museo),sans-serif", minWidth:"14px", textAlign:"right", marginLeft:"4px" }}>{value}</span>
                        </div>

                        {/* Descrição expansível */}
                        <div style={{ maxHeight:expanded?"200px":"0", overflow:"hidden", transition:"max-height 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
                          <div style={{ padding:"0 12px 12px 12px", borderTop:`1px solid ${color}20` }}>
                            <div style={{ width:"100%", height:"1px", marginBottom:"10px" }} />
                            <p style={{ fontSize:"11px", color:"#4a7a5a", lineHeight:1.7, fontFamily:"var(--font-museo),sans-serif" }}>{descricao}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: HABILIDADES ── */}
          {activeTab === "habilidades" && (
            <div>
              <SectionTitle>Habilidades</SectionTitle>
              {escolhidas.length === 0 ? (
                <p style={{ fontSize:"13px", color:"#2d4a35", fontStyle:"italic" }}>Nenhuma habilidade escolhida.</p>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  {escolhidas.map(habId => {
                    const h = HABILIDADES_MAP[habId];
                    if (!h) return null;
                    return (
                      <div key={habId} style={{ padding:"18px 22px", background:"rgba(0,8,4,0.7)", border:`1px solid ${h.tagColor}20`, borderLeft:`3px solid ${h.tagColor}`, borderRadius:"6px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
                          <span style={{ fontSize:"15px", fontWeight:700, color:"#e8f5e9", fontFamily:"var(--font-museo),sans-serif" }}>{h.nome}</span>
                          <span style={{ fontSize:"8px", fontWeight:700, color:h.tagColor, border:`1px solid ${h.tagColor}35`, borderRadius:"20px", padding:"2px 7px", letterSpacing:"0.1em", textTransform:"uppercase" }}>{h.tag}</span>
                        </div>
                        <p style={{ fontSize:"12px", color:"#4a7a5a", lineHeight:1.6 }}>{h.resumo}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: EQUIPAMENTOS ── */}
          {activeTab === "equipamentos" && (
            <div>
              <SectionTitle>Equipamentos</SectionTitle>
              <div style={{ padding:"56px 40px", background:"rgba(0,8,4,0.5)", border:"1px dashed rgba(0,122,81,0.15)", borderRadius:"8px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"14px" }}>
                <div style={{ width:48, height:48, borderRadius:"50%", border:"1px dashed rgba(0,122,81,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="rgba(0,122,81,0.3)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                </div>
                <p style={{ fontSize:"13px", color:"#2d4a35", fontStyle:"italic" }}>Sistema de equipamentos em breve.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}