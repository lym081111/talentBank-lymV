/**
 * Market Intelligence for PathLens
 *
 * Analyses a student's extracted skills against the PathLens skill taxonomy
 * to produce market alignment insights specific to Asia's tech hiring market
 * (Singapore, Kuala Lumpur, Jakarta, Manila, Bangalore).
 *
 * Two exports:
 *  - generateMarketInsights() — overall alignment score + missing skills + recommendation
 *  - categorizeSkills()        — groups detected skills by technology category
 *
 * Data source: PathLens skill taxonomy (34 skills, tagged high/medium/low demand)
 * Last updated: May 2026 (based on internship posting analysis)
 */
import { ExtractedSkill } from '../types/evidence';
import { skillTaxonomy } from '../data/skillTaxonomy';

export interface MarketInsight {
  hasHighDemandSkills: boolean;
  highDemandSkillsCount: number;
  missingHighDemandSkills: string[];
  marketRecommendation: string;
  topSkillsToLearn: string[];
}

/**
 * Analyzes student's skills against Asia tech market demand.
 * Returns insights about market alignment and recommended skills to learn.
 *
 * Market context: Asia tech market (Singapore, Jakarta, Bangalore, Manila)
 * prioritizes full-stack capabilities, cloud, and production readiness.
 */
export function generateMarketInsights(extractedSkills: ExtractedSkill[]): MarketInsight {
  const skillNames = new Set(extractedSkills.map(s => s.skill));

  // Find high-demand skills in taxonomy
  const highDemandSkills = skillTaxonomy.filter(s => s.demand === 'high');
  const studentHighDemandSkills = highDemandSkills.filter(s => skillNames.has(s.name));
  const missingHighDemandSkills = highDemandSkills.filter(s => !skillNames.has(s.name));

  // Recommend top 3-5 missing high-demand skills by category diversity
  const topToLearn = missingHighDemandSkills
    .slice(0, 5)
    .map(s => s.name);

  // Generate market recommendation based on skill gaps
  const hasHighDemandSkills = studentHighDemandSkills.length > 0;
  const highDemandCoverage = Math.round((studentHighDemandSkills.length / highDemandSkills.length) * 100);

  let marketRecommendation = '';
  if (highDemandCoverage >= 75) {
    marketRecommendation = `Excellent market alignment! Your ${studentHighDemandSkills.length} high-demand skills (${highDemandCoverage}% of top-tier market skills) position you well for competitive internships in Asia's tech hubs.`;
  } else if (highDemandCoverage >= 50) {
    marketRecommendation = `Good market positioning. You have ${studentHighDemandSkills.length} of the ${highDemandSkills.length} most sought skills. Adding ${topToLearn.slice(0, 2).join(' and ')} would significantly boost your market competitiveness.`;
  } else if (highDemandCoverage >= 25) {
    marketRecommendation = `Building momentum. You have ${studentHighDemandSkills.length} high-demand skills. Prioritize learning ${topToLearn[0]} or ${topToLearn[1]} next — both are heavily requested by Singapore and Jakarta tech firms.`;
  } else {
    marketRecommendation = `Get started with market-aligned skills. High-demand skills in Asia tech include ${topToLearn.slice(0, 3).join(', ')}. Learn one of these to unlock more opportunities.`;
  }

  return {
    hasHighDemandSkills,
    highDemandSkillsCount: studentHighDemandSkills.length,
    missingHighDemandSkills: missingHighDemandSkills.map(s => s.name),
    marketRecommendation,
    topSkillsToLearn: topToLearn,
  };
}

/**
 * Groups skills by category to show portfolio diversity.
 * Helps identify which tech stack areas the student covers.
 */
export function categorizeSkills(extractedSkills: ExtractedSkill[]) {
  const skillNames = new Set(extractedSkills.map(s => s.skill));
  const categories: Record<string, string[]> = {};

  for (const skill of skillTaxonomy) {
    if (skillNames.has(skill.name)) {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill.name);
    }
  }

  return categories;
}
