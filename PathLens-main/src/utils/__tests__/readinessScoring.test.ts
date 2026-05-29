import { describe, it, expect } from 'vitest';
import { calculateReadinessProfile, DIMENSION_WEIGHTS } from '../readinessScoring';
import type { Evidence } from '../../types/evidence';

const makeEvidence = (overrides: Partial<Evidence> = {}): Evidence => ({
  id: 'test_001',
  type: 'portfolio',
  title: 'Test Project',
  description: 'A test project with React and Node.js',
  technologies: 'React, Node.js',
  ...overrides,
});

describe('calculateReadinessProfile', () => {
  it('returns zero-evidence profile without crashing', () => {
    const result = calculateReadinessProfile([]);
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
    expect(result.dimensions).toHaveLength(6);
    expect(result.allExtractedSkills).toBeDefined();
  });

  it('scores 6 named dimensions', () => {
    const evidence = [makeEvidence()];
    const result = calculateReadinessProfile(evidence);
    const names = result.dimensions.map((d) => d.dimension);
    expect(names).toContain('Technical Skills');
    expect(names).toContain('Portfolio Evidence');
    expect(names).toContain('Work Readiness');
    expect(names).toContain('Production Practices');
  });

  it('increases portfolio score with more evidence types', () => {
    const single = calculateReadinessProfile([makeEvidence({ type: 'portfolio' })]);
    const rich = calculateReadinessProfile([
      makeEvidence({ id: '1', type: 'portfolio' }),
      makeEvidence({ id: '2', type: 'internship' }),
      makeEvidence({ id: '3', type: 'hackathon' }),
    ]);
    const singlePortfolio = single.dimensions.find((d) => d.dimension === 'Portfolio Evidence')!;
    const richPortfolio = rich.dimensions.find((d) => d.dimension === 'Portfolio Evidence')!;
    expect(richPortfolio.score).toBeGreaterThanOrEqual(singlePortfolio.score);
  });

  it('boosts Work Readiness for internship evidence', () => {
    const noInternship = calculateReadinessProfile([makeEvidence({ type: 'portfolio' })]);
    const withInternship = calculateReadinessProfile([
      makeEvidence({ type: 'portfolio' }),
      makeEvidence({ id: 'i', type: 'internship', title: 'Internship', description: 'Worked in agile team', technologies: 'Node.js' }),
    ]);
    const no = noInternship.dimensions.find((d) => d.dimension === 'Work Readiness')!;
    const yes = withInternship.dimensions.find((d) => d.dimension === 'Work Readiness')!;
    expect(yes.score).toBeGreaterThan(no.score);
  });

  it('all dimension scores are clamped to 0–100', () => {
    const evidence = Array.from({ length: 10 }, (_, i) =>
      makeEvidence({ id: `e_${i}`, type: 'portfolio', description: 'Built tested deployed dockerised CI/CD monitoring agile REST API PostgreSQL' })
    );
    const result = calculateReadinessProfile(evidence);
    for (const d of result.dimensions) {
      expect(d.score).toBeGreaterThanOrEqual(0);
      expect(d.score).toBeLessThanOrEqual(100);
    }
  });

  it('assigns a valid level string', () => {
    const result = calculateReadinessProfile([makeEvidence()]);
    const validLevels = ['Advanced-Ready', 'Internship-Ready with Targeted Growth', 'Developing', 'Emerging'];
    expect(validLevels).toContain(result.level);
  });

  it('returns deterministic results for the same input', () => {
    const evidence = [makeEvidence(), makeEvidence({ id: '2', type: 'internship' })];
    const r1 = calculateReadinessProfile(evidence);
    const r2 = calculateReadinessProfile(evidence);
    expect(r1.overall).toBe(r2.overall);
    expect(r1.level).toBe(r2.level);
  });
});

describe('DIMENSION_WEIGHTS', () => {
  it('exports DIMENSION_WEIGHTS with all 6 dimensions', () => {
    const keys = Object.keys(DIMENSION_WEIGHTS);
    expect(keys).toHaveLength(6);
    expect(keys).toContain('Technical Skills');
    expect(keys).toContain('Portfolio Evidence');
    expect(keys).toContain('Work Readiness');
    expect(keys).toContain('Communication & Documentation');
    expect(keys).toContain('Production Practices');
    expect(keys).toContain('Role-Specific Fit (Software Engineer)');
  });

  it('DIMENSION_WEIGHTS sum to exactly 1.0', () => {
    const total = Object.values(DIMENSION_WEIGHTS).reduce((s, w) => s + w, 0);
    expect(Math.round(total * 100) / 100).toBe(1.0);
  });

  it('all weights are positive numbers between 0 and 1', () => {
    for (const [dim, weight] of Object.entries(DIMENSION_WEIGHTS)) {
      expect(weight, `Weight for "${dim}" should be > 0`).toBeGreaterThan(0);
      expect(weight, `Weight for "${dim}" should be < 1`).toBeLessThan(1);
    }
  });

  it('overall score matches manual weighted calculation', () => {
    const evidence = [
      makeEvidence({ id: '1', type: 'portfolio' }),
      makeEvidence({ id: '2', type: 'internship', description: 'Agile team, REST API, deployed to Docker' }),
    ];
    const result = calculateReadinessProfile(evidence);
    const weightedManual = Math.round(
      result.dimensions.reduce((sum, d) => {
        const w = DIMENSION_WEIGHTS[d.dimension] ?? (1 / result.dimensions.length);
        return sum + d.score * w;
      }, 0)
    );
    expect(result.overall).toBe(weightedManual);
  });

  it('higher-weighted dimensions have more impact on overall score', () => {
    // Technical Skills (0.20) should outweigh Role-Specific Fit (0.10)
    expect(DIMENSION_WEIGHTS['Technical Skills']).toBeGreaterThan(DIMENSION_WEIGHTS['Role-Specific Fit (Software Engineer)']);
    expect(DIMENSION_WEIGHTS['Portfolio Evidence']).toBeGreaterThan(DIMENSION_WEIGHTS['Role-Specific Fit (Software Engineer)']);
  });
});
