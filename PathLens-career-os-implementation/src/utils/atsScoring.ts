/**
 * ATS Resume Scoring
 * Analyzes a student's profile and evidence to generate ATS compatibility score
 * Simulates how an Applicant Tracking System would rate their resume
 */

import { ReadinessProfile, Evidence } from '../types/evidence';

export interface ATSScore {
  overallScore: number; // 0-100
  status: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  sections: {
    keywords: number; // How many relevant technical keywords detected
    technicalTerms: number; // Programming languages, frameworks, tools
    actionVerbs: number; // Strong action verbs used
    measurements: number; // Quantifiable achievements
    formatting: number; // Formatting score (0-100)
  };
  improvement: string[];
  recommendations: string[];
  /** High-value keywords missing from the student's evidence that would boost ATS score */
  missingKeywords: string[];
  /** Keywords already found in the student's evidence */
  foundKeywords: string[];
}

const TECHNICAL_KEYWORDS = [
  // Languages
  'python', 'javascript', 'java', 'typescript', 'c#', 'go', 'rust', 'kotlin', 'swift',
  'react', 'vue', 'angular', 'node', 'express', 'django', 'flask', 'fastapi',
  'postgresql', 'mongodb', 'mysql', 'redis', 'elasticsearch',
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'git',
  'agile', 'scrum', 'ci/cd', 'jenkins', 'gitlab', 'github actions',
  'machine learning', 'ai', 'nlp', 'deep learning', 'tensorflow', 'pytorch',
  'rest api', 'graphql', 'microservices', 'serverless',
  'linux', 'unix', 'sql', 'nosql', 'html', 'css', 'sass',
];

const STRONG_ACTION_VERBS = [
  'built', 'developed', 'designed', 'engineered', 'implemented', 'created', 'optimized',
  'led', 'managed', 'improved', 'increased', 'decreased', 'reduced', 'accelerated',
  'launched', 'deployed', 'automated', 'integrated', 'architected', 'refactored',
  'mentored', 'collaborated', 'coordinated', 'contributed', 'shipped',
];

export function scoreATSCompatibility(profile: ReadinessProfile, evidence: Evidence[]): ATSScore {
  const combinedText = generateResumeText(profile, evidence).toLowerCase();

  // Count keywords
  const keywordCount = countKeywords(combinedText, TECHNICAL_KEYWORDS);
  const actionVerbCount = countKeywords(combinedText, STRONG_ACTION_VERBS);
  const measurementCount = countMeasurements(combinedText);

  // Scoring
  const keywordScore = Math.min(100, (keywordCount / 15) * 100); // Target ~15 keywords
  const actionVerbScore = Math.min(100, (actionVerbCount / 10) * 100); // Target ~10 action verbs
  const measurementScore = Math.min(100, (measurementCount / 5) * 100); // Target ~5 metrics
  const technicalScore = Math.min(100, (keywordCount / 20) * 100);
  const formatScore = assessFormatting(profile, evidence);

  const overallScore = Math.round(
    keywordScore * 0.25 +
    actionVerbScore * 0.25 +
    measurementScore * 0.25 +
    technicalScore * 0.15 +
    formatScore * 0.1
  );

  const foundKeywords = getFoundKeywords(combinedText, TECHNICAL_KEYWORDS);
  // Prioritise high-value missing keywords (ones most relevant to common SE/data roles)
  const HIGH_VALUE_KEYWORDS = [
    'git', 'rest api', 'docker', 'ci/cd', 'agile', 'postgresql', 'python',
    'react', 'node', 'aws', 'machine learning', 'typescript', 'kubernetes',
  ];
  const missingFromHighValue = getMissingKeywords(combinedText, HIGH_VALUE_KEYWORDS);
  const missingFromAll = getMissingKeywords(combinedText, TECHNICAL_KEYWORDS);
  // Show top 5 missing: high-value ones first, then fill with others
  const missingKeywords = [
    ...missingFromHighValue,
    ...missingFromAll.filter(k => !missingFromHighValue.includes(k)),
  ].slice(0, 5);

  return {
    overallScore,
    status: getATSStatus(overallScore),
    sections: {
      keywords: keywordCount,
      technicalTerms: Math.round(technicalScore),
      actionVerbs: actionVerbCount,
      measurements: measurementCount,
      formatting: formatScore,
    },
    improvement: generateImprovements(overallScore, keywordCount, actionVerbCount, measurementCount),
    recommendations: generateRecommendations(profile, evidence),
    missingKeywords,
    foundKeywords,
  };
}

function generateResumeText(profile: ReadinessProfile, evidence: Evidence[]): string {
  const parts: string[] = [];

  // Add profile info
  parts.push(profile.interpretation);
  parts.push(profile.dimensions.map(d => d.explanation).join(' '));

  // Add evidence
  evidence.forEach(e => {
    parts.push(e.title);
    parts.push(e.description);
    if (e.technologies) parts.push(e.technologies);
    if (e.outcome) parts.push(e.outcome);
  });

  return parts.join(' ');
}

function countKeywords(text: string, keywords: string[]): number {
  let count = 0;
  keywords.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) count++;
  });
  return count;
}

function getFoundKeywords(text: string, keywords: string[]): string[] {
  return keywords.filter(kw => text.includes(kw.toLowerCase()));
}

function getMissingKeywords(text: string, keywords: string[]): string[] {
  return keywords.filter(kw => !text.includes(kw.toLowerCase()));
}

function countMeasurements(text: string): number {
  // Look for numbers followed by % or quantifiers
  const patterns = [
    /\d+%/g, // 50%
    /\d+x/g, // 2x
    /\$\d+/g, // $1000
    /\d+\s*(users|customers|visits|requests|documents|features|months|weeks|days)/gi,
  ];

  let count = 0;
  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  });

  return Math.min(count, 10); // Cap at 10
}

function assessFormatting(_profile: ReadinessProfile, evidence: Evidence[]): number {
  let score = 70; // Start with decent score

  // Check for links in evidence (formatting positive signal)
  const linksCount = evidence.filter(e => e.link).length;
  score += Math.min(20, linksCount * 5);

  // Check for reasonable evidence count
  if (evidence.length >= 3 && evidence.length <= 7) score += 10;
  if (evidence.length > 7) score -= 10; // Too much evidence is hard to parse

  // Check for complete evidence (description present)
  const completeCount = evidence.filter(e => e.description && e.description.length > 100).length;
  if (completeCount >= evidence.length * 0.8) score += 10;

  return Math.min(100, Math.max(0, score));
}

function getATSStatus(score: number): 'Poor' | 'Fair' | 'Good' | 'Excellent' {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

function generateImprovements(
  score: number,
  keywords: number,
  verbs: number,
  measurements: number
): string[] {
  const improvements: string[] = [];

  if (keywords < 10) {
    improvements.push('Add more technical keywords (target: 10-15 mentions of frameworks, languages, tools)');
  }

  if (verbs < 8) {
    improvements.push('Use stronger action verbs: Built, Developed, Engineered, Optimized, Deployed');
  }

  if (measurements < 3) {
    improvements.push('Add quantifiable metrics: "increased performance by 40%", "served 1000+ users"');
  }

  if (score < 60) {
    improvements.push('Structure evidence with clear project titles, role descriptions, and outcomes');
  }

  return improvements;
}

function generateRecommendations(_profile: ReadinessProfile, evidence: Evidence[]): string[] {
  const recommendations: string[] = [];

  // Based on lowest dimension
  const lowestDim = [..._profile.dimensions].sort((a, b) => a.score - b.score)[0];

  if (lowestDim.dimension === 'Technical Skills') {
    recommendations.push('Highlight specific programming languages and frameworks you\'ve used');
  }

  if (lowestDim.dimension === 'Production Practices') {
    recommendations.push('Emphasize deployment experience: AWS, Docker, CI/CD, testing practices');
  }

  if (evidence.length < 3) {
    recommendations.push('Add at least 3-5 evidence items for stronger ATS parsing');
  }

  if (evidence.filter(e => e.link).length === 0) {
    recommendations.push('Add GitHub links and deployed project URLs to your evidence');
  }

  // Tech stack recommendations
  const hasSoftware = evidence.some(e =>
    e.technologies && (e.technologies.includes('Python') || e.technologies.includes('JavaScript'))
  );

  if (!hasSoftware) {
    recommendations.push('Consider adding backend development projects to demonstrate full-stack capabilities');
  }

  return recommendations;
}
