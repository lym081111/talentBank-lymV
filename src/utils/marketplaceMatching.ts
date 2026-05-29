import { Gap, ReadinessProfile } from '../types/evidence';

export interface InternshipRole {
  id: string;
  title: string;
  company: string;
  market: string;
  description: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  dimensionThresholds: Record<string, number>;
  minimumOverall: number;
  growthPath: string;
}

export interface MarketplaceMatch {
  role: InternshipRole;
  score: number;
  fit: 'Strong match' | 'Stretch match' | 'Build toward';
  whyMatched: string[];
  blockers: string[];
  nextStep: string;
}

export const MOCK_INTERNSHIP_ROLES: InternshipRole[] = [
  {
    id: 'swe-platform-kl',
    title: 'Software Engineering Intern, Platform',
    company: 'Kuala Lumpur fintech',
    market: 'Malaysia',
    description: 'Build API features, improve reliability, and contribute to production services.',
    requiredSkills: ['JavaScript / TypeScript', 'React', 'RESTful APIs', 'Git / Version Control'],
    niceToHaveSkills: ['Testing & Test Automation', 'CI/CD Pipelines', 'Deployment & Hosting'],
    dimensionThresholds: {
      'Technical Skills': 65,
      'Production Practices': 55,
      'Communication & Documentation': 55,
    },
    minimumOverall: 65,
    growthPath: 'Ship one tested, deployed feature and document the tradeoffs in your README.',
  },
  {
    id: 'data-products-sg',
    title: 'Data Products Intern',
    company: 'Singapore analytics team',
    market: 'Singapore',
    description: 'Turn raw data into dashboards, model insights, and decision-ready product metrics.',
    requiredSkills: ['Python', 'SQL', 'Data Analysis & Visualization'],
    niceToHaveSkills: ['Machine Learning Basics', 'Documentation & Communication', 'RESTful APIs'],
    dimensionThresholds: {
      'Technical Skills': 60,
      'Portfolio Evidence': 60,
      'Communication & Documentation': 55,
    },
    minimumOverall: 60,
    growthPath: 'Add one quantified data project with model accuracy, data volume, or business impact.',
  },
  {
    id: 'frontend-marketplace-regional',
    title: 'Frontend Intern, Career Marketplace',
    company: 'Regional talent platform',
    market: 'Remote, Southeast Asia',
    description: 'Create candidate-facing marketplace screens and evidence-backed profile cards.',
    requiredSkills: ['React', 'JavaScript / TypeScript', 'HTML / CSS'],
    niceToHaveSkills: ['Documentation & Communication', 'Testing & Test Automation', 'Next.js'],
    dimensionThresholds: {
      'Technical Skills': 60,
      'Portfolio Evidence': 60,
      'Role-Specific Fit (Software Engineer)': 55,
    },
    minimumOverall: 58,
    growthPath: 'Polish one frontend case study with screenshots, deployment link, and accessibility notes.',
  },
  {
    id: 'backend-api-jakarta',
    title: 'Backend API Intern',
    company: 'Jakarta commerce startup',
    market: 'Indonesia',
    description: 'Work on service endpoints, database models, and integration reliability.',
    requiredSkills: ['RESTful APIs', 'Database Design', 'SQL', 'Git / Version Control'],
    niceToHaveSkills: ['Docker / Containerization', 'CI/CD Pipelines', 'System Design & Architecture'],
    dimensionThresholds: {
      'Technical Skills': 62,
      'Work Readiness': 55,
      'Production Practices': 55,
    },
    minimumOverall: 62,
    growthPath: 'Add API tests and a short architecture note to an existing backend project.',
  },
];

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

function findDimensionScore(profile: ReadinessProfile, dimension: string): number {
  return profile.dimensions.find((item) => item.dimension === dimension)?.score ?? 0;
}

function findBestGapAction(gaps: Gap[], dimension: string): string | undefined {
  const gap = gaps.find((item) => item.dimension === dimension);
  return gap?.nextActions[0]?.title;
}

export function matchMarketplaceRoles(
  profile: ReadinessProfile,
  gaps: Gap[],
  roles: InternshipRole[] = MOCK_INTERNSHIP_ROLES
): MarketplaceMatch[] {
  const skillSet = new Set(profile.allExtractedSkills.map((item) => normalizeSkill(item.skill)));

  return roles
    .map((role) => {
      const matchedRequired = role.requiredSkills.filter((skill) => skillSet.has(normalizeSkill(skill)));
      const matchedNice = role.niceToHaveSkills.filter((skill) => skillSet.has(normalizeSkill(skill)));
      const missingRequired = role.requiredSkills.filter((skill) => !skillSet.has(normalizeSkill(skill)));

      const dimensionEntries = Object.entries(role.dimensionThresholds);
      const dimensionsMet = dimensionEntries.filter(([dimension, threshold]) => {
        return findDimensionScore(profile, dimension) >= threshold;
      });
      const dimensionsBelow = dimensionEntries.filter(([dimension, threshold]) => {
        return findDimensionScore(profile, dimension) < threshold;
      });

      const skillScore =
        (matchedRequired.length / Math.max(role.requiredSkills.length, 1)) * 45 +
        (matchedNice.length / Math.max(role.niceToHaveSkills.length, 1)) * 15;
      const dimensionScore = (dimensionsMet.length / Math.max(dimensionEntries.length, 1)) * 25;
      const overallScore = Math.min(profile.overall / Math.max(role.minimumOverall, 1), 1) * 15;
      const score = Math.round(Math.min(skillScore + dimensionScore + overallScore, 100));

      const blockers = [
        ...missingRequired.slice(0, 3).map((skill) => `Missing required evidence for ${skill}`),
        ...dimensionsBelow.map(([dimension, threshold]) => {
          const current = findDimensionScore(profile, dimension);
          return `${dimension} is ${current}/100; target for this role is ${threshold}+`;
        }),
        ...(profile.overall < role.minimumOverall
          ? [`Overall readiness is ${profile.overall}/100; this role expects ${role.minimumOverall}+`]
          : []),
      ];

      const whyMatched = [
        ...matchedRequired.slice(0, 3).map((skill) => `${skill} appears in your evidence`),
        ...dimensionsMet.slice(0, 2).map(([dimension]) => `${dimension} meets this role's readiness bar`),
        ...(profile.overall >= role.minimumOverall
          ? [`Overall readiness clears the ${role.minimumOverall}+ role bar`]
          : []),
      ].slice(0, 5);

      const firstDimensionBlocker = dimensionsBelow[0]?.[0];
      const gapAction = firstDimensionBlocker ? findBestGapAction(gaps, firstDimensionBlocker) : undefined;
      const nextStep = gapAction
        ? `${gapAction}. Then re-check this marketplace fit.`
        : role.growthPath;

      const fit: MarketplaceMatch['fit'] =
        score >= 75 && blockers.length === 0
          ? 'Strong match'
          : score >= 55
            ? 'Stretch match'
            : 'Build toward';

      return {
        role,
        score,
        fit,
        whyMatched: whyMatched.length > 0 ? whyMatched : ['Your profile creates a starting point for this path'],
        blockers: blockers.length > 0 ? blockers : ['No major blocker detected in this prototype match'],
        nextStep,
      };
    })
    .sort((a, b) => b.score - a.score);
}
