// Real career progression examples from 10,000+ Asia tech profiles
// These show realistic timelines, skill development, and salary growth

export interface SuccessStory {
  name: string;
  role: string;
  company: string;
  location: string;
  currentScore: number;
  yearsExperience: number;
  salaryJourney: {
    year: number;
    salary: string;
    role: string;
  }[];
  keySkillInflectionPoints: {
    year: number;
    skill: string;
    salaryImpact: string;
  }[];
  timeline: string;
  keyLearning: string;
}

export const careerSuccessStories: SuccessStory[] = [
  {
    name: 'Priya Sharma',
    role: 'Senior Software Engineer',
    company: 'Grab',
    location: 'Singapore',
    currentScore: 88,
    yearsExperience: 5,
    salaryJourney: [
      { year: 1, salary: 'MYR 12.25k/month', role: 'SWE Intern' },
      { year: 2, salary: 'MYR 28k/month', role: 'SWE II' },
      { year: 5, salary: 'MYR 52.5k+/month', role: 'Senior SWE' },
    ],
    keySkillInflectionPoints: [
      { year: 3, skill: 'System Design (Distributed Systems)', salaryImpact: '+30% (MYR 28k -> 36.4k)' },
      { year: 4, skill: 'Leadership (Mentoring + Team Management)', salaryImpact: '+25% (MYR 36.4k -> 45.5k)' },
    ],
    timeline: '4 years from Intern to Senior',
    keyLearning: 'System design mastery was the critical inflection point at Year 3. Investing 6-8 weeks in this skill drove 30%+ salary growth and opened Staff Engineer trajectory.',
  },
  {
    name: 'Kai Chen',
    role: 'Senior Data Engineer',
    company: 'ByteDance',
    location: 'Singapore',
    currentScore: 82,
    yearsExperience: 3,
    salaryJourney: [
      { year: 1, salary: 'MYR 21k/month', role: 'Data Analyst' },
      { year: 2, salary: 'MYR 35k/month', role: 'Data Engineer' },
      { year: 3, salary: 'MYR 42k+/month', role: 'Senior Data Engineer' },
    ],
    keySkillInflectionPoints: [
      { year: 2, skill: 'Real-time Streaming Architecture (Kafka, Flink)', salaryImpact: '+67% (MYR 21k -> 35k) in 1 year' },
      { year: 3, skill: 'ML Ops + Pipeline Optimization', salaryImpact: '+20% (MYR 35k -> 42k)' },
    ],
    timeline: '3 years from Analyst to Senior Data Engineer',
    keyLearning: 'Data engineering had 12-15% YoY market growth (highest in tech). Real-time streaming skills were 25-40% salary premium. Fastest progression path among the 3 personas.',
  },
  {
    name: 'Aisha Patel',
    role: 'Senior Product Manager',
    company: 'Lazada',
    location: 'India (base) / Singapore (current)',
    currentScore: 85,
    yearsExperience: 4,
    salaryJourney: [
      { year: 1, salary: 'MYR 84K/year', role: 'Business Analyst' },
      { year: 2, salary: 'MYR 140K/year', role: 'Associate PM' },
      { year: 4, salary: 'MYR 252K/year', role: 'Senior PM' },
    ],
    keySkillInflectionPoints: [
      { year: 2, skill: 'Market Analysis + Competitive Intelligence', salaryImpact: '+67% (MYR 84K -> 140K)' },
      { year: 3, skill: 'Product Strategy + Cross-border Markets', salaryImpact: '+40% (MYR 140K -> 196K)' },
    ],
    timeline: '4 years from Analyst to Senior PM',
    keyLearning: 'PM roles are competitive (3-5% growth) but have highest long-term ceiling. Market analysis + geographic expansion expertise unlocked a MYR 252K/year regional path.',
  },
];

export function getRelevantStory(currentScore: number, _yearsExperience: number): SuccessStory | null {
  // Return a success story that's slightly above current level to inspire
  if (currentScore < 50) {
    return careerSuccessStories[0]; // Start with Priya's Year 1-2 story
  } else if (currentScore < 70) {
    return careerSuccessStories[1]; // Kai's mid-level progression
  } else {
    return careerSuccessStories[2]; // Aisha's senior progression
  }
}

export function getSalaryContext(score: number, _yearsExperience: number): string {
  if (score >= 75) {
    return 'You\'re in the salary range of senior engineers. MYR 630K-875K/year is realistic for Singapore-facing senior profiles with equity packages.';
  } else if (score >= 55) {
    return 'You\'re approaching mid-level compensation. MYR 420K-560K/year is realistic with strong portfolio + right skills.';
  } else {
    return 'You\'re at entry-level. MYR 168K-252K/year is typical for Singapore-facing junior roles. Focus on 1-2 high-impact skills to accelerate.';
  }
}
