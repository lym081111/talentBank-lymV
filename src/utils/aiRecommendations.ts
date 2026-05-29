import { ReadinessProfile } from '../types/evidence';

export interface JobRecommendation {
  title: string;
  description: string;
  requiredScore: number;
  matchPercentage: number;
  whyYouQualify: string;
}

export interface SkillRecommendation {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  currentGap: number; // points needed
  estimatedWeeksToLearn: number;
  resources: string[];
  impactOnScore: number; // estimated score improvement
}

export interface InterviewFocusArea {
  dimension: string;
  currentScore: number;
  targetScore: number;
  topTips: string[];
  practiceScenario: string;
}

export function getJobRecommendations(profile: ReadinessProfile): JobRecommendation[] {
  const overallScore = profile.overall;
  const technicalScore = profile.dimensions.find(d => d.dimension === 'Technical Skills')?.score || 0;
  const workReadinessScore = profile.dimensions.find(d => d.dimension === 'Work Readiness')?.score || 0;

  const recommendations: JobRecommendation[] = [];

  // Entry-level roles for 30-50 score
  if (overallScore >= 30 && overallScore < 50) {
    recommendations.push({
      title: 'Junior Support Engineer',
      description: 'Technical support and troubleshooting for software products',
      requiredScore: 35,
      matchPercentage: Math.min(100, (overallScore / 35) * 100),
      whyYouQualify: 'You have foundational technical knowledge and are developing work readiness skills',
    });
  }

  // Developing level roles for 50-75
  if (overallScore >= 50 && overallScore < 75) {
    if (technicalScore >= 60) {
      recommendations.push({
        title: 'Junior Full Stack Developer',
        description: 'Build and maintain web applications with mentorship',
        requiredScore: 60,
        matchPercentage: Math.min(100, (overallScore / 60) * 100),
        whyYouQualify: 'Your technical skills are developing well. Focus on portfolio projects and production practices.',
      });
    }

    if (workReadinessScore >= 50) {
      recommendations.push({
        title: 'QA/Testing Intern',
        description: 'Quality assurance and software testing role',
        requiredScore: 55,
        matchPercentage: Math.min(100, (overallScore / 55) * 100),
        whyYouQualify: 'You show work readiness and can develop testing expertise on the job',
      });
    }
  }

  // Advanced roles for 75+
  if (overallScore >= 75) {
    recommendations.push({
      title: 'Software Engineer Internship (Top Tier)',
      description: 'Competitive internship at FAANG or top-tier companies',
      requiredScore: 75,
      matchPercentage: Math.min(100, (overallScore / 75) * 100),
      whyYouQualify: 'You demonstrate strong readiness across all competencies',
    });
  }

  return recommendations;
}

export function getSkillRecommendations(profile: ReadinessProfile): SkillRecommendation[] {
  const recommendations: SkillRecommendation[] = [];
  const lowestDimensions = [...profile.dimensions]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  // Recommend skills based on lowest dimensions
  const skillMap: Record<string, { resources: string[]; weeks: number }> = {
    'Technical Skills': {
      resources: [
        'LeetCode Daily Challenges (algorithms)',
        'System Design Primer (architecture)',
        'FAANG interview prep course',
      ],
      weeks: 8,
    },
    'Production Practices': {
      resources: [
        'Complete CI/CD pipeline project',
        'Testing Best Practices course (Jest/Pytest)',
        'Docker & Kubernetes basics',
      ],
      weeks: 6,
    },
    'Work Readiness': {
      resources: [
        'Contribute to open-source project',
        'Pair programming sessions',
        'Code review practice',
      ],
      weeks: 4,
    },
    'Communication & Documentation': {
      resources: [
        'Toastmasters or public speaking club',
        'Technical writing workshops',
        'Presentation practice with feedback',
      ],
      weeks: 4,
    },
    'Portfolio Evidence': {
      resources: [
        'Complete 1-2 significant projects',
        'Deploy to production (Vercel, AWS)',
        'Document with architecture diagrams',
      ],
      weeks: 8,
    },
    'Role-Specific Fit (Software Engineer)': {
      resources: [
        'Research target companies and roles',
        'Industry-specific skill development',
        'Networking in your target field',
      ],
      weeks: 3,
    },
  };

  for (const dimension of lowestDimensions) {
    const gap = 75 - dimension.score;
    if (gap > 0) {
      const skillInfo = skillMap[dimension.dimension] || {
        resources: ['General skill development'],
        weeks: 4,
      };

      recommendations.push({
        skill: `Improve ${dimension.dimension}`,
        priority: gap > 25 ? 'high' : gap > 15 ? 'medium' : 'low',
        currentGap: Math.round(gap),
        estimatedWeeksToLearn: skillInfo.weeks,
        resources: skillInfo.resources,
        impactOnScore: Math.round((gap / 3) * 2), // Estimate 2/3 of the gap can be closed
      });
    }
  }

  return recommendations;
}

export function getInterviewFocusAreas(profile: ReadinessProfile): InterviewFocusArea[] {
  const focusAreas: InterviewFocusArea[] = [];

  // Get dimensions with lowest scores
  const weakDimensions = profile.dimensions
    .filter(d => d.score < 75)
    .sort((a, b) => a.score - b.score);

  const tipsMap: Record<string, string[]> = {
    'Technical Skills': [
      'Practice coding problems on LeetCode',
      'Review data structures and algorithms',
      'Be ready to explain your technical approach',
      'Ask clarifying questions before coding',
    ],
    'Portfolio Evidence': [
      'Have 2-3 projects ready to discuss in depth',
      'Be specific about your contributions',
      'Talk about challenges you overcame',
      'Show measurable impact (e.g., "Optimized API by 40%")',
    ],
    'Work Readiness': [
      'Share stories of teamwork and collaboration',
      'Discuss how you handle feedback',
      'Demonstrate understanding of deadlines',
      'Show your process for learning new tools',
    ],
    'Communication & Documentation': [
      'Practice explaining technical concepts simply',
      'Use clear, concise language',
      'Ask for feedback on your explanations',
      'Prepare stories that showcase communication',
    ],
    'Production Practices': [
      'Explain your testing strategy',
      'Discuss deployment and monitoring',
      'Talk about code quality practices',
      'Show awareness of production issues',
    ],
    'Role-Specific Fit (Software Engineer)': [
      'Research the company and role thoroughly',
      'Align your skills with their needs',
      'Ask thoughtful questions about the role',
      'Show genuine interest in their mission',
    ],
  };

  const scenariosMap: Record<string, string> = {
    'Technical Skills':
      'Scenario: Design a scalable system to handle 1M concurrent users. Walk through your thought process.',
    'Portfolio Evidence': 'Scenario: Describe your most complex project and what you learned from it.',
    'Work Readiness': 'Scenario: Your team disagrees with your approach. How do you handle it?',
    'Communication & Documentation': 'Scenario: Explain a complex technical concept to a non-technical stakeholder.',
    'Production Practices': 'Scenario: You discover a bug in production. Walk through your response.',
    'Role-Specific Fit (Software Engineer)': 'Scenario: Why do you want this role, and how does it fit your career goals?',
  };

  for (const dimension of weakDimensions.slice(0, 3)) {
    focusAreas.push({
      dimension: dimension.dimension,
      currentScore: dimension.score,
      targetScore: 75,
      topTips: tipsMap[dimension.dimension] || ['Practice and preparation are key'],
      practiceScenario: scenariosMap[dimension.dimension] || 'Practice explaining your strengths',
    });
  }

  return focusAreas;
}

export function generateAIInsight(profile: ReadinessProfile): string {
  const overallScore = profile.overall;
  const lowestDimension = [...profile.dimensions].sort((a, b) => a.score - b.score)[0];
  const highestDimension = [...profile.dimensions].sort((a, b) => b.score - a.score)[0];

  if (overallScore >= 75) {
    return `🎯 You're in excellent shape for competitive internships. Focus on reinforcing your ${highestDimension.dimension} strength while continuing to build ${lowestDimension.dimension}.`;
  } else if (overallScore >= 55) {
    return `📈 You have a solid foundation. Your next goal: close the ${lowestDimension.dimension} gap (currently ${lowestDimension.score}/100). This alone could push you to 75+.`;
  } else if (overallScore >= 30) {
    return `🚀 You're building momentum. Prioritize ${lowestDimension.dimension} and ${profile.dimensions.sort((a, b) => a.score - b.score)[1].dimension} to accelerate your readiness growth.`;
  } else {
    return `💪 You're at the beginning of your journey. Start with foundational projects in ${lowestDimension.dimension} - every step counts!`;
  }
}
