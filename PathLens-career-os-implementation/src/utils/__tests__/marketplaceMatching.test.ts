import { describe, expect, it } from 'vitest';
import { Gap, ReadinessProfile } from '../../types/evidence';
import { InternshipRole, matchMarketplaceRoles } from '../marketplaceMatching';

const platformRole: InternshipRole = {
  id: 'test-platform',
  title: 'Platform Intern',
  company: 'Test company',
  market: 'Malaysia',
  description: 'Build production product features.',
  requiredSkills: ['JavaScript / TypeScript', 'React', 'RESTful APIs'],
  niceToHaveSkills: ['Testing & Test Automation', 'CI/CD Pipelines'],
  dimensionThresholds: {
    'Technical Skills': 65,
    'Production Practices': 55,
  },
  minimumOverall: 65,
  growthPath: 'Ship a tested feature.',
};

function makeProfile(overrides: Partial<ReadinessProfile> = {}): ReadinessProfile {
  return {
    overall: 76,
    level: 'Advanced-Ready',
    interpretation: 'Strong profile.',
    allExtractedSkills: [
      {
        skill: 'JavaScript / TypeScript',
        confidence: 'high',
        sourceEvidenceId: 'e1',
        sourcePhrase: 'Built with TypeScript',
      },
      {
        skill: 'React',
        confidence: 'high',
        sourceEvidenceId: 'e1',
        sourcePhrase: 'React dashboard',
      },
      {
        skill: 'RESTful APIs',
        confidence: 'medium',
        sourceEvidenceId: 'e2',
        sourcePhrase: 'REST API backend',
      },
      {
        skill: 'Testing & Test Automation',
        confidence: 'medium',
        sourceEvidenceId: 'e2',
        sourcePhrase: 'Wrote unit tests',
      },
    ],
    dimensions: [
      {
        dimension: 'Technical Skills',
        score: 82,
        status: 'Strong',
        explanation: 'Strong technical base.',
        topSkills: [],
      },
      {
        dimension: 'Production Practices',
        score: 62,
        status: 'Internship-Ready',
        explanation: 'Some production practice.',
        topSkills: [],
      },
    ],
    ...overrides,
  };
}

const productionGap: Gap = {
  dimension: 'Production Practices',
  score: 35,
  explanation: 'Limited production evidence.',
  whyMatters: 'Production maturity matters for internships.',
  nextActions: [
    {
      title: 'Add automated tests',
      description: 'Add tests to one project.',
      timeline: '1 week',
      effort: '4 hours',
    },
  ],
  projectedImpact: '+5-8 pts',
  dimensionWeight: 0.15,
};

describe('matchMarketplaceRoles', () => {
  it('returns a strong match when required skills and readiness bars are met', () => {
    const [match] = matchMarketplaceRoles(makeProfile(), [], [platformRole]);

    expect(match.fit).toBe('Strong match');
    expect(match.score).toBeGreaterThanOrEqual(75);
    expect(match.whyMatched).toContain('React appears in your evidence');
    expect(match.blockers).toContain('No major blocker detected in this prototype match');
  });

  it('returns a stretch match with blockers when one readiness dimension is weak', () => {
    const profile = makeProfile({
      overall: 68,
      dimensions: [
        {
          dimension: 'Technical Skills',
          score: 78,
          status: 'Strong',
          explanation: 'Strong technical base.',
          topSkills: [],
        },
        {
          dimension: 'Production Practices',
          score: 35,
          status: 'Developing',
          explanation: 'Limited production practice.',
          topSkills: [],
        },
      ],
    });

    const [match] = matchMarketplaceRoles(profile, [productionGap], [platformRole]);

    expect(match.fit).toBe('Stretch match');
    expect(match.blockers).toContain('Production Practices is 35/100; target for this role is 55+');
    expect(match.nextStep).toBe('Add automated tests. Then re-check this marketplace fit.');
  });

  it('explains missing evidence when the profile is not ready for a role', () => {
    const profile = makeProfile({
      overall: 34,
      allExtractedSkills: [],
      dimensions: [
        {
          dimension: 'Technical Skills',
          score: 30,
          status: 'Emerging',
          explanation: 'Early technical base.',
          topSkills: [],
        },
        {
          dimension: 'Production Practices',
          score: 25,
          status: 'Developing',
          explanation: 'Limited production practice.',
          topSkills: [],
        },
      ],
    });

    const [match] = matchMarketplaceRoles(profile, [], [platformRole]);

    expect(match.fit).toBe('Build toward');
    expect(match.blockers).toContain('Missing required evidence for JavaScript / TypeScript');
    expect(match.blockers).toContain('Overall readiness is 34/100; this role expects 65+');
  });
});
