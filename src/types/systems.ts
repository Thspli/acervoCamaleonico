/**
 * Tipos para suportar múltiplos sistemas de RPG adaptativos
 */

export type FieldType = "text" | "number" | "select" | "multiselect" | "textarea" | "checkbox" | "radio" | "slider";

export interface SystemField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface SystemStep {
  id: string;
  order: number;
  label: string;
  description?: string;
  fields: SystemField[];
}

export interface SystemConfig {
  id: string;
  name: string;
  description: string;
  cover: string;
  tag?: string;
  steps: SystemStep[];
  attributes?: string[]; // Nomes dos atributos principais (ex: Força, Destreza)
  skills?: string[]; // Habilidades disponíveis
}

export interface CharacterData {
  [stepId: string]: {
    [fieldId: string]: string | number | boolean | string[];
  };
}

export interface Ficha {
  id: string;
  systemId: string;
  characterName: string;
  playerName: string;
  createdAt: string;
  updatedAt: string;
  data: CharacterData;
}
