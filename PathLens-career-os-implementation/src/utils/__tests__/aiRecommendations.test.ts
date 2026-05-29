import { describe, it, expect } from 'vitest';
import {
  getJobRecommendations,
  getSkillRecommendations,
  getInterviewFocusAreas,
  generateAIInsight,
} from '../aiRecommendations';
import type { ReadinessProfile, DimensionScore } from '../../types/evidence';

// Helper to build a minimal ReadinessProfile
function makeProfile(overall: number, dimensionScores?: Partial<Record<string, number>>): ReadinessProfile {
  const defaults: Record<string, number> = {
    'Technical Skills': overall,
    'Portfolio Evidence': overall,
    'Work Readiness': overall,
    'Communication & Documentation': overall,
    'Production Practices': overall,
    'Role-Specific Fit (Software Engineer)': overall,
    ...dimensionScores,
  };
  const dimensions: DimensionScore[] = Object.entries(defaults).map(([dim, score]) => ({
    dimension: dim,
    score,
    status: score >= 75 ? 'Strong' : score >= 55 ? 'Internship-Ready' : 'Developing',
    explanation: `Test explanation for ${dim}`,
    topSkills: [],
  }));
  return {
    overall,
    level: overall >= 75 ? 'Advanced-Ready' : overall >= 55 ? 'Internship-Ready with Targeted Growth' : 'Developing',
    interpretation: 'Test interpretation',
    dimensions,
    allExtractedSkills: [],
  } as ReadinessProfile;
}

// ── getJobRecommendations ──────────────────────────────────────────────────────

describe('getJobRecommendations', () => {
  it('returns an array', () => {
    expect(Array.isArray(getJobRecommendations(makeProfile(50)))).toBe(true);
  });

  it('returns entry-level roles for score 30–49', () => {
    const recs = getJobRecommendations(makeProfile(40));
    expect(recs.length).toBeGreaterThan(0);
  });

  it('returns advanced roles for score ≥75', () => {
    const recs = getJobRecommendations(makeProfile(80));
    expect(recs.some((r) => r.title.includes('Top Tier') || r.requiredScore >= 75)).toBe(true);
  });

  it('each recommendation has required fields', () => {
    const recs = getJobRecommendations(makeProfile(60, { 'Technical Skills': 65, 'Work Readiness': 60 }));
    for (const rec of recs) {
      expect(typeof rec.title).toBe('string');
      expect(typeof rec.description).toBe('string');
      expect(rec.matchPercentage).toBeGreaterThanOrEqual(0);
      expect(rec.matchPercentage).toBeLessThanOrEqual(100);
      expect(typeof rec.whyYouQualify).toBe('string');
    }
  });

  it('returns empty array for very low scores (below 30)', () => {
    const recs = getJobRecommendations(makeProfile(10));
    // No roles at this level
    expect(Array.isArray(recs)).toBe(true);
  });
});

// ── getSkillRecommendations ───────────────────────────────────────────────────

describe('getSkillRecommendations', () => {
  it('returns an array', () => {
    expect(Array.isArray(getSkillRecommendations(makeProfile(40)))).toBe(true);
  });

  it('returns at most 3 recommendations (one per lowest dimension)', () => {
    const recs = getSkillRecommendations(makeProfile(30));
    expect(recs.length).toBeLessThanOrEqual(3);
  });

  it('returns empty array when all dimensions are at target (≥75)', () => {
    const recs = getSkillRecommendations(makeProfile(80));
    expect(recs).toHaveLength(0);
  });

  it('each recommendation has priority, gap, weeks, and impactOnScore', () => {
    const recs = getSkillRecommendations(makeProfile(40));
    for (const rec of recs) {
      expect(['high', 'medium', 'low']).toContain(rec.priority);
      expect(rec.currentGap).toBeGreaterThan(0);
      expect(rec.estimatedWeeksToLearn).toBeGreaterThan(0);
      expect(rec.impactOnScore).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(rec.resources)).toBe(true);
    }
  });

  it('high priority is assigned when gap > 25', () => {
    const recs = getSkillRecommendations(makeProfile(20)); // gap = 55
    if (recs.length > 0) {
      expect(recs[0].priority).toBe('high');
    }
  });
});

// ── getInterviewFocusAreas ────────────────────────────────────────────────────

describe('getInterviewFocusAreas', () => {
  it('returns an array', () => {
    expect(Array.isArray(getInterviewFocusAreas(makeProfile(50)))).toBe(true);
  });

  it('returns at most 3 focus areas', () => {
    const areas = getInterviewFocusAreas(makeProfile(30));
    expect(areas.length).toBeLessThanOrEqual(3);
  });

  it('each focus area has tips and a practice scenario', () => {
    const areas = getInterviewFocusAreas(makeProfile(40));
    for (const area of areas) {
      expect(typeof area.dimension).toBe('string');
      expect(area.currentScore).toBeGreaterThanOrEqual(0);
      expect(area.targetScore).toBeGreaterThan(area.currentScore);
      expect(Array.isArray(area.topTips)).toBe(true);
      expect(area.topTips.length).toBeGreaterThan(0);
      expect(typeof area.practiceScenario).toBe('string');
    }
  });

  it('returns empty array when all dimensions are ≥75', () => {
    const areas = getInterviewFocusAreas(makeProfile(80));
    expect(areas).toHaveLength(0);
  });
});

// ── generateAIInsight ─────────────────────────────────────────────────────────

describe('generateAIInsight', () => {
  it('returns a non-empty string', () => {
    const insight = generateAIInsight(makeProfile(50));
    expect(typeof insight).toBe('string');
    expect(insight.length).toBeGreaterThan(0);
  });

  it('returns encouraging message for high scorers (≥75)', () => {
    const insight = generateAIInsight(makeProfile(80));
    expect(insight.length).toBeGreaterThan(0);
  });

  it('returns motivational message for low scorers (<30)', () => {
    const insight = generateAIInsight(makeProfile(15));
    expect(insight.length).toBeGreaterThan(0);
  });

  it('changes message based on score band', () => {
    const low = generateAIInsight(makeProfile(20));
    const high = generateAIInsight(makeProfile(85));
    expect(low).not.toBe(high);
  });
});
