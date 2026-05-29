import { describe, it, expect } from 'vitest';
import { analyzePortfolioQuality } from '../portfolioQuality';
import type { Evidence } from '../../types/evidence';

const makeEvidence = (overrides: Partial<Evidence> = {}): Evidence => ({
  id: 'e1',
  type: 'portfolio',
  title: 'My Project',
  description: 'Built a web application',
  ...overrides,
});

describe('analyzePortfolioQuality', () => {
  it('returns empty array for empty evidence', () => {
    expect(analyzePortfolioQuality([])).toHaveLength(0);
  });

  it('returns one result per evidence item', () => {
    const evidence = [makeEvidence({ id: '1' }), makeEvidence({ id: '2' }), makeEvidence({ id: '3' })];
    expect(analyzePortfolioQuality(evidence)).toHaveLength(3);
  });

  it('overall score is 0–100', () => {
    const results = analyzePortfolioQuality([makeEvidence()]);
    expect(results[0].overallScore).toBeGreaterThanOrEqual(0);
    expect(results[0].overallScore).toBeLessThanOrEqual(100);
  });

  it('returns valid category', () => {
    const results = analyzePortfolioQuality([makeEvidence()]);
    expect(['Excellent', 'Good', 'Fair', 'Needs Work']).toContain(results[0].category);
  });

  it('a GitHub link increases GitHub detection flag', () => {
    const withGit = analyzePortfolioQuality([
      makeEvidence({ link: 'https://github.com/user/project' }),
    ]);
    expect(withGit[0].productionReadiness.hasGitHubLink).toBe(true);
  });

  it('no link means hasLiveDemo = false', () => {
    const noLink = analyzePortfolioQuality([makeEvidence({ link: undefined })]);
    expect(noLink[0].productionReadiness.hasLiveDemo).toBe(false);
  });

  it('measurable outcome is detected from outcome field', () => {
    const withMetric = analyzePortfolioQuality([
      makeEvidence({ outcome: 'Reduced latency by 40%' }),
    ]);
    expect(withMetric[0].productionReadiness.hasMeasurableOutcome).toBe(true);
  });

  it('returns strengths and improvements arrays', () => {
    const results = analyzePortfolioQuality([makeEvidence()]);
    expect(Array.isArray(results[0].strengths)).toBe(true);
    expect(Array.isArray(results[0].improvements)).toBe(true);
  });

  it('FYP type scores higher complexity than certificate', () => {
    const fyp = analyzePortfolioQuality([makeEvidence({ type: 'fyp', technologies: 'Python, React, PostgreSQL, Docker' })]);
    const cert = analyzePortfolioQuality([makeEvidence({ type: 'certificate', technologies: 'AWS' })]);
    expect(fyp[0].metrics.complexity).toBeGreaterThan(cert[0].metrics.complexity);
  });

  it('itemId matches the evidence id', () => {
    const results = analyzePortfolioQuality([makeEvidence({ id: 'abc_123' })]);
    expect(results[0].itemId).toBe('abc_123');
  });
});
