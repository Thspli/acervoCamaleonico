'use client';

import React, { useState } from 'react';

const MAX_CHOICES = 2;

type HabilidadeTag = "combate" | "furtividade" | "social" | "suporte" | "utilidade" | "especial";

interface Habilidade {
  id: string;
  nome: string;
  resumo: string;
  descricao: string;
  tags: HabilidadeTag[];
}

const HABILIDADES: Habilidade[] = [
  {
    id: "light-my-fire",
    nome: "Light My Fire",
    resumo: "+1 no teste com revólver e +1 de dano por Agilidade.",
    tags: ["combate"],
    descricao: `Eles são a doença e você é a cura. Se você não fosse tão rápido e mortal no gatilho, já estaria na terra do pé-junto.\n\nSempre que atirar com seu revólver você recebe +1 para fazer o teste. Você também adiciona +1 no dano para cada ponto de Agilidade que tiver.`,
  },
  {
    id: "lets-dance",
    nome: "Let's Dance",
    resumo: "Dois disparos em uma ação com -1 no teste (martelo).",
    tags: ["combate"],
    descricao: `Martelar o cão é puxar o gatilho e bater na parte da arma que empurra a bala para fora do tambor. Isso era feito para atirar com mais velocidade e menos precisão.\n\nÉ possível fazer dois disparos com uma única ação, mas com penalidade de -1 para seu teste no Antecedente Combate.`,
  },
  {
    id: "fortunate-son",
    nome: "Fortunate Son",
    resumo: "Ao cair a 0 PVs, recupera 3 PVs e levanta — uma vez por combate.",
    tags: ["combate", "especial"],
    descricao: `Se a morte abraçar sua personagem e ela cair a ZERO Pontos de Vida em um combate, esta habilidade lhe recupera 3 PVs e ela se levanta no turno seguinte para continuar sua jornada.\n\nMas se ela tornar a cair no mesmo combate, a morte não vai deixá-la escapar novamente.`,
  },
  {
    id: "dont-stop-believing",
    nome: "Don't Stop Believing",
    resumo: "+1 no teste com armas longas e +1 de dano por Intelecto.",
    tags: ["combate"],
    descricao: `Ao atirar com armas de longa distância, como espingardas ou arcos longos, adicione +1 no teste para acertar o inimigo. Além disso, some +1 no dano para cada ponto de Inteligência.`,
  },
  {
    id: "immigrant-song",
    nome: "Immigrant Song",
    resumo: "Ataques desarmados passam de 1d3 para 1d6, +1 por Físico.",
    tags: ["combate"],
    descricao: `Seja por força ou técnica. Na graça ou na brutalidade. Esta habilidade lhe dá capacidade de machucar ainda mais seus oponentes com ataques desarmados.\n\nEm vez de 1d3, o dano passa a ser 1d6, além de somar +1 no dano para cada ponto em Físico.`,
  },
  {
    id: "gimme-shelter",
    nome: "Gimme Shelter",
    resumo: "Ataques surpresa com faca causam +1d6 a cada 2 níveis.",
    tags: ["combate", "furtividade"],
    descricao: `Sempre que fizer um ataque em um inimigo pego de surpresa, e estiver usando facas ou navalhas, seu ataque causa dano furtivo extra conforme avança de nível:\n\n• Nível 1–2: +1d6\n• Nível 4: +2d6\n• Nível 6: +3d6\n• Nível 8: +4d6`,
  },
  {
    id: "another-one-bites-the-dust",
    nome: "Another One Bites the Dust",
    resumo: "Aprenda um estilo de luta corpo a corpo. Pode ser tomada mais de uma vez.",
    tags: ["combate", "especial"],
    descricao: `A personagem pode escolher uma das manobras abaixo para usar no combate. São "estilos de luta", então servem apenas para golpes desarmados. Você pode pegar esta habilidade mais de uma vez.\n\n• RASTEIRA: teste contra o oponente que, se derrotado, cai no chão e gasta uma ação para levantar.\n• SUPLEX: teste contra o oponente que, se perder, é arremessado, tomando 2d6 de dano.\n• BRIGA DE BAR: use qualquer objeto como arma. Pequenos causam 1d6+1, médios 1d6+2, grandes 1d6+3.\n• TAPA COM AS COSTAS DA MÃO: deixa o inimigo pasmo, gastando uma ação para se recuperar.\n• KUNG-FU: 3 golpes desarmados com uma ação, com -1 no teste para acertar.`,
  },
  {
    id: "riders-on-the-storm",
    nome: "Riders on the Storm",
    resumo: "Sacrifica PVs para aumentar dano corpo a corpo em +1d6 por 3 PVs. Uma vez por combate.",
    tags: ["combate"],
    descricao: `Sacrifique a própria segurança para cortar o mal pela raiz. Aumente o dano do ataque corpo a corpo em +1d6 por nível a cada 3 Pontos de Vida sacrificados.\n\nSua personagem abre a guarda enquanto ataca com mais brutalidade. Essa habilidade pode ser usada apenas uma vez por combate.`,
  },
  {
    id: "born-to-be-wild",
    nome: "Born to Be Wild",
    resumo: "+1 em testes de furtividade e percepção.",
    tags: ["furtividade"],
    descricao: `A personagem sabe aproveitar luzes e sombras para se camuflar e caminhar furtivamente, ao mesmo tempo que tem atenção redobrada para notar o que não deveria estar ali.\n\nSempre que fizer teste de algum Antecedente que envolva ser furtivo ou perceber alguma coisa, some +1 ao resultado.`,
  },
  {
    id: "smoke-on-the-water",
    nome: "Smoke on the Water",
    resumo: "+1 em testes e +1 de dano por Físico com armas rústicas.",
    tags: ["combate"],
    descricao: `Você é especialista em armas rústicas e tradicionais: facas de pedra, lanças, machadinhas, porretes ou algo de metal mais rudimentar.\n\nSempre que fizer um ataque com este tipo de arma, você recebe +1 nos testes para acertar, além de +1 no dano para cada ponto no Atributo Físico.`,
  },
  {
    id: "under-pressure",
    nome: "Under Pressure",
    resumo: "+1 em resistências e +1 PV por Físico ao descansar.",
    tags: ["utilidade"],
    descricao: `Viver na natureza tornou seu corpo resistente a venenos e outras malezas. Sempre que precisar fazer um teste para resistir a qualquer fator adverso, some +1 no seu Atributo Físico.\n\nAlém disso, ao recuperar Pontos de Vida em descanso, você soma +1 Ponto de Vida para cada ponto em Físico somado à rolagem de dado.`,
  },
  {
    id: "heartbreaker",
    nome: "Heartbreaker",
    resumo: "Uma vez por sessão, alvo(s) têm -1 contra você ou um aliado.",
    tags: ["social"],
    descricao: `Sua personagem pode se apresentar inocente, sedutora, simpática ou até intimidadora ao oponente.\n\nUma vez por sessão, escolha um alvo por nível — este terá -1 para realizar qualquer ação ofensiva contra sua personagem. Você também pode escolher outro membro do grupo para receber esta vantagem no seu lugar.`,
  },
  {
    id: "barracuda",
    nome: "Barracuda",
    resumo: "+1 por nível (máx 5) para descobrir informações sobre pessoas ou lugares.",
    tags: ["social", "utilidade"],
    descricao: `Muitas vezes obter informações sobre seus inimigos pode te dar vantagens na hora de resolver conflitos. Você tem mais contatos e sabe conseguir respostas sem levantar suspeitas.\n\nVocê tem +1 por nível (máximo 5) nos testes para descobrir coisas sobre algo, alguém ou algum lugar.`,
  },
  {
    id: "sweet-emotion",
    nome: "Sweet Emotion",
    resumo: "Inspire aliados com bônus crescentes de ação, PV temporário ou ataque.",
    tags: ["suporte", "especial"],
    descricao: `Você sabe inspirar seus aliados em momentos difíceis. Bônus por nível (acumulativos):\n\n• Nível 1: +1 ação em combate (1x/sessão)\n• Nível 2: +1d6 em PVs temporários (1x/sessão)\n• Nível 3: +1 em testes de ataque (2x/sessão)\n• Nível 4: +2 em testes de ataque (2x/sessão)\n• Nível 5: +2d6 em vida temporários (3x/sessão)\n• Nível 6: +1 jogada em teste de morte (4x/sessão)`,
  },
  {
    id: "crazy-train",
    nome: "Crazy Train",
    resumo: "Uma vez por nível, aumente dano de uma arma em +1d6 — ela quebra após o combate.",
    tags: ["utilidade", "combate"],
    descricao: `Se tiver as peças, sua personagem pode criar pequenas engenhocas e mecanismos.\n\nUma vez por nível sua personagem pode aumentar o dano de uma arma de fogo em até +1d6. Infelizmente, a arma aguenta ser usada em apenas um combate, depois ela quebra e fica inutilizável.`,
  },
  {
    id: "carry-on",
    nome: "Carry On My Wayward Son",
    resumo: "Rejogue testes fracassados — uma vez por nível por sessão. Pode ceder a aliados.",
    tags: ["especial", "utilidade"],
    descricao: `Às vezes a sorte abre aquele sorrisão para os fodidos. A cada sessão você pode rejogar testes que deram errado. O número de rejogadas é igual ao seu nível.\n\nVocê também pode optar por gastar essa habilidade com outra pessoa, dando a ela uma chance de refazer um teste. Agarre a sorte e não deixe de ser cowboy por ela.`,
  },
  {
    id: "war-pigs",
    nome: "War Pigs",
    resumo: "+1 no teste com explosivos e +1 de dano por Intelecto.",
    tags: ["combate"],
    descricao: `Você gosta de ver chama voar e fogo no céu. Sempre que utilizar TNT, dinamite, nitroglicerina ou qualquer explosivo, seu personagem ganha +1 no teste de Antecedente para fazer BOOOOM!\n\nAlém de +1 no dano das bombas para cada ponto em Intelecto.`,
  },
  {
    id: "ace-of-spades",
    nome: "Ace of Spades",
    resumo: "+1 em testes de Roubo para trapacear ou detectar trapaça em jogos.",
    tags: ["furtividade", "social"],
    descricao: `Você tem a sagacidade aguçada para um carteado do bom. Sempre que quiser trapacear ou perceber alguém roubando no poker ou em qualquer outra jogatina, receba +1 em testes do Antecedente Roubo.`,
  },
  {
    id: "a-horse-with-no-name",
    nome: "A Horse with No Name",
    resumo: "+1 em todos os testes com sua própria montaria.",
    tags: ["utilidade"],
    descricao: `Você e sua montaria estão sempre em sincronia. Todos os testes para cavalgar, saltar, ou controlar sua montaria têm bônus de +1.\n\nEsta habilidade vale apenas para montaria própria, não para qualquer uma.`,
  },
  {
    id: "i-want-to-hold-your-hand",
    nome: "I Want to Hold Your Hand",
    resumo: "Cura +1d6 PVs por nível ao tratar aliados ou a si mesma.",
    tags: ["suporte"],
    descricao: `Sua personagem tem vasta experiência para remendar pessoas, fechar feridas, fazer pontos e remover balas.\n\nSempre que ajudar alguém a se curar, ou curar a si mesma, adicione 1d6 PVs por nível durante seus tratamentos.`,
  },
  {
    id: "paranoid",
    nome: "Paranoid",
    resumo: "+1 em Iniciativa. Nunca é pega de surpresa.",
    tags: ["combate", "utilidade"],
    descricao: `Sua personagem é desconfiada e atenta, ela pressente o perigo e se adianta.\n\nEsta habilidade garante +1 nos seus resultados de Iniciativa. Sua personagem nunca é pega desprevenida.`,
  },
  {
    id: "ramble-on",
    nome: "Ramble On",
    resumo: "Move-se duas vezes com uma ação e +1 em testes de fuga.",
    tags: ["furtividade", "utilidade"],
    descricao: `Não é covardia, é sobrevivência. Por que ficar e morrer se é possível dar no pé e ver o sol nascer outra vez?\n\nVocê gasta uma única ação para se mover duas vezes, e também tem +1 em testes para situações de fuga.`,
  },
  {
    id: "aqualung",
    nome: "Aqualung",
    resumo: "+1 em testes atléticos: natação, escalada, salto e afins.",
    tags: ["utilidade"],
    descricao: `A natureza é familiar a você, assim como seus desafios e perigos. Você sabe nadar muito bem, escalar e subir em árvores com muita facilidade.\n\nSempre que fizer testes que envolvam habilidades atléticas, como natação, escalar, subir, saltar e coisas do tipo, você tem bônus de +1 para o resultado do dado.`,
  },
  {
    id: "more-than-a-feeling",
    nome: "More Than a Feeling",
    resumo: "Teste de Negócios para fazer 2 perguntas à Juíza sobre alguém. Uma vez por sessão.",
    tags: ["social"],
    descricao: `Você é boa em ler pessoas e saber se elas estão mentindo ou escondendo alguma coisa.\n\nCaso esteja desconfiada de alguém, a personagem pode fazer um teste de Antecedente em Negócios e, se passar, pode fazer duas perguntas à Juíza para descobrir informações importantes. Essa habilidade pode ser usada só uma vez por sessão.`,
  },
];

const TAG_CONFIG: Record<HabilidadeTag, { label: string; color: string; bg: string }> = {
  combate:     { label: "Combate",     color: "#c0392b", bg: "rgba(192,57,43,0.12)"   },
  furtividade: { label: "Furtividade", color: "#8e44ad", bg: "rgba(142,68,173,0.12)"  },
  social:      { label: "Social",      color: "#c07020", bg: "rgba(192,112,32,0.12)"  },
  suporte:     { label: "Suporte",     color: "#2e7d6b", bg: "rgba(46,125,107,0.12)"  },
  utilidade:   { label: "Utilidade",   color: "#2980b9", bg: "rgba(41,128,185,0.12)"  },
  especial:    { label: "Especial",    color: "#d4a017", bg: "rgba(212,160,23,0.12)"  },
};

const FILTERS: Array<{ id: HabilidadeTag | "todas"; label: string }> = [
  { id: "todas",       label: "Todas"       },
  { id: "combate",     label: "Combate"     },
  { id: "furtividade", label: "Furtividade" },
  { id: "social",      label: "Social"      },
  { id: "suporte",     label: "Suporte"     },
  { id: "utilidade",   label: "Utilidade"   },
  { id: "especial",    label: "Especial"    },
];

function TagBadge({ tag }: { tag: HabilidadeTag }) {
  const cfg = TAG_CONFIG[tag];
  return (
    <span style={{
      fontSize: "8px", fontWeight: 700,
      color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}30`,
      borderRadius: "10px", padding: "2px 6px",
      letterSpacing: "0.1em", textTransform: "uppercase",
      fontFamily: "var(--font-museo), sans-serif",
      whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  );
}

function HabilidadeCard({
  hab, selected, onToggle, disabled, expanded, onExpandToggle,
}: {
  hab: Habilidade; selected: boolean; onToggle: () => void;
  disabled: boolean; expanded: boolean; onExpandToggle: () => void;
}) {
  const [hover, setHover] = useState(false);
  const primaryColor = TAG_CONFIG[hab.tags[0]].color;
  const primaryGlow  = primaryColor + "40";
  const isClickable  = selected || !disabled;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${selected ? primaryColor + "80" : hover && isClickable ? "rgba(0,122,81,0.4)" : "rgba(0,122,81,0.15)"}`,
        borderRadius: "5px", overflow: "hidden",
        transition: "border-color 0.2s",
        background: selected ? `linear-gradient(135deg, rgba(0,10,5,0.95), ${primaryColor}0a)` : "rgba(0,10,5,0.6)",
        opacity: disabled && !selected ? 0.4 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "stretch", minHeight: "58px" }}>
        {/* Acento lateral */}
        <div style={{
          width: 3, flexShrink: 0,
          background: selected ? `linear-gradient(180deg, ${primaryColor}, ${primaryColor}55)` : "rgba(0,122,81,0.1)",
          transition: "background 0.25s",
        }} />

        {/* Checkbox */}
        <button
          onClick={isClickable ? onToggle : undefined}
          disabled={!isClickable}
          style={{
            width: 50, flexShrink: 0, background: "transparent", border: "none",
            cursor: isClickable ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { if (isClickable) e.currentTarget.style.background = `${primaryColor}10`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: "4px",
            border: `2px solid ${selected ? primaryColor : "rgba(0,122,81,0.25)"}`,
            background: selected ? primaryColor : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
            boxShadow: selected ? `0 0 10px ${primaryGlow}` : "none",
          }}>
            {selected && (
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </button>

        {/* Conteúdo */}
        <div style={{ flex: 1, padding: "10px 8px 10px 0", display: "flex", flexDirection: "column", justifyContent: "center", gap: "5px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "13px", fontWeight: 700,
              color: selected ? "#e8f5e9" : hover ? "#c8e6c9" : "#81c784",
              fontFamily: "var(--font-museo), sans-serif",
              transition: "color 0.2s",
            }}>
              {hab.nome}
            </span>
            {hab.tags.map(t => <TagBadge key={t} tag={t} />)}
          </div>
          <span style={{
            fontSize: "11px",
            color: selected ? "#4a7a5a" : "#2d4a35",
            fontFamily: "var(--font-museo), sans-serif",
            lineHeight: 1.4, transition: "color 0.2s",
          }}>
            {hab.resumo}
          </span>
        </div>

        {/* Botão expandir */}
        <button
          onClick={onExpandToggle}
          style={{
            width: 42, flexShrink: 0, background: expanded ? `${primaryColor}12` : "transparent",
            border: "none", borderLeft: `1px solid ${expanded ? primaryColor + "25" : "rgba(0,122,81,0.08)"}`,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: expanded ? primaryColor : "#2d4a35", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${primaryColor}18`; e.currentTarget.style.color = primaryColor; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = expanded ? `${primaryColor}12` : "transparent"; e.currentTarget.style.color = expanded ? primaryColor : "#2d4a35"; }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Descrição expansível */}
      <div style={{ maxHeight: expanded ? "600px" : "0px", overflow: "hidden", transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{
          padding: "14px 18px 16px 52px",
          borderTop: `1px solid ${primaryColor}20`,
          background: `linear-gradient(135deg, rgba(0,8,4,0.97), ${primaryColor}06)`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <div style={{ width: 3, height: 14, borderRadius: "2px", background: primaryColor, boxShadow: `0 0 6px ${primaryGlow}` }} />
            <span style={{ fontSize: "9px", fontWeight: 700, color: primaryColor, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "var(--font-museo), sans-serif" }}>
              Descrição
            </span>
          </div>
          {hab.descricao.split("\n\n").map((para, i, arr) => (
            <p key={i} style={{
              fontSize: "12px", color: "#4a7a5a",
              lineHeight: 1.75, fontFamily: "var(--font-museo), sans-serif",
              marginBottom: i < arr.length - 1 ? "8px" : 0,
              whiteSpace: "pre-line",
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

interface HabilidadesStepProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function HabilidadesStep({ selected, onChange }: HabilidadesStepProps) {
  const [filter, setFilter] = useState<HabilidadeTag | "todas">("todas");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const remaining = MAX_CHOICES - selected.length;
  const filtered  = filter === "todas" ? HABILIDADES : HABILIDADES.filter(h => h.tags.includes(filter));

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else if (selected.length < MAX_CHOICES) {
      onChange([...selected, id]);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

      {/* Coluna principal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", paddingBottom: "4px" }}>
          {FILTERS.map(f => {
            const active = filter === f.id;
            const color  = f.id !== "todas" ? TAG_CONFIG[f.id as HabilidadeTag].color : "#007A51";
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as HabilidadeTag | "todas")}
                style={{
                  padding: "4px 12px", fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "var(--font-museo), sans-serif",
                  border: `1px solid ${active ? color + "60" : "rgba(0,122,81,0.15)"}`,
                  borderRadius: "20px",
                  background: active ? `${color}15` : "transparent",
                  color: active ? color : "#2d4a35",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(0,122,81,0.3)"; e.currentTarget.style.color = "#4a7a5a"; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(0,122,81,0.15)"; e.currentTarget.style.color = "#2d4a35"; }}}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Lista */}
        {filtered.map(hab => (
          <HabilidadeCard
            key={hab.id}
            hab={hab}
            selected={selected.includes(hab.id)}
            onToggle={() => toggle(hab.id)}
            disabled={remaining === 0 && !selected.includes(hab.id)}
            expanded={expandedId === hab.id}
            onExpandToggle={() => setExpandedId(prev => prev === hab.id ? null : hab.id)}
          />
        ))}
      </div>

      {/* Painel lateral */}
      <div style={{ width: "168px", flexShrink: 0, position: "sticky", top: "88px" }}>
        <div style={{
          background: "rgba(0,10,5,0.7)",
          border: "1px solid rgba(0,122,81,0.2)",
          borderRadius: "6px", padding: "18px",
          backdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column", gap: "12px",
        }}>
          <div style={{
            fontSize: "9px", fontWeight: 700, color: "#007A51",
            letterSpacing: "0.18em", textTransform: "uppercase",
            fontFamily: "var(--font-museo), sans-serif",
            paddingBottom: "10px", borderBottom: "1px solid rgba(0,122,81,0.12)",
          }}>
            Escolhas
          </div>

          {/* Indicador circular */}
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "8px" }}>
              {Array.from({ length: MAX_CHOICES }).map((_, i) => (
                <div key={i} style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: `2px solid ${i < selected.length ? "#007A51" : "rgba(0,122,81,0.2)"}`,
                  background: i < selected.length ? "#007A51" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.25s",
                  boxShadow: i < selected.length ? "0 0 12px rgba(0,122,81,0.45)" : "none",
                }}>
                  {i < selected.length && (
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <span style={{
              fontSize: "11px", fontWeight: 700,
              color: remaining === 0 ? "#81c784" : "#4a7a5a",
              fontFamily: "var(--font-museo), sans-serif",
            }}>
              {remaining === 0 ? "✓ Completo" : `${remaining} restante${remaining > 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Habilidades escolhidas */}
          {selected.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(0,122,81,0.1)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {selected.map(id => {
                const hab = HABILIDADES.find(h => h.id === id)!;
                const color = TAG_CONFIG[hab.tags[0]].color;
                return (
                  <div key={id} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, marginTop: 5, flexShrink: 0, boxShadow: `0 0 4px ${color}` }} />
                    <span style={{ fontSize: "10px", color: "#81c784", fontFamily: "var(--font-museo), sans-serif", lineHeight: 1.4 }}>
                      {hab.nome}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{
            marginTop: "auto", padding: "8px 10px",
            background: "rgba(0,122,81,0.04)",
            border: "1px solid rgba(0,122,81,0.1)",
            borderRadius: "3px",
          }}>
            <p style={{ fontSize: "9px", color: "#2d4a35", lineHeight: 1.5, fontFamily: "var(--font-museo), sans-serif", margin: 0 }}>
              Escolha <strong style={{ color: "#4a7a5a" }}>{MAX_CHOICES}</strong> habilidades no nível 1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}