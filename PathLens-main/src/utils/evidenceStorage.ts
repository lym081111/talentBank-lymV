import { Evidence } from '../types/evidence';

const STORAGE_KEY = 'pathlens_evidence_v1';

export function loadEvidence(): Evidence[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as Evidence[];
  } catch {
    return null;
  }
}

export function saveEvidence(evidence: Evidence[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evidence));
  } catch {
    // Ignore quota errors (incognito, full storage)
  }
}

export function clearEvidence(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
