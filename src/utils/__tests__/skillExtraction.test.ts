import { describe, it, expect } from 'vitest';
import { extractSkillsFromEvidence } from '../skillExtraction';
import type { Evidence } from '../../types/evidence';

const makeEvidence = (overrides: Partial<Evidence>): Evidence => ({
  id: 'e1',
  type: 'portfolio',
  title: '',
  description: '',
  ...overrides,
});

describe('extractSkillsFromEvidence', () => {
  it('returns empty array for empty evidence', () => {
    expect(extractSkillsFromEvidence([])).toHaveLength(0);
  });

  it('detects Python from technologies field', () => {
    const skills = extractSkillsFromEvidence([
      makeEvidence({ technologies: 'Python, Flask' }),
    ]);
    const names = skills.map((s) => s.skill);
    expect(names).toContain('Python');
  });

  it('detects React from description', () => {
    const skills = extractSkillsFromEvidence([
      makeEvidence({ description: 'Built a React dashboard with TypeScript' }),
    ]);
    const names = skills.map((s) => s.skill);
    expect(names).toContain('React');
  });

  it('does not duplicate skills across multiple matches', () => {
    const skills = extractSkillsFromEvidence([
      makeEvidence({ description: 'Python Python Python', technologies: 'Python' }),
    ]);
    const pythonEntries = skills.filter((s) => s.skill === 'Python');
    expect(pythonEntries).toHaveLength(1);
  });

  it('each skill references a source evidence id', () => {
    const evidence = makeEvidence({ id: 'ev_42', technologies: 'React, Node.js' });
    const skills = extractSkillsFromEvidence([evidence]);
    for (const skill of skills) {
      expect(skill.sourceEvidenceId).toBe('ev_42');
    }
  });

  it('confidence is one of high / medium / low', () => {
    const skills = extractSkillsFromEvidence([
      makeEvidence({ description: 'Built a system using React Node.js and PostgreSQL with CI/CD pipelines' }),
    ]);
    for (const s of skills) {
      expect(['high', 'medium', 'low']).toContain(s.confidence);
    }
  });

  it('extracts skills from title field', () => {
    const skills = extractSkillsFromEvidence([
      makeEvidence({ title: 'TypeScript REST API project', description: '' }),
    ]);
    const names = skills.map((s) => s.skill);
    expect(names.some((n) => n.toLowerCase().includes('typescript') || n.toLowerCase().includes('api'))).toBe(true);
  });

  it('keeps SQL-family evidence tied to the matched database phrase', () => {
    const skills = extractSkillsFromEvidence([
      makeEvidence({ title: 'Student Curriculum Management System', technologies: 'PHP, MySQL' }),
    ]);
    const names = skills.map((s) => s.skill);
    expect(names).toContain('SQL');
    expect(skills.find((s) => s.skill === 'SQL')?.sourcePhrase).toMatch(/MySQL/i);
  });

  it('does not match TypeScript from ordinary words ending in ts', () => {
    const skills = extractSkillsFromEvidence([
      makeEvidence({
        title: 'Energy Harvesting System with Real-Time Mobile App Visualisation',
        description: 'Integrated sensors and built hardware circuits for real-time current metrics.',
        technologies: 'ESP32, Hardware Circuitry, IoT, Arduino IDE',
      }),
    ]);
    const names = skills.map((s) => s.skill);
    expect(names).not.toContain('TypeScript');
    expect(names).not.toContain('JavaScript / TypeScript');
  });
});
