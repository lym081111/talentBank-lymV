export type EvidenceType = 'fyp' | 'internship' | 'portfolio' | 'certificate' | 'hackathon';

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  technologies?: string;
  duration?: string;
  outcome?: string;
  link?: string;
  teamSize?: number;
  yourRole?: string;
  issuer?: string;
  verified?: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  university?: string;
  year: number;
  major: string;
  targetRole: string;
  evidence: Evidence[];
}

export interface ExtractedSkill {
  skill: string;
  confidence: 'high' | 'medium' | 'low';
  sourceEvidenceId: string;
  sourcePhrase: string;
}

export interface DimensionScore {
  dimension: string;
  score: number;
  status: 'Emerging' | 'Developing' | 'Internship-Ready' | 'Strong';
  explanation: string;
  topSkills: string[];
}

export interface ReadinessProfile {
  overall: number;
  level: string;
  interpretation: string;
  dimensions: DimensionScore[];
  allExtractedSkills: ExtractedSkill[];
}

export interface Gap {
  dimension: string;
  score: number;
  explanation: string;
  whyMatters: string;
  nextActions: NextAction[];
  /** Estimated overall score gain if this gap is closed, e.g. "+12–18 pts" */
  projectedImpact: string;
  /** Weight of this dimension in the overall score (0–1) */
  dimensionWeight: number;
  /** AI-driven cohort insights (optional) */
  cohortInsights?: {
    /** What % of cohort has this same gap */
    gapFrequencyPercentage: number;
    /** Why this gap matters relative to cohort patterns */
    priorityReasoning: string;
    /** Recommended effort-to-impact action index (0–2) */
    recommendedActionIndex: number;
  };
}

export interface NextAction {
  title: string;
  description: string;
  timeline: string;
  effort: string;
}

export interface CohortInsight {
  totalStudents: number;
  readinessDistribution: {
    internshipReady: number;
    developing: number;
    emerging: number;
  };
  topGaps: {
    dimension: string;
    studentCount: number;
    percentage: number;
  }[];
  suggestedInterventions: {
    title: string;
    description: string;
    targetStudents: number;
    impact: string;
  }[];
}
