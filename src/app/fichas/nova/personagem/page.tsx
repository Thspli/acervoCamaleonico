"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../../components/Header";

const STEPS = [
  { id: 1, label: "Sistema"    },
  { id: 2, label: "Personagem" },
  { id: 3, label: "Atributos"  },
  { id: 4, label: "Revisão"    },
];

// ——— Linha de passos ———
function StepBar({ current }: { current: number }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "28px 0 36px",
    }}>
      {STEPS.map((step, i) => {
        const done   = step.id < current;
        const active = step.id === current;

        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && (
              <div style={{
                width: "80px", height: "1px",
                background: done || active
                  ? "linear-gradient(90deg, #007A51, rgba(0,122,81,0.4))"
                  : "rgba(0,122,81,0.15)",
                transition: "background 0.4s",
              }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: `2px solid ${active ? "#007A51" : done ? "#007A51" : "rgba(0,122,81,0.2)"}`,
                background: active ? "rgba(0,122,81,0.15)" : done ? "#007A51" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
                boxShadow: active ? "0 0 14px rgba(0,122,81,0.4)" : "none",
              }}>
                {done ? (
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: active ? "#81c784" : "rgba(0,122,81,0.35)", fontFamily: "var(--font-museo), sans-serif" }}>
                    {step.id}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: "10px", fontWeight: active ? 700 : 400,
                color: active ? "#81c784" : done ? "#007A51" : "rgba(0,122,81,0.3)",
                letterSpacing: "0.1em", textTransform: "uppercase",
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

// ——— Componentes de campo ———
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: "10px", fontWeight: 700,
      color: "#007A51", letterSpacing: "0.14em",
      textTransform: "uppercase",
      fontFamily: "var(--font-museo), sans-serif",
    }}>
      {children}
    </span>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: "10px", color: "#2d4a35", letterSpacing: "0.04em", lineHeight: 1.4 }}>
      {children}
    </span>
  );
}

const baseInput: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(0,15,8,0.85)",
  border: "1px solid rgba(0,122,81,0.25)",
  borderRadius: "3px",
  color: "#c8e6c9",
  fontSize: "14px",
  outline: "none",
  fontFamily: "var(--font-museo), sans-serif",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function TextInput({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={baseInput}
      onFocus={(e) => { e.target.style.borderColor = "#007A51"; e.target.style.boxShadow = "0 0 0 3px rgba(0,122,81,0.08)"; }}
      onBlur={(e)  => { e.target.style.borderColor = "rgba(0,122,81,0.25)"; e.target.style.boxShadow = "none"; }}
    />
  );
}

// Spinner numérico com botões + / -
function NumberSpinner({ value, onChange, min = 0, max = 999, label, hint }: {
  value: number; onChange: (v: number) => void;
  min?: number; max?: number; label: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);

  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{
        display: "flex", alignItems: "center",
        border: `1px solid ${focused ? "#007A51" : "rgba(0,122,81,0.25)"}`,
        borderRadius: "3px", overflow: "hidden",
        boxShadow: focused ? "0 0 0 3px rgba(0,122,81,0.08)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        background: "rgba(0,15,8,0.85)",
      }}>
        <button
          onClick={dec}
          style={{
            width: 38, height: 42, background: "transparent",
            border: "none", borderRight: "1px solid rgba(0,122,81,0.15)",
            color: "rgba(0,122,81,0.6)", cursor: "pointer",
            fontSize: "18px", lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s, color 0.15s",
            fontFamily: "var(--font-museo), sans-serif",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,122,81,0.08)"; e.currentTarget.style.color = "#81c784"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(0,122,81,0.6)"; }}
        >−</button>

        <input
          type="number"
          value={value}
          min={min} max={max}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: "none", background: "transparent",
            color: "#c8e6c9", fontSize: "15px", fontWeight: 600,
            textAlign: "center", outline: "none",
            fontFamily: "var(--font-museo), sans-serif",
            MozAppearance: "textfield",
          } as React.CSSProperties}
        />

        <button
          onClick={inc}
          style={{
            width: 38, height: 42, background: "transparent",
            border: "none", borderLeft: "1px solid rgba(0,122,81,0.15)",
            color: "rgba(0,122,81,0.6)", cursor: "pointer",
            fontSize: "18px", lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s, color 0.15s",
            fontFamily: "var(--font-museo), sans-serif",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,122,81,0.08)"; e.currentTarget.style.color = "#81c784"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(0,122,81,0.6)"; }}
        >+</button>
      </div>
      {hint && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}

// Campo de moeda
function MoneyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        style={{ ...baseInput, paddingLeft: "40px" }}
        onFocus={(e) => { e.target.style.borderColor = "#007A51"; e.target.style.boxShadow = "0 0 0 3px rgba(0,122,81,0.08)"; }}
        onBlur={(e)  => { e.target.style.borderColor = "rgba(0,122,81,0.25)"; e.target.style.boxShadow = "none"; }}
      />
      <span style={{
        position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
        fontSize: "13px", color: "rgba(0,122,81,0.6)", fontWeight: 700,
        pointerEvents: "none", fontFamily: "var(--font-museo), sans-serif",
      }}>
        ⬡
      </span>
    </div>
  );
}

// Divider com título de seção
function SectionDivider({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "8px 0 4px" }}>
      <span style={{ fontSize: "10px", color: "rgba(0,122,81,0.5)", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap", fontFamily: "var(--font-museo), sans-serif" }}>
        {title}
      </span>
      <div style={{ flex: 1, height: "1px", background: "rgba(0,122,81,0.12)" }} />
    </div>
  );
}

// ——— Página ———
export default function PersonagemPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const sistema      = searchParams.get("sistema") ?? "som-das-seis";

  const [nome,       setNome]       = useState("");
  const [nivel,      setNivel]      = useState(1);
  const [tormento,   setTormento]   = useState(0);
  const [recompensa, setRecompensa] = useState(0);
  const [reputacao,  setReputacao]  = useState(0);
  const [dinheiro,   setDinheiro]   = useState("");

  const canAdvance = nome.trim().length > 0;

  const handleNext = () => {
    if (!canAdvance) return;
    const params = new URLSearchParams({
      sistema,
      nome: nome.trim(),
      nivel: String(nivel),
      tormento: String(tormento),
      recompensa: String(recompensa),
      reputacao: String(reputacao),
      dinheiro,
    });
    router.push(`/fichas/nova/atributos?${params.toString()}`);
  };

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
      <div style={{
        position: "fixed", top: "68px", left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/velhoseis.webp')",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.08, pointerEvents: "none", zIndex: 0,
      }} />

      <Header />

      <main style={{ flex: 1, position: "relative", zIndex: 1, maxWidth: "760px", margin: "0 auto", width: "100%", padding: "0 48px 80px" }}>

        <StepBar current={2} />

        {/* Título */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <p style={{ fontSize: "11px", color: "#007A51", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "10px" }}>
            Passo 2 de {STEPS.length}
          </p>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#e8f5e9", letterSpacing: "-0.01em", marginBottom: "8px" }}>
            Dados do Personagem
          </h2>
          <p style={{ fontSize: "14px", color: "#4a7a5a", lineHeight: 1.6 }}>
            Preencha as informações básicas da sua ficha de <span style={{ color: "#81c784" }}>Som das Seis</span>.
          </p>
        </div>

        {/* Formulário */}
        <div style={{
          background: "rgba(0,10,5,0.6)",
          border: "1px solid rgba(0,122,81,0.18)",
          borderRadius: "6px",
          padding: "32px 36px",
          display: "flex", flexDirection: "column", gap: "24px",
          backdropFilter: "blur(8px)",
        }}>

          {/* Identidade */}
          <SectionDivider title="Identidade" />

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <FieldLabel>Nome do Personagem *</FieldLabel>
            <TextInput value={nome} onChange={setNome} placeholder="Como seu personagem é chamado?" />
          </div>

          <div style={{ maxWidth: "200px" }}>
            <NumberSpinner
              label="Nível"
              value={nivel}
              onChange={setNivel}
              min={1} max={20}
              hint="Nível atual do personagem (1–20)"
            />
          </div>

          {/* Progressão */}
          <SectionDivider title="Progressão" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <NumberSpinner
              label="Tormento"
              value={tormento}
              onChange={setTormento}
              min={0} max={999}
              hint="Pontos de tormento acumulados"
            />
            <NumberSpinner
              label="Recompensa"
              value={recompensa}
              onChange={setRecompensa}
              min={0} max={999}
              hint="Recompensas recebidas"
            />
          </div>

          <div style={{ maxWidth: "200px" }}>
            <NumberSpinner
              label="Reputação"
              value={reputacao}
              onChange={setReputacao}
              min={0} max={999}
              hint="Nível de reputação no mundo"
            />
          </div>

          {/* Recursos */}
          <SectionDivider title="Recursos" />

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "240px" }}>
            <FieldLabel>Dinheiro</FieldLabel>
            <MoneyInput value={dinheiro} onChange={setDinheiro} />
            <FieldHint>Quantidade de moedas em posse</FieldHint>
          </div>

          <p style={{ fontSize: "10px", color: "#2d4a35", letterSpacing: "0.04em", marginTop: "4px" }}>
            * Campo obrigatório
          </p>
        </div>

        {/* Navegação */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid rgba(0,122,81,0.15)",
          paddingTop: "28px", marginTop: "32px",
        }}>
          <button
            onClick={() => router.push("/fichas/nova")}
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
            disabled={!canAdvance}
            onClick={handleNext}
            style={{
              padding: "11px 32px",
              background: canAdvance ? "#007A51" : "rgba(0,122,81,0.12)",
              border: "none",
              color: canAdvance ? "#e8f5e9" : "#2d4a35",
              borderRadius: "3px",
              cursor: canAdvance ? "pointer" : "not-allowed",
              fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "var(--font-museo), sans-serif",
              display: "flex", alignItems: "center", gap: "10px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { if (canAdvance) e.currentTarget.style.background = "#00955f"; }}
            onMouseLeave={(e) => { if (canAdvance) e.currentTarget.style.background = "#007A51"; }}
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