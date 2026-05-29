import { describe, it, expect } from 'vitest';
import { scoreATSCompatibility } from '../atsScoring';
import { calculateReadinessProfile } from '../readinessScoring';
import type { Evidence } from '../../types/evidence';

const makeEvidence = (overrides: Partial<Evidence> = {}): Evidence => ({
  id: 'e1',
  type: 'portfolio',
  title: 'Test Project',
  description: 'Built a REST API using Python and Flask, deployed with Docker. Increased performance by 40%.',
  technologies: 'Python, Flask, Docker',
  ...overrides,
});

describe('scoreATSCompatibility', () => {
  it('returns a score between 0 and 100', () => {
    const profile = calculateReadinessProfile([makeEvidence()]);
    const result = scoreATSCompatibility(profile, [makeEvidence()]);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it('returns a valid status string', () => {
    const profile = calculateReadinessProfile([makeEvidence()]);
    const result = scoreATSCompatibility(profile, [makeEvidence()]);
    expect(['Poor', 'Fair', 'Good', 'Excellent']).toContain(result.status);
  });

  it('detects action verbs in text', () => {
    const profile = calculateReadinessProfile([makeEvidence()]);
    const result = scoreATSCompatibility(profile, [makeEvidence()]);
    expect(result.sections.actionVerbs).toBeGreaterThan(0);
  });

  it('scores higher with more technical keywords', () => {
    const sparse = calculateReadinessProfile([makeEvidence({ description: 'made a thing', technologies: '' })]);
    const rich = calculateReadinessProfile([
      makeEvidence({
        description: 'Built and deployed a REST API with Python Flask, PostgreSQL, Redis, Docker, CI/CD via GitHub Actions. Reduced latency by 40%.',
        technologies: 'Python, Flask, PostgreSQL, Redis, Docker, GitHub Actions',
      }),
    ]);
    const sparseResult = scoreATSCompatibility(sparse, [makeEvidence({ description: 'made a thing', technologies: '' })]);
    const richResult = scoreATSCompatibility(rich, [
      makeEvidence({
        description: 'Built and deployed a REST API with Python Flask, PostgreSQL, Redis, Docker, CI/CD via GitHub Actions. Reduced latency by 40%.',
        technologies: 'Python, Flask, PostgreSQL, Redis, Docker, GitHub Actions',
      }),
    ]);
    expect(richResult.overallScore).toBeGreaterThan(sparseResult.overallScore);
  });

  it('counts quantifiable measurements', () => {
    const evidence = makeEvidence({
      description: 'Reduced load time by 60%. Served 500+ users. Processed 1000 requests/day. Cost: $200/month.',
    });
    const profile = calculateReadinessProfile([evidence]);
    const result = scoreATSCompatibility(profile, [evidence]);
    expect(result.sections.measurements).toBeGreaterThan(0);
  });

  it('provides improvement suggestions array', () => {
    const profile = calculateReadinessProfile([makeEvidence()]);
    const result = scoreATSCompatibility(profile, [makeEvidence()]);
    expect(Array.isArray(result.improvement)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  it('identifies foundKeywords present in evidence text', () => {
    const evidence = makeEvidence({
      description: 'Built with Python and Docker. Used PostgreSQL database.',
      technologies: 'Python, Docker, PostgreSQL',
    });
    const profile = calculateReadinessProfile([evidence]);
    const result = scoreATSCompatibility(profile, [evidence]);
    expect(Array.isArray(result.foundKeywords)).toBe(true);
    expect(result.foundKeywords.some((k) => k.toLowerCase() === 'python')).toBe(true);
    expect(result.foundKeywords.some((k) => k.toLowerCase() === 'docker')).toBe(true);
  });

  it('identifies missingKeywords not present in evidence', () => {
    const evidence = makeEvidence({
      description: 'Built a simple HTML CSS project',
      technologies: 'HTML, CSS',
    });
    const profile = calculateReadinessProfile([evidence]);
    const result = scoreATSCompatibility(profile, [evidence]);
    expect(Array.isArray(result.missingKeywords)).toBe(true);
    expect(result.missingKeywords.length).toBeGreaterThan(0);
  });

  it('returns at most 5 missing keywords', () => {
    const evidence = makeEvidence({ description: 'minimal project', technologies: '' });
    const profile = calculateReadinessProfile([evidence]);
    const result = scoreATSCompatibility(profile, [evidence]);
    expect(result.missingKeywords.length).toBeLessThanOrEqual(5);
  });

  it('foundKeywords and missingKeywords do not overlap', () => {
    const profile = calculateReadinessProfile([makeEvidence()]);
    const result = scoreATSCompatibility(profile, [makeEvidence()]);
    const found = new Set(result.foundKeywords.map((k) => k.toLowerCase()));
    for (const missing of result.missingKeywords) {
      expect(found.has(missing.toLowerCase())).toBe(false);
    }
  });
});
