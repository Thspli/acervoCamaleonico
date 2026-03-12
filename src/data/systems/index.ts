import { SystemConfig } from "@/types/systems";
import { somDasSeis } from "./som-das-seis";

/**
 * Índice centralizado de todos os sistemas disponíveis
 * Adicione novos sistemas aqui conforme forem criados
 */
export const SYSTEMS_CONFIG: Record<string, SystemConfig> = {
  [somDasSeis.id]: somDasSeis,
  // Adicione novos sistemas aqui:
  // [outroSistema.id]: outroSistema,
};

/**
 * Lista de todos os sistemas disponíveis (para exibir no seletor)
 */
export const AVAILABLE_SYSTEMS = Object.values(SYSTEMS_CONFIG);

/**
 * Busca um sistema por ID
 */
export const getSystemById = (systemId: string): SystemConfig | null => {
  return SYSTEMS_CONFIG[systemId] || null;
};

/**
 * Retorna os passos de um sistema, ordenados
 */
export const getSystemSteps = (systemId: string) => {
  const system = getSystemById(systemId);
  if (!system) return [];
  return [...system.steps].sort((a, b) => a.order - b.order);
};
