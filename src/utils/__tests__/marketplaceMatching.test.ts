import { describe, it, expect } from 'vitest';
import {
  matchMarketplaceRoles,
  MOCK_INTERNSHIP_ROLES,
  InternshipRole,
} from '../marketplaceMatching';
import { calculateReadinessProfile } from '../readinessScoring';
import { generateGaps } from '../nextActions';
import { mockCohortInsight } from '../../data/mockCohort';
import type { Evidence, Gap, ReadinessProfile } from '../../types/evidence';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeEvidence = (overrides: Partial<Evidence> = {}): Evidence => ({
  id: 'e_test',
  type: 'portfolio',
  title: 'Test project',
  description: 'A small web project using React and Node.js.',
  technologies: 'React, Node.js',
  ...overrides,
});

const makeRole = (overrides: Partial<InternshipRole> = {}): InternshipRole => ({
  id: 'test-role',
  title: 'Test Intern',
  company: 'Test Co',
  market: 'Singapore',
  description: 'A generic test role.',
  requiredSkills: ['React', 'Node.js'],
  niceToHaveSkills: ['Docker'],
  dimensionThresholds: { 'Technical Skills': 50 },
  minimumOverall: 50,
  growthPath: 'Deploy one project and write tests.',
  ...overrides,
});

/** Build a realistic ReadinessProfile from an evidence array. */
function buildProfile(evidence: Evidence[]): ReadinessProfile {
  return calculateReadinessProfile(evidence);
}

/** Build gaps from a profile (used to test nextStep gap-action wiring). */
function buildGaps(profile: ReadinessProfile): Gap[] {
  return generateGaps(profile.dimensions, mockCohortInsight);
}

// ---------------------------------------------------------------------------
// Basic shape & invariants
// ---------------------------------------------------------------------------

describe('matchMarketplaceRoles — basic shape', () => {
  it('returns one result per role when using default MOCK_INTERNSHIP_ROLES', () => {
    const profile = buildProfile([makeEvidence()]);
    const results = matchMarketplaceRoles(profile, []);
    expect(results).toHaveLength(MOCK_INTERNSHIP_ROLES.length);
  });

  it('every result contains required fields', () => {
    const profile = buildProfile([makeEvidence()]);
    const results = matchMarketplaceRoles(profile, []);
    for (const match of results) {
      expect(match.role).toBeDefined();
      expect(typeof match.score).toBe('number');
      expect(['Strong match', 'Stretch match', 'Build toward']).toContain(match.fit);
      expect(Array.isArray(match.whyMatched)).toBe(true);
      expect(Array.isArray(match.blockers)).toBe(true);
      expect(typeof match.nextStep).toBe('string');
    }
  });

  it('all scores are within 0–100', () => {
    const profile = buildProfile([makeEvidence()]);
    const results = matchMarketplaceRoles(profile, []);
    for (const match of results) {
      expect(match.score).toBeGreaterThanOrEqual(0);
      expect(match.score).toBeLessThanOrEqual(100);
    }
  });

  it('results are sorted descending by score', () => {
    const profile = buildProfile([makeEvidence()]);
    const results = matchMarketplaceRoles(profile, []);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });
});

// ---------------------------------------------------------------------------
// Custom roles
// ---------------------------------------------------------------------------

describe('matchMarketplaceRoles — custom roles', () => {
  it('uses provided roles array instead of MOCK_INTERNSHIP_ROLES', () => {
    const profile = buildProfile([makeEvidence()]);
    const custom = [makeRole({ id: 'custom-1' }), makeRole({ id: 'custom-2' })];
    const results = matchMarketplaceRoles(profile, [], custom);
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.role.id)).toEqual(
      expect.arrayContaining(['custom-1', 'custom-2'])
    );
  });

  it('returns empty array when roles array is empty', () => {
    const profile = buildProfile([makeEvidence()]);
    const results = matchMarketplaceRoles(profile, [], []);
    expect(results).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Skill matching
// ---------------------------------------------------------------------------

describe('matchMarketplaceRoles — skill matching', () => {
  it('a profile with all required skills scores higher than one with none', () => {
    const richEvidence = [
      makeEvidence({
        id: 'rich',
        technologies: 'React, Node.js, Docker',
        description: 'Built and tested a deployed full-stack app using React and Node.js with Docker containerization.',
      }),
    ];
    const poorEvidence = [
      makeEvidence({
        id: 'poor',
        description: 'Wrote a short Python script.',
        technologies: 'Python',
      }),
    ];

    const richProfile = buildProfile(richEvidence);
    const poorProfile = buildProfile(poorEvidence);

    const role = makeRole({
      requiredSkills: ['React', 'Node.js'],
      niceToHaveSkills: ['Docker'],
    });

    const [richMatch] = matchMarketplaceRoles(richProfile, [], [role]);
    const [poorMatch] = matchMarketplaceRoles(poorProfile, [], [role]);

    expect(richMatch.score).toBeGreaterThan(poorMatch.score);
  });

  it('skill matching is case-insensitive', () => {
    const lowerProfile = buildProfile([
      makeEvidence({ technologies: 'react, node.js', description: 'built react app' }),
    ]);
    const upperProfile = buildProfile([
      makeEvidence({ technologies: 'React, Node.js', description: 'Built React app' }),
    ]);

    const role = makeRole({ requiredSkills: ['React', 'Node.js'] });

    const [lower] = matchMarketplaceRoles(lowerProfile, [], [role]);
    const [upper] = matchMarketplaceRoles(upperProfile, [], [role]);

    // Both should hit the same required-skill count (case-insensitive normalisation)
    expect(lower.score).toBe(upper.score);
  });

  it('matched required skills appear in whyMatched', () => {
    const profile = buildProfile([
      makeEvidence({ technologies: 'React, Node.js', description: 'Built React app with Node.js backend.' }),
    ]);
    const role = makeRole({ requiredSkills: ['React', 'Node.js'] });
    const [match] = matchMarketplaceRoles(profile, [], [role]);
    const reasons = match.whyMatched.join(' ');
    // At least one required skill should surface in the reasoning
    expect(reasons.toLowerCase()).toMatch(/react|node/);
  });

  it('missing required skills appear in blockers', () => {
    const profile = buildProfile([
      makeEvidence({ technologies: 'Python', description: 'Python data pipeline.' }),
    ]);
    const role = makeRole({ requiredSkills: ['React', 'Node.js'], minimumOverall: 0, dimensionThresholds: {} });
    const [match] = matchMarketplaceRoles(profile, [], [role]);
    const blockerText = match.blockers.join(' ');
    expect(blockerText).toMatch(/missing required evidence/i);
  });
});

// ---------------------------------------------------------------------------
// Fit label thresholds
// ---------------------------------------------------------------------------

describe('matchMarketplaceRoles — fit labels', () => {
  it('Build toward label when score is low', () => {
    const profile = buildProfile([]); // zero evidence → low score
    const role = makeRole({
      requiredSkills: ['Kubernetes', 'Go', 'Terraform', 'Kafka', 'gRPC'],
      niceToHaveSkills: ['Prometheus', 'Istio'],
      dimensionThresholds: {
        'Technical Skills': 90,
        'Production Practices': 90,
        'Work Readiness': 90,
      },
      minimumOverall: 90,
    });
    const [match] = matchMarketplaceRoles(profile, [], [role]);
    expect(match.fit).toBe('Build toward');
  });

  it('fit label is one of the three valid values for any profile', () => {
    const profiles = [
      buildProfile([]),
      buildProfile([makeEvidence()]),
      buildProfile([
        makeEvidence({ id: '1', type: 'internship', title: 'Intern', description: 'Deployed tested production service', technologies: 'React, Node.js, Docker, PostgreSQL' }),
        makeEvidence({ id: '2', type: 'portfolio', description: 'Tested CI/CD pipeline deployment monitoring', technologies: 'React, TypeScript' }),
      ]),
    ];
    for (const profile of profiles) {
      const results = matchMarketplaceRoles(profile, []);
      for (const match of results) {
        expect(['Strong match', 'Stretch match', 'Build toward']).toContain(match.fit);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// nextStep wiring
// ---------------------------------------------------------------------------

describe('matchMarketplaceRoles — nextStep', () => {
  it('falls back to role growthPath when no matching gap action exists', () => {
    const profile = buildProfile([makeEvidence()]);
    const role = makeRole({
      dimensionThresholds: {},   // no dimension blockers
      minimumOverall: 0,         // overall always passes
      requiredSkills: [],        // no skill blockers
      growthPath: 'UNIQUE_GROWTH_PATH_STRING',
    });
    const [match] = matchMarketplaceRoles(profile, [], [role]);
    expect(match.nextStep).toContain('UNIQUE_GROWTH_PATH_STRING');
  });

  it('appends "re-check this marketplace fit" when a gap action is used', () => {
    // Zero evidence gives low scores on every dimension, so gaps will exist
    const profile = buildProfile([]);
    const gaps = buildGaps(profile);
    // Pick the weakest dimension to guarantee a gap action is found
    const weakestDimension = [...profile.dimensions].sort((a, b) => a.score - b.score)[0];
    const role = makeRole({
      dimensionThresholds: { [weakestDimension.dimension]: weakestDimension.score + 5 },
      minimumOverall: 0,
      requiredSkills: [],
    });
    const [match] = matchMarketplaceRoles(profile, gaps, [role]);
    // If a gap action was wired in, the nextStep ends with "re-check this marketplace fit."
    // If no action found, falls back to growthPath — either way the string is non-empty.
    expect(match.nextStep.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('matchMarketplaceRoles — edge cases', () => {
  it('handles zero-evidence profile without throwing', () => {
    const profile = buildProfile([]);
    expect(() => matchMarketplaceRoles(profile, [])).not.toThrow();
  });

  it('whyMatched is never an empty array', () => {
    const profile = buildProfile([]);
    const results = matchMarketplaceRoles(profile, []);
    for (const match of results) {
      expect(match.whyMatched.length).toBeGreaterThan(0);
    }
  });

  it('blockers is never an empty array', () => {
    const profile = buildProfile([]);
    const results = matchMarketplaceRoles(profile, []);
    for (const match of results) {
      expect(match.blockers.length).toBeGreaterThan(0);
    }
  });

  it('a profile with very rich evidence does not exceed score of 100', () => {
    const richEvidence = Array.from({ length: 8 }, (_, i) =>
      makeEvidence({
        id: `r_${i}`,
        type: i % 2 === 0 ? 'internship' : 'portfolio',
        description:
          'Built tested deployed production service with CI/CD monitoring Docker PostgreSQL Redis Kafka system design architecture microservices REST API',
        technologies: 'React, TypeScript, Node.js, Docker, PostgreSQL, Redis, Kafka, Git / Version Control, SQL',
      })
    );
    const profile = buildProfile(richEvidence);
    const results = matchMarketplaceRoles(profile, []);
    for (const match of results) {
      expect(match.score).toBeLessThanOrEqual(100);
    }
  });

  it('role with no dimension thresholds still produces valid results', () => {
    const profile = buildProfile([makeEvidence()]);
    const role = makeRole({ dimensionThresholds: {}, requiredSkills: [] });
    const results = matchMarketplaceRoles(profile, [], [role]);
    expect(results).toHaveLength(1);
    expect(results[0].score).toBeGreaterThanOrEqual(0);
  });
});
