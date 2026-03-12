'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SystemConfig, CharacterData } from '@/types/systems';
import { getSystemById } from '@/data/systems';

interface SystemContextType {
  selectedSystem: SystemConfig | null;
  characterData: CharacterData;
  setSelectedSystem: (systemId: string) => void;
  updateCharacterData: (stepId: string, fieldId: string, value: any) => void;
  getCharacterDataByStep: (stepId: string) => Record<string, any>;
  clearData: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [selectedSystem, setSelectedSystemState] = useState<SystemConfig | null>(null);
  const [characterData, setCharacterData] = useState<CharacterData>({});

  const setSelectedSystem = useCallback((systemId: string) => {
    const system = getSystemById(systemId);
    if (system) {
      setSelectedSystemState(system);
      setCharacterData({}); // Limpa dados ao mudar de sistema
    }
  }, []);

  const updateCharacterData = useCallback(
    (stepId: string, fieldId: string, value: any) => {
      setCharacterData((prev) => ({
        ...prev,
        [stepId]: {
          ...prev[stepId],
          [fieldId]: value,
        },
      }));
    },
    []
  );

  const getCharacterDataByStep = useCallback(
    (stepId: string) => {
      return characterData[stepId] || {};
    },
    [characterData]
  );

  const clearData = useCallback(() => {
    setCharacterData({});
  }, []);

  const value: SystemContextType = {
    selectedSystem,
    characterData,
    setSelectedSystem,
    updateCharacterData,
    getCharacterDataByStep,
    clearData,
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystemContext() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystemContext must be used within a SystemProvider');
  }
  return context;
}
