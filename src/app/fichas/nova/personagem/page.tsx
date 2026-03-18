"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../../components/Header";
import { useSystemContext } from "@/contexts/SystemContext";
import { getSystemById, getSystemSteps } from "@/data/systems";
import { DynamicField } from "@/components/forms/DynamicField";
import { AttributesStep } from "@/components/forms/AttributesStep";
import { AntecedentesStep } from "@/components/forms/AntecedentesStep";
import { HabilidadesStep } from "@/components/forms/HabilidadesStep";

// ─── Barra de progresso ───────────────────────────────────────────────────────
function StepBar({
  current,
  steps,
}: {
  current: number;
  steps: Array<{ id: string; label: string; order: number }>;
}) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "32px 0 40px",
      gap: 0,
    }}>
      {sorted.map((step, i) => {
        const done   = step.order < current;
        const active = step.order === current;

        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            {/* Linha conectora */}
            {i > 0 && (
              <div style={{
                width: "64px", height: "1px", // connector
                background: done || active
                  ? "linear-gradient(90deg, #007A51, rgba(0,122,81,0.3))"
                  : "rgba(0,122,81,0.1)",
                transition: "background 0.4s",
              }} />
            )}

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              {/* Círculo */}
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                border: `1.5px solid ${active ? "#007A51" : done ? "#007A51" : "rgba(0,122,81,0.18)"}`,
                background: done
                  ? "#007A51"
                  : active
                  ? "rgba(0,122,81,0.12)"
                  : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
                boxShadow: active ? "0 0 12px rgba(0,122,81,0.35)" : "none",
                flexShrink: 0,
              }}>
                {done ? (
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{
                    fontSize: "11px", fontWeight: 700,
                    color: active ? "#81c784" : "rgba(0,122,81,0.3)",
                    fontFamily: "var(--font-museo), sans-serif",
                  }}>
                    {step.order}
                  </span>
                )}
              </div>

              {/* Label */}
              <span style={{
                fontSize: "9px", fontWeight: active ? 700 : 400,
                color: active ? "#81c784" : done ? "#007A51" : "rgba(0,122,81,0.28)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                fontFamily: "var(--font-museo), sans-serif",
                transition: "color 0.3s",
                whiteSpace: "nowrap",
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

// ─── Label de seção interna ───────────────────────────────────────────────────
function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        marginBottom: "18px",
      }}>
        <span style={{
          fontSize: "9px", fontWeight: 700, color: "#007A51",
          letterSpacing: "0.2em", textTransform: "uppercase",
          fontFamily: "var(--font-museo), sans-serif",
        }}>
          {label}
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(0,122,81,0.14)" }} />
      </div>
      {children}
    </div>
  );
}

// ─── Estilo base dos inputs ───────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(0,15,8,0.9)",
  border: "1px solid rgba(0,122,81,0.22)",
  borderRadius: "4px",
  color: "#c8e6c9",
  fontSize: "13px",
  fontFamily: "var(--font-museo), sans-serif",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  outline: "none",
};

// ─── Card de passo — wrapper visual ──────────────────────────────────────────
function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(0,10,5,0.65)",
      border: "1px solid rgba(0,122,81,0.18)",
      borderRadius: "8px",
      padding: "36px 40px",
      backdropFilter: "blur(10px)", // @step-card
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow sutil no topo */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(0,122,81,0.4), transparent)",
        pointerEvents: "none",
      }} />
      {children}
    </div>
  );
}

// ─── Passo: Informações do sistema ───────────────────────────────────────────
function SystemInfoStep({ name }: { name: string }) {
  return (
    <StepCard>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          border: "1.5px solid rgba(0,122,81,0.4)",
          background: "rgba(0,122,81,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#007A51" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <p style={{ fontSize: "11px", color: "#007A51", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px" }}>
          Sistema selecionado
        </p>
        <p style={{ fontSize: "22px", fontWeight: 700, color: "#81c784", marginBottom: "14px", fontFamily: "var(--font-museo), sans-serif" }}>
          {name}
        </p>
        <p style={{ fontSize: "13px", color: "#4a7a5a", lineHeight: 1.7, maxWidth: "360px", margin: "0 auto" }}>
          Tudo certo! Avance para começar a preencher os dados do seu personagem.
        </p>
      </div>
    </StepCard>
  );
}

// ─── Passo: Personagem (character-basics) ────────────────────────────────────
function PersonagemStep({
  stepData,
  fields,
  onChange,
}: {
  stepData: Record<string, any>;
  fields: ReturnType<typeof getSystemSteps>[0]["fields"];
  onChange: (id: string, v: any) => void;
}) {
  const get = (id: string) => stepData[id] ?? "";

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(0,122,81,0.55)";
    e.currentTarget.style.boxShadow   = "0 0 0 2px rgba(0,122,81,0.08)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(0,122,81,0.22)";
    e.currentTarget.style.boxShadow   = "none";
  };

  const label = (text: string, required?: boolean) => (
    <div style={{
      fontSize: "9px", fontWeight: 700, color: "#007A51",
      letterSpacing: "0.16em", textTransform: "uppercase",
      fontFamily: "var(--font-museo), sans-serif",
      marginBottom: "7px", display: "flex", alignItems: "center", gap: "5px",
    }}>
      {text}
      {required && <span style={{ color: "#c0392b", fontSize: "11px", lineHeight: 1 }}>*</span>}
    </div>
  );

  const hint = (text: string) => (
    <p style={{ fontSize: "10px", color: "#2d4a35", marginTop: "5px", lineHeight: 1.4 }}>
      {text}
    </p>
  );

  // Campo de reputação usa DynamicField (slider customizado)
  const reputField = fields.find(f => f.id === "reputacao");

  return (
    <StepCard>
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* ── Identidade ── */}
        <FieldGroup label="Identidade">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }} className="personagem-grid">
            {/* Nome do Personagem */}
            <div>
              {label("Nome do Personagem", true)}
              <input
                type="text"
                value={get("character-name")}
                onChange={e => onChange("character-name", e.target.value)}
                placeholder="Ex: Kai Lazurai"
                style={INPUT}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            {/* Nome do Jogador */}
            <div>
              {label("Nome do Jogador", true)}
              <input
                type="text"
                value={get("player-name")}
                onChange={e => onChange("player-name", e.target.value)}
                placeholder="Seu nome"
                style={INPUT}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            {/* Nível — coluna inteira por clareza */}
            <div style={{ gridColumn: "span 2" }}>
              {label("Nível")}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="nivel-btns">
                {/* Botões −/+ */}
                {[1,2,3,4,5,6].map(n => {
                  const active = Number(get("nivel") || 1) === n;
                  return (
                    <button
                      key={n}
                      onClick={() => onChange("nivel", n)}
                      style={{
                        width: 40, height: 40, borderRadius: "4px",
                        border: `1.5px solid ${active ? "#007A51" : "rgba(0,122,81,0.18)"}`,
                        background: active ? "rgba(0,122,81,0.18)" : "rgba(0,15,8,0.7)",
                        color: active ? "#81c784" : "#2d4a35",
                        fontSize: "14px", fontWeight: 700,
                        fontFamily: "var(--font-museo), sans-serif",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        boxShadow: active ? "0 0 10px rgba(0,122,81,0.25)" : "none",
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
                <span style={{ fontSize: "11px", color: "#2d4a35", fontStyle: "italic" }}>
                  Nível 1–6
                </span>
              </div>
            </div>
          </div>
        </FieldGroup>

        {/* ── Recursos ── */}
        <FieldGroup label="Recursos">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }} className="personagem-grid">
            {/* Dinheiro */}
            <div>
              {label("Dinheiro")}
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  fontSize: "13px", color: "#4a7a5a", pointerEvents: "none",
                }}>$</span>
                <input
                  type="number"
                  min={0}
                  value={get("dinheiro")}
                  onChange={e => onChange("dinheiro", e.target.value === "" ? 0 : parseInt(e.target.value))}
                  placeholder="0"
                  style={{ ...INPUT, paddingLeft: "26px" }}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
              {hint("Moedas em posse")}
            </div>

            {/* Recompensa */}
            <div>
              {label("Recompensa")}
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  fontSize: "13px", color: "#4a7a5a", pointerEvents: "none",
                }}>$</span>
                <input
                  type="number"
                  min={0}
                  value={get("recompensa")}
                  onChange={e => onChange("recompensa", e.target.value === "" ? 0 : parseInt(e.target.value))}
                  placeholder="0"
                  style={{ ...INPUT, paddingLeft: "26px" }}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
              {hint("Cabeça a prêmio")}
            </div>
          </div>
        </FieldGroup>

        {/* ── Reputação ── */}
        <FieldGroup label="Reputação">
          {reputField && (
            <DynamicField
              field={reputField}
              value={get("reputacao")}
              onChange={v => onChange("reputacao", v)}
              baseInput={INPUT}
            />
          )}
        </FieldGroup>

        {/* ── Tormento ── */}
        <FieldGroup label="Tormento">
          {label("O que assombra sua alma")}
          <textarea
            value={get("tormento")}
            onChange={e => onChange("tormento", e.target.value)}
            placeholder="Descreva os tormentos e traumas do seu personagem..."
            rows={4}
            style={{
              ...INPUT,
              resize: "vertical",
              minHeight: "100px",
              lineHeight: "1.6",
            } as React.CSSProperties}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
          {hint("Campo opcional — até 500 caracteres")}
        </FieldGroup>

      </div>
    </StepCard>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function PersonagemPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const sistemId     = searchParams.get("sistema");

  const {
    selectedSystem,
    updateCharacterData,
    getCharacterDataByStep,
    saveCurrentFicha,
  } = useSystemContext();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const system = selectedSystem || (sistemId ? getSystemById(sistemId) : null);

  if (!system) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a", color: "#c8e6c9",
        fontFamily: "var(--font-museo), sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "16px",
      }}>
        <p style={{ color: "#4a7a5a", fontSize: "13px" }}>Sistema não encontrado.</p>
        <button
          onClick={() => router.push("/fichas/nova")}
          style={{
            padding: "10px 22px", background: "#007A51", border: "none",
            color: "#e8f5e9", borderRadius: "3px", cursor: "pointer",
            fontSize: "13px", fontFamily: "var(--font-museo), sans-serif",
          }}
        >
          Voltar para seleção
        </button>
      </div>
    );
  }

  const steps       = getSystemSteps(system.id);
  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  const stepData = getCharacterDataByStep(currentStep.id);

  // Validação de avanço
  const canAdvance = (() => {
    if (currentStep.id === "character-basics") {
      const name   = String(stepData["character-name"] ?? "").trim();
      const player = String(stepData["player-name"]    ?? "").trim();
      return name.length >= 3 && player.length >= 2;
    }
    // Atributos, antecedentes, habilidades e info do sistema sempre podem avançar
    if (["attributes", "antecedentes", "habilidades", "system-info"].includes(currentStep.id)) {
      return true;
    }
    return currentStep.fields.every(f => {
      if (!f.required) return true;
      const v = stepData[f.id];
      return v !== "" && v !== undefined && v !== null;
    });
  })();

  const handleNext = () => {
    if (!canAdvance) return;
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
    } else {
      saveCurrentFicha();
      router.push("/fichas");
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
    } else {
      router.push("/fichas/nova");
    }
  };

  const onChange = (fieldId: string, value: any) =>
    updateCharacterData(currentStep.id, fieldId, value);

  const isLast = currentStepIndex === steps.length - 1;

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#c8e6c9",
      fontFamily: "var(--font-museo), sans-serif",
      overflowX: "hidden", position: "relative",
      display: "flex", flexDirection: "column",
    }}>
      {/* Fundos */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(0,122,81,0.06) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, rgba(0,122,81,0.04) 0%, transparent 50%)
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
        maxWidth: "740px", margin: "0 auto", width: "100%",
        padding: "0 40px 80px",
      }} className="wizard-main">
        <style>{`
          @media(max-width:640px){
            .wizard-main{padding:0 16px 60px!important}
            .step-connector{width:32px!important}
            .step-label{font-size:8px!important}
            .personagem-grid{grid-template-columns:1fr!important}
            .nivel-btns{gap:6px!important}
            .step-card{padding:24px 20px!important}
          }
          @media(max-width:480px){
            .step-connector{width:20px!important}
            .step-label{display:none!important}
          }
          @media(max-width:640px){
            .attrs-side-panel,.antes-side-panel,.hab-side-panel{width:100%!important;position:static!important}
            .attrs-flex,.antes-flex,.hab-flex{flex-direction:column!important}
          }
        `}</style>

        {/* Barra de passos */}
        <StepBar current={currentStep.order} steps={steps} />

        {/* Cabeçalho do passo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{
            fontSize: "10px", color: "#007A51", letterSpacing: "0.16em",
            textTransform: "uppercase", marginBottom: "8px",
          }}>
            Passo {currentStep.order} de {steps.length} &nbsp;·&nbsp; {system.name}
          </p>
          <h2 style={{
            fontSize: "24px", fontWeight: 700, color: "#e8f5e9",
            letterSpacing: "-0.01em",
          }}>
            {currentStep.label}
          </h2>
        </div>

        {/* Conteúdo do passo */}
        {currentStep.id === "system-info" ? (
          <SystemInfoStep name={system.name} />
        ) : currentStep.id === "character-basics" ? (
          <PersonagemStep
            stepData={stepData}
            fields={currentStep.fields}
            onChange={onChange}
          />
        ) : currentStep.id === "attributes" ? (
          <div className="attrs-flex" style={{display:"flex",gap:"20px",alignItems:"flex-start",flexWrap:"wrap"}}>
            <AttributesStep
            values={stepData as Record<string, number>}
            onChange={onChange}
          />
          </div>
        ) : currentStep.id === "antecedentes" ? (
          <AntecedentesStep
            values={stepData as Record<string, number>}
            onChange={onChange}
            intelecto={(getCharacterDataByStep("attributes")["intelecto"] as number) ?? 0}
          />
        ) : currentStep.id === "habilidades" ? (
          <HabilidadesStep
            selected={(stepData["escolhidas"] as string[]) ?? []}
            onChange={ids => onChange("escolhidas", ids)}
          />
        ) : null}

        {/* Navegação */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid rgba(0,122,81,0.14)",
          paddingTop: "28px", marginTop: "32px",
        }}>
          <button
            onClick={handlePrev}
            style={{
              background: "none",
              border: "1px solid rgba(0,122,81,0.22)",
              color: "#4a7a5a", padding: "10px 22px", borderRadius: "4px",
              cursor: "pointer", fontSize: "13px",
              fontFamily: "var(--font-museo), sans-serif",
              display: "flex", alignItems: "center", gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#007A51";
              e.currentTarget.style.color = "#81c784";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(0,122,81,0.22)";
              e.currentTarget.style.color = "#4a7a5a";
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>

          {/* Indicador central de progresso */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {steps.map((s, i) => (
              <div
                key={s.id}
                style={{
                  width: i === currentStepIndex ? 20 : 6,
                  height: 6, borderRadius: "3px",
                  background: i < currentStepIndex
                    ? "#007A51"
                    : i === currentStepIndex
                    ? "#81c784"
                    : "rgba(0,122,81,0.15)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            disabled={!canAdvance}
            onClick={handleNext}
            style={{
              padding: "10px 28px",
              background: canAdvance ? "#007A51" : "rgba(0,122,81,0.1)",
              border: "none",
              color: canAdvance ? "#e8f5e9" : "#2d4a35",
              borderRadius: "4px",
              cursor: canAdvance ? "pointer" : "not-allowed",
              fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "var(--font-museo), sans-serif",
              display: "flex", alignItems: "center", gap: "10px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (canAdvance) e.currentTarget.style.background = "#00955f"; }}
            onMouseLeave={e => { if (canAdvance) e.currentTarget.style.background = "#007A51"; }}
          >
            {isLast ? "Finalizar" : "Próximo"}
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

      </main>
    </div>
  );
}