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
  transition: "all 0.2s",
  boxSizing: "border-box",
};

export function DynamicField({
  field,
  value,
  onChange,
  baseInput = defaultInputStyle,
}: DynamicFieldProps) {
  const handleChange = (newValue: any) => {
    onChange(newValue);
  };

  const fieldContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
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
            style={{
              ...baseInput,
              minHeight: "120px",
              resize: "vertical",
            } as React.CSSProperties}
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
          >
            <option value="">Selecione uma opção...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    case "checkbox":
      return (
        <div style={{ ...fieldContainer, marginBottom: "12px" }}>
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
              <label
                key={opt.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
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
            onChange={(e) =>
              handleChange(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            style={{
              ...baseInput,
              minHeight: "120px",
            }}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    case "slider":
      const min = field.validation?.min ?? 0;
      const max = field.validation?.max ?? 100;
      const numValue = value != null ? Number(value) : min;

      // Determina label baseado na posição
      let sliderLabel = "";
      if (numValue < min + (max - min) * 0.33) {
        sliderLabel = "Ruim";
      } else if (numValue < min + (max - min) * 0.67) {
        sliderLabel = "Normal";
      } else {
        sliderLabel = "Bom";
      }

      return (
        <div style={fieldContainer}>
          <label style={labelStyle}>{field.label}</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{
              position: "relative",
              width: "100%",
              height: "40px",
              display: "flex",
              alignItems: "center",
            }}>
              {/* Barra de fundo com cores melhoradas */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "8px",
                background: "linear-gradient(90deg, #8B0000 0%, #ffd700 50%, #90EE90 100%)",
                borderRadius: "4px",
                zIndex: 1,
              }} />

              {/* Input contínuo - pode ser arrastado para qualquer posição */}
              <input
                type="range"
                min={min}
                max={max}
                step="0.1"
                value={numValue}
                onChange={(e) => handleChange(parseFloat(e.target.value))}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "40px",
                  appearance: "none",
                  background: "transparent",
                  cursor: "pointer",
                  zIndex: 2,
                } as React.CSSProperties & {
                  WebkitAppearance?: string;
                }}
              />

              {/* Estilos do thumb (arrastável) */}
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  -webkit-appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #007A51;
                  cursor: pointer;
                  border: 3px solid #81c784;
                  box-shadow: 0 0 8px rgba(0, 122, 81, 0.6);
                  transition: all 0.2s;
                }
                input[type="range"]::-webkit-slider-thumb:hover {
                  transform: scale(1.2);
                  box-shadow: 0 0 16px rgba(0, 122, 81, 0.8);
                }
                input[type="range"]::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #007A51;
                  cursor: pointer;
                  border: 3px solid #81c784;
                  box-shadow: 0 0 8px rgba(0, 122, 81, 0.6);
                  transition: all 0.2s;
                }
                input[type="range"]::-moz-range-thumb:hover {
                  transform: scale(1.2);
                  box-shadow: 0 0 16px rgba(0, 122, 81, 0.8);
                }
              `}</style>
            </div>

            {/* Indicadores de texto */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              color: "#2d4a35",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              <span>Ruim</span>
              <span style={{ fontWeight: 700, color: "#81c784" }}>{sliderLabel}</span>
              <span>Bom</span>
            </div>

            {/* Valor numérico */}
            <div style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#81c784",
              fontWeight: 700,
            }}>
              {numValue.toFixed(1)}
            </div>
          </div>

          {field.description && <span style={hintStyle}>{field.description}</span>}
        </div>
      );

    default:
      return null;
  }
}


