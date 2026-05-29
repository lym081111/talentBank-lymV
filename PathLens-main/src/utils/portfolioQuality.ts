import { Evidence } from '../types/evidence';

export interface PortfolioQualityScore {
  itemId: string;
  title: string;
  overallScore: number; // 0-100
  category: 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
  metrics: {
    documentation: number; // 0-100: README, comments, descriptions
    complexity: number; // 0-100: technical depth
    impact: number; // 0-100: outcome clarity, metrics
    deployment: number; // 0-100: is it live/deployed?
    technologies: number; // 0-100: modern tech stack
  };
  strengths: string[];
  improvements: string[];
  productionReadiness: {
    hasLiveDemo: boolean;
    hasGitHubLink: boolean;
    hasDocumentation: boolean;
    hasMeasurableOutcome: boolean;
    readyForPortfolio: boolean;
  };
}

export function analyzePortfolioQuality(evidence: Evidence[]): PortfolioQualityScore[] {
  return evidence.map(item => {
    const metrics = {
      documentation: calculateDocumentationScore(item),
      complexity: calculateComplexityScore(item),
      impact: calculateImpactScore(item),
      deployment: calculateDeploymentScore(item),
      technologies: calculateTechnologyScore(item),
    };

    const overallScore = Math.round(
      (metrics.documentation * 0.25 +
        metrics.complexity * 0.25 +
        metrics.impact * 0.25 +
        metrics.deployment * 0.15 +
        metrics.technologies * 0.1)
    );

    const category = overallScore >= 75 ? 'Excellent' : overallScore >= 55 ? 'Good' : overallScore >= 35 ? 'Fair' : 'Needs Work';

    const productionReadiness = {
      hasLiveDemo: !!(item.link && (item.link.includes('deployed') || item.link.includes('.com') || item.link.includes('.app'))),
      hasGitHubLink: !!(item.link && item.link.includes('github.com')),
      hasDocumentation: !!(item.description && item.description.length > 100),
      hasMeasurableOutcome: !!(item.outcome && /(\d+|increased|improved|reduced|saved|launched)/i.test(item.outcome)),
      readyForPortfolio: !!(item.link && item.outcome && item.description && item.description.length > 100),
    };

    return {
      itemId: item.id,
      title: item.title,
      overallScore,
      category,
      metrics,
      strengths: getStrengths(item, metrics, productionReadiness),
      improvements: getImprovements(item, metrics, productionReadiness),
      productionReadiness,
    };
  });
}

function calculateDocumentationScore(item: Evidence): number {
  let score = 0;

  // Check description length
  if (item.description && item.description.length > 150) score += 40;
  else if (item.description && item.description.length > 80) score += 25;
  else if (item.description && item.description.length > 50) score += 10;

  // Check for technology mentions
  if (item.technologies && item.technologies.length > 10) score += 30;
  else if (item.technologies && item.technologies.length > 0) score += 15;

  // Check for role clarity
  if (item.yourRole && item.yourRole.length > 5) score += 20;
  else if (item.yourRole) score += 10;

  // Check for outcome/impact
  if (item.outcome && item.outcome.length > 10) score += 10;

  return Math.min(score, 100);
}

function calculateComplexityScore(item: Evidence): number {
  let score = 0;

  // Evidence type complexity
  if (['fyp', 'internship'].includes(item.type)) score += 35;
  else if (['hackathon', 'portfolio'].includes(item.type)) score += 25;
  else score += 10;

  // Technology sophistication
  const techCount = item.technologies ? item.technologies.split(',').length : 0;
  if (techCount >= 4) score += 35;
  else if (techCount >= 2) score += 20;

  // Team size (collaboration is complex)
  if (item.teamSize && item.teamSize > 1) score += 20;
  else score += 5;

  // Duration
  if (item.duration) {
    if (item.duration.toLowerCase().includes('months') || item.duration.toLowerCase().includes('year')) score += 10;
    else score += 5;
  }

  return Math.min(score, 100);
}

function calculateImpactScore(item: Evidence): number {
  let score = 0;

  // Outcome specificity
  if (item.outcome && item.outcome.length > 30) score += 40;
  else if (item.outcome && item.outcome.length > 10) score += 25;
  else if (item.outcome) score += 10;

  // Measurable metrics (numbers, percentages, etc.)
  if (item.outcome && /\d+%|\d+x|(\d+\s*(users|features|improvement))/i.test(item.outcome)) score += 30;
  else if (item.description && /\d+%|\d+x|(\d+\s*(users|features))/i.test(item.description)) score += 15;

  // Real-world deployment
  if (item.link && (item.link.includes('github.com') || item.link.includes('deployed'))) score += 20;
  else if (item.link) score += 10;

  // Achievement/recognition
  if (item.outcome && /finalist|winner|award|recognition|shipped|launched|production/i.test(item.outcome)) score += 10;

  return Math.min(score, 100);
}

function calculateDeploymentScore(item: Evidence): number {
  if (!item.link) return 0;

  if (item.link.includes('github.com')) {
    // GitHub repo exists
    return item.link.toLowerCase().includes('demo') ||
           item.link.toLowerCase().includes('deployed') ||
           item.outcome?.toLowerCase().includes('production') ? 80 : 50;
  }

  if (item.link.includes('.com') || item.link.includes('.app') || item.link.includes('.io') || item.link.includes('.dev')) {
    // Deployed web app
    return 90;
  }

  // Generic link
  return 30;
}

function calculateTechnologyScore(item: Evidence): number {
  if (!item.technologies) return 0;

  const modernTechs = ['react', 'next', 'vue', 'angular', 'typescript', 'node', 'python', 'golang', 'rust', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'graphql', 'websocket'];
  const techs = item.technologies.toLowerCase().split(',').map(t => t.trim());
  const modernTechCount = techs.filter(t => modernTechs.some(m => t.includes(m))).length;

  if (modernTechCount >= 3) return 90;
  if (modernTechCount === 2) return 70;
  if (modernTechCount === 1) return 50;
  return 30; // Old/basic tech
}

function getStrengths(_item: Evidence, metrics: Record<string, number>, readiness: any): string[] {
  const strengths: string[] = [];

  if (metrics.documentation > 70) strengths.push('📝 Well-documented project');
  if (metrics.complexity > 70) strengths.push('🏗️ Technically sophisticated');
  if (metrics.impact > 70) strengths.push('⭐ Clear measurable impact');
  if (readiness.hasLiveDemo) strengths.push('🚀 Deployed to production');
  if (readiness.hasGitHubLink) strengths.push('🐙 GitHub repository linked');
  if (metrics.technologies > 70) strengths.push('💻 Modern technology stack');

  return strengths.length > 0 ? strengths : ['✓ Demonstrates relevant experience'];
}

function getImprovements(item: Evidence, metrics: Record<string, number>, readiness: any): string[] {
  const improvements: string[] = [];

  if (metrics.documentation < 50) improvements.push('Add more detailed description of what you built and learned');
  if (metrics.complexity < 50) improvements.push('Consider projects with greater technical depth');
  if (!readiness.hasLiveDemo && !readiness.hasGitHubLink) improvements.push('Add a link to GitHub repo or deployed demo');
  if (!readiness.hasMeasurableOutcome) improvements.push('Include specific outcomes or metrics (e.g., "Improved performance by 40%")');
  if (metrics.technologies < 40) improvements.push('Highlight modern technologies used (React, Python, Docker, etc.)');
  if (item.teamSize === undefined) improvements.push('Specify your team size to show collaboration experience');

  return improvements;
}
