import { Gap, DimensionScore, CohortInsight } from '../types/evidence';
import { DIMENSION_WEIGHTS } from './readinessScoring';

/**
 * Gap analysis and next-action generation for PathLens readiness dimensions.
 *
 * For each under-performing dimension (<75), this module generates:
 *  - Explanation of what's missing from the student's evidence
 *  - Why that gap matters for internship competitiveness
 *  - 3 concrete, actionable steps with realistic timelines and effort estimates
 *  - Projected overall score impact if the gap is closed (using dimension weights)
 *  - AI-driven cohort insights: gap frequency, priority reasoning, recommended action
 *
 * Dimension weights are imported from readinessScoring.ts — single source of truth.
 * Cohort insights are computed from live cohort data to show data-driven priorities.
 */

function computeProjectedImpact(score: number, dimension: string): { label: string; weight: number } {
  const weight = DIMENSION_WEIGHTS[dimension] ?? 0.15;
  const gapToThreshold = Math.max(0, 75 - score);
  const low = Math.max(1, Math.round(gapToThreshold * weight * 0.5));
  const high = Math.max(2, Math.round(gapToThreshold * weight));
  if (low === high) return { label: `+${high} pts`, weight };
  return { label: `+${low}–${high} pts`, weight };
}

/**
 * Calculate cohort-aware gap priority.
 * Considers: cohort frequency (how many students have this gap),
 * dimension weight (impact on overall score), and effort levels of suggested actions.
 *
 * Returns the percentage of cohort with this gap, reasoning for priority,
 * and the recommended action index (which action has best effort-to-impact ratio).
 */
function calculateCohortInsight(
  dimension: string,
  actions: Array<{ title: string; timeline: string; effort: string }>,
  cohort: CohortInsight
): { gapFrequencyPercentage: number; priorityReasoning: string; recommendedActionIndex: number } {
  // Find this dimension in cohort's topGaps
  const cohortGap = cohort.topGaps.find((g) => g.dimension === dimension);
  const gapFrequencyPercentage = cohortGap?.percentage ?? 0;

  // Effort scoring: 5–15 hrs = 1, 15–25 hrs = 2, 25+ hrs = 3
  const effortScore = (effort: string): number => {
    const effortText = effort.toLowerCase();
    if (effortText.includes('2–3') || effortText.includes('4–6') || effortText.includes('5–8')) return 1;
    if (effortText.includes('10–15') || effortText.includes('15–20') || effortText.includes('8–12')) return 2;
    return 3; // 20+ hours
  };

  // Find action with best effort-to-impact ratio
  let recommendedActionIndex = 0;
  let bestRatio = Infinity;

  actions.forEach((action, index) => {
    const effort = effortScore(action.effort);
    const ratio = effort / (1 + index); // Earlier actions slightly favored
    if (ratio < bestRatio) {
      bestRatio = ratio;
      recommendedActionIndex = index;
    }
  });

  // Generate priority reasoning based on cohort data
  let priorityReasoning = '';
  if (gapFrequencyPercentage >= 60) {
    priorityReasoning = `${gapFrequencyPercentage}% of cohort struggles with this. High-priority intervention.`;
  } else if (gapFrequencyPercentage >= 40) {
    priorityReasoning = `${gapFrequencyPercentage}% of cohort has this gap. Common challenge.`;
  } else if (gapFrequencyPercentage >= 20) {
    priorityReasoning = `${gapFrequencyPercentage}% of cohort affected. Medium priority.`;
  } else {
    // For gaps not in topGaps, estimate based on similar gaps
    priorityReasoning = 'Moderate priority based on role requirements.';
  }

  // Add weight context
  const weight = DIMENSION_WEIGHTS[dimension] ?? 0.15;
  if (weight >= 0.20) {
    priorityReasoning += ` This dimension is heavily weighted (${Math.round(weight * 100)}%) in readiness scoring.`;
  }

  return { gapFrequencyPercentage, priorityReasoning, recommendedActionIndex };
}

export function generateGaps(dimensions: DimensionScore[], cohort?: CohortInsight): Gap[] {
  const gaps: Gap[] = [];

  const sortedDimensions = [...dimensions].sort((a, b) => a.score - b.score);

  for (let i = 0; i < Math.min(3, sortedDimensions.length); i++) {
    const dim = sortedDimensions[i];
    if (dim.score < 75) {
      gaps.push(generateGapForDimension(dim, cohort));
    }
  }

  return gaps;
}

function generateGapForDimension(dimension: DimensionScore, cohort?: CohortInsight): Gap {
  const gapConfig: Record<
    string,
    {
      explanation: string;
      whyMatters: string;
      actions: Array<{ title: string; description: string; timeline: string; effort: string }>;
    }
  > = {
    'Production Practices': {
      explanation:
        'You have shown backend and frontend development skills, but your evidence lacks automated testing, CI/CD pipelines, and deployment workflows. These are essential for production-ready code.',
      whyMatters:
        'Production engineers own the full lifecycle from code to deployment. Employers want to see that you understand testing, deployment, and monitoring—not just writing code.',
      actions: [
        {
          title: 'Add Automated Tests to a Portfolio Project',
          description:
            'Take one of your existing projects. Add unit tests using Jest (JavaScript) or Pytest (Python). Aim for 50%+ code coverage.',
          timeline: '2–3 weeks',
          effort: '10–15 hours',
        },
        {
          title: 'Set Up CI/CD for Deployment',
          description:
            'Choose one project and set up a simple CI/CD pipeline using GitHub Actions or similar. Automate running tests and deploying to a cloud platform (Vercel, Heroku, AWS) on every push to main.',
          timeline: '3–4 weeks',
          effort: '8–12 hours',
        },
        {
          title: 'Document Architecture & Trade-offs',
          description:
            'Write a detailed README or case study for one project explaining: system architecture, technology choices, trade-offs made, and how you would scale it. Show architectural thinking.',
          timeline: '1–2 weeks',
          effort: '5–8 hours',
        },
      ],
    },
    'Work Readiness': {
      explanation:
        'While you have one internship listed, your portfolio projects lack evidence of real-world work practices like code reviews, team collaboration, and working with existing codebases.',
      whyMatters:
        'Internships are structured, collaborative environments. Employers want to see that you can work in a team, take feedback, and integrate with existing systems.',
      actions: [
        {
          title: 'Contribute to an Open-Source Project',
          description:
            'Find a beginner-friendly open-source project (look for "good first issue" labels). Make at least one meaningful contribution, go through code review, and incorporate feedback. Document your experience.',
          timeline: '4–6 weeks',
          effort: '10–15 hours',
        },
        {
          title: 'Build a Team Project or Pair Program',
          description:
            'Collaborate with a classmate on a project. Use Git for version control, do code reviews on pull requests, and document your collaboration process. This shows teamwork.',
          timeline: '4–8 weeks',
          effort: '15–20 hours',
        },
        {
          title: 'Add Details to Your Internship Experience',
          description:
            'Expand your internship description with specifics: What code reviews taught you, how you debugged issues, examples of collaboration, and any impact metrics (e.g., "Optimized API response time by 30%").',
          timeline: '1 week',
          effort: '2–3 hours',
        },
      ],
    },
    'Technical Skills': {
      explanation:
        'You have skills in Python, JavaScript, and React, but your evidence could show deeper expertise in more advanced areas like system design, databases, or additional languages.',
      whyMatters:
        'Strong technical depth across multiple domains makes you more competitive and opens more internship/job opportunities.',
      actions: [
        {
          title: 'Deep Dive into One Advanced Topic',
          description:
            'Choose one area (e.g., database optimization, microservices, advanced React patterns). Build a project demonstrating mastery and write a blog post or case study about what you learned.',
          timeline: '6–8 weeks',
          effort: '20–30 hours',
        },
        {
          title: 'Learn a New Language or Framework',
          description:
            'Pick a language complementary to your skills (e.g., Go, Rust, or a framework like Django). Build a small project to show proficiency.',
          timeline: '4–6 weeks',
          effort: '15–25 hours',
        },
        {
          title: 'Solve Algorithm Problems',
          description:
            'Practice on LeetCode or HackerRank (50+ problems in your target language). This strengthens problem-solving skills critical for internship interviews.',
          timeline: '4–6 weeks',
          effort: '10–15 hours',
        },
      ],
    },
    'Portfolio Evidence': {
      explanation:
        'You have 5 projects, but some lack depth. Consider building 1–2 more complex, well-documented projects to strengthen your portfolio.',
      whyMatters:
        'A strong portfolio is your primary asset when applying for internships. Employers want to see quality over quantity.',
      actions: [
        {
          title: 'Build a Complex Full-Stack Project',
          description:
            'Design and build an ambitious project (e.g., a multiplayer game, collaborative editor, or analytics dashboard). Document architecture, design decisions, and deployment.',
          timeline: '8–12 weeks',
          effort: '40–60 hours',
        },
        {
          title: 'Refactor and Polish Existing Projects',
          description:
            'Take your 3 best projects. Improve code quality, add error handling, improve UI/UX, and write comprehensive documentation.',
          timeline: '4–6 weeks',
          effort: '15–20 hours',
        },
        {
          title: 'Contribute to Open Source',
          description:
            'Make meaningful contributions to well-known open-source projects. This adds credibility and shows you can work with real codebases.',
          timeline: '6–8 weeks',
          effort: '15–25 hours',
        },
      ],
    },
    'Communication & Documentation': {
      explanation:
        'Your project descriptions are decent, but could be more detailed and better structured. Consider adding more visual documentation and written explanations.',
      whyMatters:
        'How you communicate about your work matters as much as the work itself. Clear documentation shows maturity and helps others (and future employers) understand your thinking.',
      actions: [
        {
          title: 'Write Detailed READMEs for All Projects',
          description:
            'Create comprehensive README files for each project with: overview, tech stack, installation instructions, usage examples, screenshots, and lessons learned.',
          timeline: '2–3 weeks',
          effort: '6–10 hours',
        },
        {
          title: 'Create a Technical Blog',
          description:
            'Start a simple blog (Medium, Dev.to, or personal site). Write 3–5 technical posts about your projects, lessons learned, or problems solved.',
          timeline: '4–6 weeks',
          effort: '8–15 hours',
        },
        {
          title: 'Record Demo Videos',
          description:
            'Create short demo videos (2–3 min each) of your key projects showing features and explaining the technology choices.',
          timeline: '2–3 weeks',
          effort: '4–6 hours',
        },
      ],
    },
    'Role-Specific Fit (Software Engineer)': {
      explanation:
        'You have good foundational SWE skills but lack evidence in system design thinking and advanced backend concepts.',
      whyMatters:
        'Software engineering roles require thinking beyond individual features to systems, scalability, and trade-offs. This is what separates junior from mid-level engineers.',
      actions: [
        {
          title: 'Study System Design',
          description:
            'Learn system design principles (caching, databases, APIs, scalability). Build a project demonstrating these concepts and write a design document.',
          timeline: '6–8 weeks',
          effort: '15–25 hours',
        },
        {
          title: 'Refactor for Scalability',
          description:
            'Take one of your backend projects and refactor it to handle 1000x more users. Document scaling decisions (caching, database optimization, microservices).',
          timeline: '4–6 weeks',
          effort: '15–20 hours',
        },
        {
          title: 'Learn SWE Best Practices',
          description:
            'Deep dive into SOLID principles, design patterns, and clean code. Apply these to one of your projects and document the improvements.',
          timeline: '4–6 weeks',
          effort: '10–15 hours',
        },
      ],
    },
  };

  const config = gapConfig[dimension.dimension] || {
    explanation: `Your ${dimension.dimension} score is lower than other areas. Consider strengthening this dimension.`,
    whyMatters:
      'This dimension is important for internship readiness. Employers will assess you on this skill.',
    actions: [
      {
        title: 'Build a Project Demonstrating This Skill',
        description: `Create a project that clearly demonstrates ${dimension.dimension.toLowerCase()}.`,
        timeline: '4–6 weeks',
        effort: '15–20 hours',
      },
    ],
  };

  const { label: projectedImpact, weight: dimensionWeight } = computeProjectedImpact(
    dimension.score,
    dimension.dimension
  );

  // Calculate cohort insights if cohort data is provided
  const cohortInsights = cohort
    ? calculateCohortInsight(dimension.dimension, config.actions, cohort)
    : undefined;

  return {
    dimension: dimension.dimension,
    score: dimension.score,
    explanation: config.explanation,
    whyMatters: config.whyMatters,
    nextActions: config.actions.map((action) => ({
      title: action.title,
      description: action.description,
      timeline: action.timeline,
      effort: action.effort,
    })),
    projectedImpact,
    dimensionWeight,
    cohortInsights: cohortInsights
      ? {
          gapFrequencyPercentage: cohortInsights.gapFrequencyPercentage,
          priorityReasoning: cohortInsights.priorityReasoning,
          recommendedActionIndex: cohortInsights.recommendedActionIndex,
        }
      : undefined,
  };
}
