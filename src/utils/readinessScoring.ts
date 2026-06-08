import { Evidence, ExtractedSkill, DimensionScore, ReadinessProfile } from '../types/evidence';
import { extractSkillsFromEvidence } from './skillExtraction';

/**
 * Dimension weights for the weighted overall readiness score.
 *
 * Weights reflect the relative importance of each dimension for
 * internship readiness in the Asia tech market:
 *  - Technical Skills (20%) — core programming capability
 *  - Portfolio Evidence (20%) — demonstrated project delivery
 *  - Work Readiness (20%) — real-world collaboration signals
 *  - Communication & Documentation (15%) — critical for engineering teams
 *  - Production Practices (15%) — testing/CI/CD/deployment maturity
 *  - Role-Specific Fit (10%) — alignment to target role
 *
 * These weights are also used by nextActions.ts for projected impact scoring.
 */
export const DIMENSION_WEIGHTS: Record<string, number> = {
  'Technical Skills': 0.20,
  'Portfolio Evidence': 0.20,
  'Work Readiness': 0.20,
  'Communication & Documentation': 0.15,
  'Production Practices': 0.15,
  'Role-Specific Fit (Software Engineer)': 0.10,
};

/**
 * Calculates a full career readiness profile from a student's evidence items.
 *
 * Scores are computed across 6 dimensions using deterministic, keyword-based
 * rules — no LLM or external APIs required. The overall score is a weighted
 * average using DIMENSION_WEIGHTS (not a simple mean), reflecting the relative
 * importance of each dimension for Asia tech internships.
 *
 * @param evidence - Array of evidence items submitted by the student
 * @returns ReadinessProfile with per-dimension scores, weighted overall score, and level
 */
export function calculateReadinessProfile(evidence: Evidence[]): ReadinessProfile {
  const allExtractedSkills = extractSkillsFromEvidence(evidence);

  const dimensions: DimensionScore[] = [
    scoreTechnicalSkills(allExtractedSkills),
    scorePortfolioEvidence(evidence),
    scoreWorkReadiness(evidence),
    scoreCommunication(evidence),
    scoreProductionPractices(evidence),
    scoreRoleSpecificFit(allExtractedSkills, evidence),
  ];

  // Weighted average — dimensions with higher market importance contribute more to the overall score
  const overallScore = Math.round(
    dimensions.reduce((sum, d) => {
      const weight = DIMENSION_WEIGHTS[d.dimension] ?? (1 / dimensions.length);
      return sum + d.score * weight;
    }, 0)
  );

  const level =
    overallScore >= 75
      ? 'Advanced-Ready'
      : overallScore >= 55
        ? 'Internship-Ready with Targeted Growth'
        : overallScore >= 30
          ? 'Developing'
          : 'Emerging';

  const interpretation =
    overallScore >= 75
      ? 'Highly competitive for entry-level roles. Strong across all dimensions.'
      : overallScore >= 55
        ? 'You have a solid foundation and real experience. Close the gaps below to be highly competitive for internships.'
        : overallScore >= 30
          ? 'You\'re building skills. Focus on the priority gaps to reach internship-ready.'
          : 'You\'re early in your journey. Start with foundational projects and experience.';

  return {
    overall: overallScore,
    level,
    interpretation,
    dimensions,
    allExtractedSkills,
  };
}

function scoreTechnicalSkills(skills: ExtractedSkill[]): DimensionScore {
  const programmingLanguages = ['Python', 'JavaScript / TypeScript', 'Java', 'C / C++', 'SQL'];
  const frameworks = ['React', 'Node.js / Express', 'Vue.js'];

  let score = 0;
  const foundLanguages = new Set<string>();
  const foundFrameworks = new Set<string>();

  for (const skill of skills) {
    if (programmingLanguages.includes(skill.skill)) {
      foundLanguages.add(skill.skill);
      score += 18;
    } else if (frameworks.includes(skill.skill)) {
      foundFrameworks.add(skill.skill);
      score += 15;
    }
  }

  // Cap at realistic level for a Year 3 student
  score = Math.min(score, 80);

  const topSkills = Array.from(foundLanguages)
    .concat(Array.from(foundFrameworks))
    .slice(0, 3);

  return {
    dimension: 'Technical Skills',
    score: Math.max(50, Math.min(score, 85)),
    status: score >= 75 ? 'Strong' : score >= 55 ? 'Internship-Ready' : 'Developing',
    explanation:
      score >= 75
        ? 'Strong programming foundation across multiple languages and frameworks.'
        : score >= 55
          ? 'Solid technical skills in core languages and frameworks. Room to grow in advanced areas.'
          : 'Basic technical knowledge. Consider deepening expertise in key languages.',
    topSkills: topSkills.length > 0 ? topSkills : [],
  };
}

function scorePortfolioEvidence(evidence: Evidence[]): DimensionScore {
  let score = 0;

  const evidenceTypes = new Set(evidence.map((e) => e.type));

  // Base score for number of artifacts
  if (evidence.length >= 3) score += 20;
  else if (evidence.length >= 2) score += 15;
  else if (evidence.length >= 1) score += 10;

  // Type diversity
  if (evidenceTypes.has('fyp')) score += 15;
  if (evidenceTypes.has('internship')) score += 15;
  if (evidenceTypes.has('portfolio')) score += 15;
  if (evidenceTypes.has('certificate')) score += 5;
  if (evidenceTypes.has('hackathon')) score += 5;

  score = Math.min(score, 80);

  return {
    dimension: 'Portfolio Evidence',
    score: Math.max(50, Math.min(score, 80)),
    status: score >= 75 ? 'Strong' : score >= 55 ? 'Internship-Ready' : 'Developing',
    explanation:
      score >= 75
        ? 'Excellent collection of diverse, well-documented projects.'
        : score >= 55
          ? 'Good portfolio with multiple project types. Add more details or projects.'
          : 'Limited portfolio. Build and document more projects.',
    topSkills: [],
  };
}

function scoreWorkReadiness(evidence: Evidence[]): DimensionScore {
  const workRelatedKeywords = [
    'api',
    'agile',
    'sprint',
    'standup',
    'collaboration',
    'team',
    'debugging',
    'debug',
    'production',
  ];

  let score = 0;
  const combinedText = evidence.map((e) => `${e.description}`.toLowerCase()).join(' ');

  if (evidence.some((e) => e.type === 'internship')) {
    score += 30;
  }

  for (const keyword of workRelatedKeywords) {
    if (combinedText.includes(keyword)) {
      score += 8;
    }
  }

  score = Math.min(score, 100);

  return {
    dimension: 'Work Readiness',
    score: Math.max(40, Math.min(score, 100)),
    status: score >= 75 ? 'Strong' : score >= 55 ? 'Internship-Ready' : 'Developing',
    explanation:
      score >= 75
        ? 'Clear internship or real-world work experience. Ready for structured roles.'
        : score >= 55
          ? 'Some work experience signals. Would benefit from formal internship or team project.'
          : 'Limited work experience. Seek internship or team-based projects.',
    topSkills: [],
  };
}

function scoreCommunication(evidence: Evidence[]): DimensionScore {
  let score = 0;

  for (const item of evidence) {
    if (item.description && item.description.length > 300) {
      score += 20;
    } else if (item.description && item.description.length > 150) {
      score += 12;
    }
  }

  const hasDocKeywords = evidence.some((e) =>
    `${e.description}`.toLowerCase().includes('documentation')
  );
  if (hasDocKeywords) score += 15;

  const hasReadmeLink = evidence.some((e) => e.description && e.description.toLowerCase().includes('readme'));
  if (hasReadmeLink) score += 15;

  const hasBlogLink = evidence.some((e) => e.description && e.description.toLowerCase().includes('blog'));
  if (hasBlogLink) score += 10;

  score = Math.min(score, 100);

  return {
    dimension: 'Communication & Documentation',
    score: Math.max(50, Math.min(score, 100)),
    status: score >= 75 ? 'Strong' : score >= 55 ? 'Internship-Ready' : 'Developing',
    explanation:
      score >= 75
        ? 'Excellent at explaining work through documentation and clear descriptions.'
        : score >= 55
          ? 'Good communication skills. Could improve with more detailed documentation.'
          : 'Work on articulating and documenting your projects clearly.',
    topSkills: [],
  };
}

function scoreProductionPractices(evidence: Evidence[]): DimensionScore {
  const productionKeywords = [
    'test',
    'testing',
    'ci/cd',
    'deployment',
    'deploy',
    'docker',
    'monitoring',
    'devops',
    'code review',
  ];

  let score = 0;
  const combinedText = evidence.map((e) => `${e.description}`.toLowerCase()).join(' ');

  for (const keyword of productionKeywords) {
    if (combinedText.includes(keyword)) {
      score += 12;
    }
  }

  // Cap at 70: students without verified CI/CD, automated testing, or
  // deployment pipelines cannot score as if they have production experience.
  score = Math.min(score, 70);

  return {
    dimension: 'Production Practices',
    score: Math.max(25, Math.min(score, 70)),
    status: score >= 65 ? 'Strong' : score >= 48 ? 'Internship-Ready' : 'Developing',
    explanation:
      score >= 65
        ? 'Good evidence of testing, CI/CD, and deployment practices. Scores above 70 require verified production deployments.'
        : score >= 48
          ? 'Some production practice signals detected. Add automated tests or a CI/CD pipeline to strengthen this dimension.'
          : 'Limited production practice evidence. Add testing, deployment, or CI/CD to at least one project.',
    topSkills: [],
  };
}

function scoreRoleSpecificFit(skills: ExtractedSkill[], evidence: Evidence[]): DimensionScore {
  const sweFocusSkills = [
    'Python',
    'JavaScript / TypeScript',
    'Java',
    'React',
    'Node.js / Express',
    'RESTful APIs',
    'System Design & Architecture',
  ];

  let score = 0;
  for (const skill of skills) {
    if (sweFocusSkills.includes(skill.skill)) {
      score += 10;
    }
  }

  if (evidence.some((e) => e.type === 'internship')) {
    score += 20;
  }

  if (evidence.some((e) => e.type === 'portfolio')) {
    score += 10;
  }

  // Cap to create realistic spread
  score = Math.min(score, 75);

  return {
    dimension: 'Role-Specific Fit (Software Engineer)',
    score: Math.max(50, Math.min(score, 75)),
    status: score >= 75 ? 'Strong' : score >= 55 ? 'Internship-Ready' : 'Developing',
    explanation:
      score >= 75
        ? 'Excellent fit for software engineering roles. Strong in backend, frontend, and systems thinking.'
        : score >= 55
          ? 'Good fit for junior software engineer roles. Strengthen system design and production practices.'
          : 'Building toward SWE career. Focus on core languages and real-world projects.',
    topSkills: [],
  };
}
