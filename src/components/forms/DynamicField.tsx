'use client';

import { SystemField } from '@/types/systems';
import React from 'react';

interface DynamicFieldProps {
  field: SystemField;
  value: any;
  onChange: (value: any) => void;
  baseInput?: React.CSSProperties;
}

const defaultInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(0,15,8,0.85)",
  border: "1px solid rgba(0,122,81,0.25)",
  borderRadius: "3px",
  color: "#c8e6c9",
  fontSize: "13px",
  fontFamily: "var(--font-museo), sans-serif",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  outline: "none",
};

const fieldContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  color: "#007A51",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontFamily: "var(--font-museo), sans-serif",
};

const hintStyle: React.CSSProperties = {
  fontSize: "10px",
  color: "#2d4a35",
  letterSpacing: "0.04em",
  lineHeight: 1.4,
};

// ─── Slider de Reputação ────────────────────────────────────────────────────
// O valor interno pode ser qualquer range (ex: -2 a 2).
// Visualmente, exibimos uma faixa de 0 a 100 para não aparecer negativos.
// Gradiente: claro (à esquerda = bem) → escuro/vermelho (à direita = mal)

function ReputacaoSlider({
  field,
  value,
  onChange,
}: {
  field: SystemField;
  value: any;
  onChange: (v: any) => void;
}) {
  const min = field.validation?.min ?? 0;
  const max = field.validation?.max ?? 100;
  const range = max - min;

  // Valor numérico real (interno)
  const numValue: number = value != null ? Number(value) : min;

  // Mapeia valor interno → posição visual 0–100
  const toVisual = (v: number) => ((v - min) / range) * 100;
  // Mapeia posição visual 0–100 → valor interno
  const toInternal = (vis: number) => min + (vis / 100) * range;

  const visual = toVisual(numValue); // 0–100

  // Descrição textual baseada na posição visual
  const getLabel = (vis: number) => {
    if (vis <= 20) return { text: "Lendário", color: "#81c784" };
    if (vis <= 40) return { text: "Respeitado", color: "#a5d6a7" };
    if (vis <= 60) return { text: "Neutro", color: "#b0bec5" };
    if (vis <= 80) return { text: "Suspeito", color: "#ef9a9a" };
    return { text: "Infame", color: "#e53935" };
  };

  const { text: reputLabel, color: reputColor } = getLabel(visual);

  // Percentual para o gradiente da barra preenchida
  // Bom (esquerda) = claro/verde, Mal (direita) = escuro/vermelho
  const fillPercent = visual;

  return (
    <div style={fieldContainer}>
      <label style={labelStyle}>{field.label}</label>

      {/* Cabeçalho com badge de status */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "4px",
      }}>
        <span style={{ fontSize: "10px", color: "#2d4a35", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Bem
        </span>
        <div style={{
          padding: "3px 12px",
          border: `1px solid ${reputColor}40`,
          borderRadius: "20px",
          background: `${reputColor}12`,
          fontSize: "11px",
          fontWeight: 700,
          color: reputColor,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          transition: "all 0.3s ease",
          fontFamily: "var(--font-museo), sans-serif",
        }}>
          {reputLabel}
        </div>
        <span style={{ fontSize: "10px", color: "#2d4a35", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Mal
        </span>
      </div>

      {/* Trilho do slider */}
      <div style={{ position: "relative", height: "44px", display: "flex", alignItems: "center" }}>
        {/* Fundo do trilho: gradiente claro → escuro */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          height: "6px",
          borderRadius: "3px",
          background: "linear-gradient(90deg, #81c784 0%, #e8f5e9 25%, #b0bec5 50%, #c62828 75%, #1a0000 100%)",
          zIndex: 1,
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
        }} />

        {/* Indicador de posição (linha fina) */}
        <div style={{
          position: "absolute",
          left: `${fillPercent}%`,
          top: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          width: "2px",
          height: "16px",
          background: reputColor,
          borderRadius: "1px",
          zIndex: 2,
          opacity: 0.4,
          transition: "left 0.15s ease",
        }} />

        <style>{`
          .reputa-slider {
            position: relative;
            width: 100%;
            height: 44px;
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
            z-index: 3;
          }
          .reputa-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #0d1a14;
            border: 2px solid ${reputColor};
            box-shadow: 0 0 10px ${reputColor}60, 0 2px 6px rgba(0,0,0,0.6);
            cursor: grab;
            transition: border-color 0.25s, box-shadow 0.25s, transform 0.15s;
          }
          .reputa-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 0 18px ${reputColor}80, 0 2px 8px rgba(0,0,0,0.7);
          }
          .reputa-slider:active::-webkit-slider-thumb {
            cursor: grabbing;
            transform: scale(1.05);
          }
          .reputa-slider::-moz-range-thumb {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #0d1a14;
            border: 2px solid ${reputColor};
            box-shadow: 0 0 10px ${reputColor}60;
            cursor: grab;
            transition: border-color 0.25s;
          }
          .reputa-slider::-webkit-slider-runnable-track,
          .reputa-slider::-moz-range-track {
            background: transparent;
          }
          .reputa-slider:focus {
            outline: none;
          }
        `}</style>

        <input
          className="reputa-slider"
          type="range"
          min={0}
          max={100}
          step={1}
          value={visual}
          onChange={(e) => {
            const vis = parseFloat(e.target.value);
            const internal = toInternal(vis);
            // Arredonda para 1 casa decimal
            onChange(Math.round(internal * 10) / 10);
          }}
        />
      </div>

      {/* Marcações visuais sem números */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 2px",
        marginTop: "2px",
      }}>
        {[0, 25, 50, 75, 100].map((pct) => (
          <div
            key={pct}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <div style={{
              width: "1px",
              height: pct === 0 || pct === 100 ? "8px" : "5px",
              background: Math.abs(visual - pct) < 10 ? reputColor : "rgba(0,122,81,0.2)",
              transition: "background 0.3s",
            }} />
          </div>
        ))}
      </div>

      {field.description && <span style={hintStyle}>{field.description}</span>}
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export function DynamicField({
  field,
  value,
  onChange,
  baseInput = defaultInputStyle,
}: DynamicFieldProps) {
  const handleChange = (newValue: any) => onChange(newValue);

  // Estilos de foco via onFocus/onBlur (sem pseudo-classes inline)
  const inputHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = "rgba(0,122,81,0.6)";
      e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,122,81,0.1)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = "rgba(0,122,81,0.25)";
      e.currentTarget.style.boxShadow = "none";
    },
  };

  switch (field.type) {
    case "text":
      return (
        <div style={fieldContainer}>
          <label style={labelStyle}>{field.label}</label>
          <input
            type="text"
            placeholder={field.placeholder || ""}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            style={baseInput}
            {...inputHandlers}
          />
          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    case "number":
      return (
        <div style={fieldContainer}>
          <label style={labelStyle}>{field.label}</label>
          <input
            type="number"
            placeholder={field.placeholder || ""}
            value={value ?? ""}
            onChange={(e) => handleChange(e.target.value === "" ? "" : parseInt(e.target.value))}
            min={field.validation?.min}
            max={field.validation?.max}
            style={baseInput}
            {...inputHandlers}
          />
          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    case "textarea":
      return (
        <div style={fieldContainer}>
          <label style={labelStyle}>{field.label}</label>
          <textarea
            placeholder={field.placeholder || ""}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            style={{ ...baseInput, minHeight: "120px", resize: "vertical" } as React.CSSProperties}
            {...inputHandlers}
          />
          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    case "select":
      return (
        <div style={fieldContainer}>
          <label style={labelStyle}>{field.label}</label>
          <select
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              ...baseInput,
              appearance: "none",
              paddingRight: "32px",
              backgroundImage:
                'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23c8e6c9%27 stroke-width=%272%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "20px",
            }}
            {...inputHandlers}
          >
            <option value="">Selecione uma opção...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    case "checkbox":
      return (
        <div style={{ ...fieldContainer }}>
          <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "8px", textTransform: "none" }}>
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleChange(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            {field.label}
          </label>
          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    case "radio":
      return (
        <div style={fieldContainer}>
          <label style={labelStyle}>{field.label}</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {field.options?.map((opt) => (
              <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => handleChange(e.target.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    case "multiselect":
      return (
        <div style={fieldContainer}>
          <label style={labelStyle}>{field.label}</label>
          <select
            multiple
            value={value || []}
            onChange={(e) => handleChange(Array.from(e.target.selectedOptions, (opt) => opt.value))}
            style={{ ...baseInput, minHeight: "120px" }}
            {...inputHandlers}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    case "slider":
      return <ReputacaoSlider field={field} value={value} onChange={onChange} />;

    default:
      return null;
  }
}