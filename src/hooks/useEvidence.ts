import { useState, useCallback, useEffect } from 'react';
import { Evidence } from '../types/evidence';
import { danielLeeProfile } from '../data/mockStudent';
import { loadEvidence, saveEvidence } from '../utils/evidenceStorage';

function generateId(): string {
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function useEvidence() {
  const [evidence, setEvidence] = useState<Evidence[]>(() => {
    const stored = loadEvidence();
    return stored ?? danielLeeProfile.evidence;
  });

  useEffect(() => {
    saveEvidence(evidence);
  }, [evidence]);

  const addEvidence = useCallback((data: Omit<Evidence, 'id'>) => {
    setEvidence(prev => [...prev, { ...data, id: generateId() }]);
  }, []);

  const updateEvidence = useCallback((id: string, data: Omit<Evidence, 'id'>) => {
    setEvidence(prev =>
      prev.map(item => (item.id === id ? { ...data, id } : item))
    );
  }, []);

  const deleteEvidence = useCallback((id: string) => {
    setEvidence(prev => prev.filter(item => item.id !== id));
  }, []);

  const resetToDemo = useCallback(() => {
    setEvidence(danielLeeProfile.evidence);
  }, []);

  const clearAll = useCallback(() => {
    setEvidence([]);
  }, []);

  return { evidence, addEvidence, updateEvidence, deleteEvidence, resetToDemo, clearAll, setEvidence };
}
