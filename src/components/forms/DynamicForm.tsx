'use client';

import { SystemStep } from '@/types/systems';
import { DynamicField } from './DynamicField';
import React from 'react';

interface DynamicFormProps {
  step: SystemStep;
  initialData?: Record<string, any>;
  onDataChange: (fieldId: string, value: any) => void;
  baseInput?: React.CSSProperties;
}

export function DynamicForm({
  step,
  initialData = {},
  onDataChange,
  baseInput,
}: DynamicFormProps) {
  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#a8d5a8",
    lineHeight: 1.6,
    marginBottom: "16px",
  };

  return (
    <form style={formStyle}>
      {step.description && (
        <p style={descriptionStyle}>{step.description}</p>
      )}

      {step.fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={initialData[field.id] ?? ""}
          onChange={(value) => onDataChange(field.id, value)}
          baseInput={baseInput}
        />
      ))}
    </form>
  );
}
