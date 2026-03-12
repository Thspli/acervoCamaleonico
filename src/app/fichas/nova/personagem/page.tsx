"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../../components/Header";
import { useSystemContext } from "@/contexts/SystemContext";
import { getSystemById, getSystemSteps } from "@/data/systems";
import { DynamicForm } from "@/components/forms/DynamicForm";

// ——— Linha de passos Dinâmica ———
function StepBar({ current, steps }: { current: number; steps: Array<{ id: string; label: string; order: number }> }) {
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "28px 0 36px",
    }}>
      {sortedSteps.map((step, i) => {
        const done   = step.order < current;
        const active = step.order === current;

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
                    {step.order}
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

// ——— Página ———
export default function PersonagemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sistemId = searchParams.get("sistema");

  const { selectedSystem, characterData, updateCharacterData, getCharacterDataByStep } = useSystemContext();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Garantir que o sistema foi selecionado via contexto
  const system = selectedSystem || (sistemId ? getSystemById(sistemId) : null);

  if (!system) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          color: "#c8e6c9",
          fontFamily: "var(--font-museo), sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#e8f5e9", marginBottom: "12px" }}>Sistema não encontrado</h1>
          <p style={{ color: "#4a7a5a", marginBottom: "20px" }}>Volte e selecione um sistema válido.</p>
          <button
            onClick={() => router.push("/fichas/nova")}
            style={{
              padding: "11px 22px",
              background: "#007A51",
              border: "none",
              color: "#e8f5e9",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "var(--font-museo), sans-serif",
            }}
          >
            Voltar para seleção de sistema
          </button>
        </div>
      </div>
    );
  }

  // obtém todos os passos definidos pelo sistema. não filtramos nada aqui
  // para que o StepBar continue mostrando o primeiro passo e a numeração
  // não salte quando avançarmos.
  const steps = getSystemSteps(system.id);
  const currentStep = steps[currentStepIndex];

  if (!currentStep) {
    return null;
  }

  const canAdvance = currentStep.fields.length === 0 || 
    currentStep.fields.every(field => {
      if (!field.required) return true;
      const value = getCharacterDataByStep(currentStep.id)[field.id];
      return value !== "" && value !== undefined && value !== null;
    });

  const handleNext = () => {
    if (canAdvance && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (canAdvance && currentStepIndex === steps.length - 1) {
      // Última etapa - redirecionar para revisão ou salvar
      router.push(`/fichas/nova/revisao?sistema=${system.id}`);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      router.push("/fichas/nova");
    }
  };

  const stepData = getCharacterDataByStep(currentStep.id);

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

        <StepBar current={currentStep.order} steps={steps} />

        {/* Título */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <p style={{ fontSize: "11px", color: "#007A51", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "10px" }}>
            Passo {currentStep.order} de {steps.length}
          </p>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#e8f5e9", letterSpacing: "-0.01em", marginBottom: "8px" }}>
            {currentStep.label}
          </h2>
          <p style={{ fontSize: "14px", color: "#4a7a5a", lineHeight: 1.6 }}>
            Preenchendo ficha de <span style={{ color: "#81c784" }}>{system.name}</span>
          </p>
        </div>

        {/* Formulário Dinâmico ou conteúdo especial para passos vazios */}
        {currentStep.id === "system-info" ? (
          <div
            style={{
              background: "rgba(0,10,5,0.6)",
              border: "1px solid rgba(0,122,81,0.18)",
              borderRadius: "6px",
              padding: "32px 36px",
              textAlign: "center",
              backdropFilter: "blur(8px)",
            }}
          >
            <p style={{ fontSize: "16px", color: "#e8f5e9", marginBottom: "8px" }}>
              Sistema selecionado:
            </p>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "#81c784" }}>
              {system.name}
            </p>
            <p style={{ fontSize: "14px", color: "#4a7a5a", marginTop: "12px" }}>
              Você pode avançar para começar a preencher os dados do personagem.
            </p>
          </div>
        ) : currentStep.fields.length > 0 ? (
          <div
            style={{
              background: "rgba(0,10,5,0.6)",
              border: "1px solid rgba(0,122,81,0.18)",
              borderRadius: "6px",
              padding: "32px 36px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              backdropFilter: "blur(8px)",
            }}
          >
            <DynamicForm
              step={currentStep}
              initialData={stepData}
              onDataChange={(fieldId, value) => {
                updateCharacterData(currentStep.id, fieldId, value);
              }}
            />
          </div>
        ) : (
          <div
            style={{
              background: "rgba(0,10,5,0.6)",
              border: "1px solid rgba(0,122,81,0.18)",
              borderRadius: "6px",
              padding: "32px 36px",
              textAlign: "center",
              backdropFilter: "blur(8px)",
            }}
          >
            <p style={{ fontSize: "14px", color: "#4a7a5a", lineHeight: 1.6 }}>
              Revise suas informações antes de finalizar a criação.
            </p>
          </div>
        )}

        {/* Navegação */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid rgba(0,122,81,0.15)",
          paddingTop: "28px", marginTop: "32px",
        }}>
          <button
            onClick={handlePrevious}
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
            {currentStepIndex === steps.length - 1 ? "Finalizar" : "Próximo"}
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

      </main>
    </div>
  );
}