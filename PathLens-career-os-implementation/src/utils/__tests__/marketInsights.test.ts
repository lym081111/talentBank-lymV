import { describe, it, expect } from 'vitest';
import { generateMarketInsights, categorizeSkills } from '../marketInsights';
import { ExtractedSkill } from '../../types/evidence';

describe('Market Insights', () => {
  it('handles empty skill list', () => {
    const insights = generateMarketInsights([]);
    expect(insights.hasHighDemandSkills).toBe(false);
    expect(insights.highDemandSkillsCount).toBe(0);
    expect(insights.missingHighDemandSkills.length).toBeGreaterThan(0);
  });

  it('detects high-demand skills correctly', () => {
    const skills: ExtractedSkill[] = [
      { skill: 'Python', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Python' },
      { skill: 'React', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'React' },
      { skill: 'Docker / Containerization', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Docker' },
    ];
    const insights = generateMarketInsights(skills);
    expect(insights.hasHighDemandSkills).toBe(true);
    expect(insights.highDemandSkillsCount).toBeGreaterThan(0);
  });

  it('recommends missing high-demand skills', () => {
    const skills: ExtractedSkill[] = [
      { skill: 'HTML / CSS', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'HTML' },
    ];
    const insights = generateMarketInsights(skills);
    expect(insights.missingHighDemandSkills.length).toBeGreaterThan(0);
    expect(insights.topSkillsToLearn.length).toBeGreaterThan(0);
  });

  it('provides market recommendation based on coverage', () => {
    const lowCoverageSkills: ExtractedSkill[] = [
      { skill: 'C / C++', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'C++' },
    ];
    const insights = generateMarketInsights(lowCoverageSkills);
    expect(insights.marketRecommendation).toBeTruthy();
    expect(insights.marketRecommendation.length).toBeGreaterThan(20);
  });

  it('categorizes skills by type', () => {
    const skills: ExtractedSkill[] = [
      { skill: 'Python', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Python' },
      { skill: 'React', confidence: 'high', sourceEvidenceId: '2', sourcePhrase: 'React' },
      { skill: 'Docker / Containerization', confidence: 'high', sourceEvidenceId: '3', sourcePhrase: 'Docker' },
    ];
    const categories = categorizeSkills(skills);
    expect(Object.keys(categories).length).toBeGreaterThan(0);
    expect(categories['programming'] || categories['frontend'] || categories['devops']).toBeDefined();
  });

  it('handles high market coverage correctly', () => {
    // Create a skill set with many high-demand skills — enough for 75%+ coverage
    const skills: ExtractedSkill[] = [
      { skill: 'Python', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Python' },
      { skill: 'JavaScript / TypeScript', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'JavaScript' },
      { skill: 'React', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'React' },
      { skill: 'Next.js', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Next.js' },
      { skill: 'SQL', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'SQL' },
      { skill: 'RESTful APIs', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'REST API' },
      { skill: 'Git / Version Control', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Git' },
      { skill: 'Docker / Containerization', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Docker' },
      { skill: 'CI/CD Pipelines', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'CI/CD' },
      { skill: 'Cloud Platforms (AWS / GCP / Azure)', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'AWS' },
      { skill: 'System Design & Architecture', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'System Design' },
      { skill: 'Testing & Test Automation', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Testing' },
      { skill: 'Data Analysis & Visualization', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Data Analysis' },
      { skill: 'Machine Learning Basics', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'Machine Learning' },
      { skill: 'FastAPI', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'FastAPI' },
    ];
    const insights = generateMarketInsights(skills);
    expect(insights.highDemandSkillsCount).toBeGreaterThanOrEqual(14);
    expect(insights.marketRecommendation).toContain('Excellent');
  });

  it('provides actionable recommendations', () => {
    const skills: ExtractedSkill[] = [
      { skill: 'HTML / CSS', confidence: 'high', sourceEvidenceId: '1', sourcePhrase: 'HTML' },
    ];
    const insights = generateMarketInsights(skills);
    expect(insights.topSkillsToLearn.length).toBeGreaterThan(0);
    expect(insights.topSkillsToLearn[0]).toBeTruthy();
  });
});
