'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { SystemConfig, CharacterData, Ficha } from '@/types/systems';
import { getSystemById } from '@/data/systems';

interface SystemContextType {
  selectedSystem: SystemConfig | null;
  characterData: CharacterData;
  fichas: Ficha[];
  setSelectedSystem: (systemId: string) => void;
  updateCharacterData: (stepId: string, fieldId: string, value: any) => void;
  getCharacterDataByStep: (stepId: string) => Record<string, any>;
  saveCurrentFicha: () => string; // retorna o id gerado
  deleteFicha: (id: string) => void;
  clearData: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const STORAGE_KEY = 'acervo_fichas';

function loadFichas(): Ficha[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistFichas(fichas: Ficha[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));
  } catch {}
}

export function SystemProvider({ children }: { children: ReactNode }) {
  const [selectedSystem, setSelectedSystemState] = useState<SystemConfig | null>(null);
  const [characterData, setCharacterData] = useState<CharacterData>({});
  const [fichas, setFichas] = useState<Ficha[]>([]);

  // Carrega fichas do localStorage na montagem
  useEffect(() => {
    setFichas(loadFichas());
  }, []);

  const setSelectedSystem = useCallback((systemId: string) => {
    const system = getSystemById(systemId);
    if (system) {
      setSelectedSystemState(system);
      setCharacterData({});
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
    (stepId: string) => characterData[stepId] || {},
    [characterData]
  );

  const saveCurrentFicha = useCallback((): string => {
    if (!selectedSystem) return '';

    const basics = characterData['character-basics'] || {};
    const id = `ficha_${Date.now()}`;

    const novaFicha: Ficha = {
      id,
      systemId: selectedSystem.id,
      characterName: (basics['character-name'] as string) || 'Sem nome',
      playerName: (basics['player-name'] as string) || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: characterData,
    };

    setFichas((prev) => {
      const updated = [...prev, novaFicha];
      persistFichas(updated);
      return updated;
    });

    // Limpa dados do wizard após salvar
    setCharacterData({});
    setSelectedSystemState(null);

    return id;
  }, [selectedSystem, characterData]);

  const deleteFicha = useCallback((id: string) => {
    setFichas((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      persistFichas(updated);
      return updated;
    });
  }, []);

  const clearData = useCallback(() => {
    setCharacterData({});
  }, []);

  return (
    <SystemContext.Provider value={{
      selectedSystem,
      characterData,
      fichas,
      setSelectedSystem,
      updateCharacterData,
      getCharacterDataByStep,
      saveCurrentFicha,
      deleteFicha,
      clearData,
    }}>
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