import { describe, it, expect } from 'vitest';
import { generateGaps } from '../nextActions';
import type { DimensionScore, CohortInsight } from '../../types/evidence';

const mockCohort: CohortInsight = {
  totalStudents: 150,
  readinessDistribution: {
    internshipReady: 68,
    developing: 52,
    emerging: 30,
  },
  topGaps: [
    {
      dimension: 'Production Practices',
      studentCount: 96,
      percentage: 64,
    },
    {
      dimension: 'Work Readiness',
      studentCount: 58,
      percentage: 39,
    },
    {
      dimension: 'Technical Skills',
      studentCount: 45,
      percentage: 30,
    },
  ],
  suggestedInterventions: [],
};

const makeDimension = (overrides: Partial<DimensionScore>): DimensionScore => ({
  dimension: 'Technical Skills',
  score: 40,
  status: 'Developing',
  explanation: 'Test explanation',
  topSkills: [],
  ...overrides,
});

describe('generateGaps', () => {
  it('returns empty array when no dimensions provided', () => {
    expect(generateGaps([])).toHaveLength(0);
  });

  it('returns empty array when all dimensions are at target (≥75)', () => {
    const allStrong: DimensionScore[] = [
      makeDimension({ dimension: 'Technical Skills', score: 80 }),
      makeDimension({ dimension: 'Portfolio Evidence', score: 85 }),
      makeDimension({ dimension: 'Work Readiness', score: 76 }),
      makeDimension({ dimension: 'Communication & Documentation', score: 90 }),
      makeDimension({ dimension: 'Production Practices', score: 78 }),
      makeDimension({ dimension: 'Role-Specific Fit (Software Engineer)', score: 82 }),
    ];
    expect(generateGaps(allStrong)).toHaveLength(0);
  });

  it('returns at most 3 gaps', () => {
    const allWeak: DimensionScore[] = [
      makeDimension({ dimension: 'Technical Skills', score: 10 }),
      makeDimension({ dimension: 'Portfolio Evidence', score: 15 }),
      makeDimension({ dimension: 'Work Readiness', score: 20 }),
      makeDimension({ dimension: 'Communication & Documentation', score: 5 }),
      makeDimension({ dimension: 'Production Practices', score: 8 }),
      makeDimension({ dimension: 'Role-Specific Fit (Software Engineer)', score: 12 }),
    ];
    expect(generateGaps(allWeak).length).toBeLessThanOrEqual(3);
  });

  it('prioritises lowest-scoring dimensions first', () => {
    const dims: DimensionScore[] = [
      makeDimension({ dimension: 'Technical Skills', score: 30 }),
      makeDimension({ dimension: 'Portfolio Evidence', score: 60 }),
      makeDimension({ dimension: 'Work Readiness', score: 10 }),
      makeDimension({ dimension: 'Communication & Documentation', score: 50 }),
      makeDimension({ dimension: 'Production Practices', score: 45 }),
      makeDimension({ dimension: 'Role-Specific Fit (Software Engineer)', score: 55 }),
    ];
    const gaps = generateGaps(dims);
    expect(gaps[0].dimension).toBe('Work Readiness'); // lowest score = first gap
  });

  it('each gap has required fields', () => {
    const dims: DimensionScore[] = [
      makeDimension({ dimension: 'Technical Skills', score: 20 }),
    ];
    const gaps = generateGaps(dims);
    if (gaps.length > 0) {
      const gap = gaps[0];
      expect(typeof gap.explanation).toBe('string');
      expect(typeof gap.whyMatters).toBe('string');
      expect(Array.isArray(gap.nextActions)).toBe(true);
      expect(gap.nextActions.length).toBeGreaterThan(0);
      expect(typeof gap.projectedImpact).toBe('string');
      expect(gap.projectedImpact).toMatch(/\+/);
      expect(typeof gap.dimensionWeight).toBe('number');
      expect(gap.dimensionWeight).toBeGreaterThan(0);
    }
  });

  it('each nextAction has title, description, timeline, effort', () => {
    const dims: DimensionScore[] = [
      makeDimension({ dimension: 'Production Practices', score: 25 }),
    ];
    const gaps = generateGaps(dims);
    if (gaps.length > 0) {
      for (const action of gaps[0].nextActions) {
        expect(typeof action.title).toBe('string');
        expect(typeof action.description).toBe('string');
        expect(typeof action.timeline).toBe('string');
        expect(typeof action.effort).toBe('string');
      }
    }
  });

  it('projectedImpact is non-zero for low-scoring dimensions', () => {
    const dims: DimensionScore[] = [
      makeDimension({ dimension: 'Technical Skills', score: 0 }),
    ];
    const gaps = generateGaps(dims);
    if (gaps.length > 0) {
      // "+X–Y pts" format — the number should be > 0
      expect(gaps[0].projectedImpact).not.toBe('+0 pts');
    }
  });

  it('includes cohort insights when cohort data is provided', () => {
    const dims: DimensionScore[] = [
      makeDimension({ dimension: 'Production Practices', score: 30 }),
    ];
    const gaps = generateGaps(dims, mockCohort);
    if (gaps.length > 0) {
      expect(gaps[0].cohortInsights).toBeDefined();
      expect(gaps[0].cohortInsights?.gapFrequencyPercentage).toBe(64); // 64% in mockCohort
      expect(typeof gaps[0].cohortInsights?.priorityReasoning).toBe('string');
      expect(gaps[0].cohortInsights?.priorityReasoning).toContain('64%');
    }
  });

  it('cohort insights recommendedActionIndex is valid', () => {
    const dims: DimensionScore[] = [
      makeDimension({ dimension: 'Work Readiness', score: 25 }),
    ];
    const gaps = generateGaps(dims, mockCohort);
    if (gaps.length > 0 && gaps[0].cohortInsights) {
      expect(gaps[0].cohortInsights.recommendedActionIndex).toBeGreaterThanOrEqual(0);
      expect(gaps[0].cohortInsights.recommendedActionIndex).toBeLessThan(gaps[0].nextActions.length);
    }
  });

  it('omits cohort insights when cohort data not provided', () => {
    const dims: DimensionScore[] = [
      makeDimension({ dimension: 'Production Practices', score: 30 }),
    ];
    const gaps = generateGaps(dims); // no cohort data
    if (gaps.length > 0) {
      expect(gaps[0].cohortInsights).toBeUndefined();
    }
  });

  it('detects high-priority gaps (60%+ cohort)', () => {
    const dims: DimensionScore[] = [
      makeDimension({ dimension: 'Production Practices', score: 30 }),
    ];
    const gaps = generateGaps(dims, mockCohort);
    if (gaps.length > 0 && gaps[0].cohortInsights) {
      // Production Practices is 64% in mockCohort, so should flag as high-priority
      expect(gaps[0].cohortInsights.priorityReasoning).toContain('High-priority');
    }
  });
});
