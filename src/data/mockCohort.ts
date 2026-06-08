import { CohortInsight } from '../types/evidence';

export const mockCohortInsight: CohortInsight = {
  totalStudents: 150,
  readinessDistribution: {
    internshipReady: 68, // 45%
    developing: 52, // 35%
    emerging: 30, // 20%
  },
  topGaps: [
    {
      dimension: 'Production Practices',
      studentCount: 96,
      percentage: 64,
    },
    {
      dimension: 'System Design & Architecture',
      studentCount: 72,
      percentage: 48,
    },
    {
      dimension: 'Work Readiness',
      studentCount: 58,
      percentage: 39,
    },
    {
      dimension: 'Technical Skills (Advanced)',
      studentCount: 45,
      percentage: 30,
    },
  ],
  suggestedInterventions: [
    {
      title: 'Testing & Deployment Workshop',
      description:
        'Hands-on workshop covering unit testing (Jest/Pytest), automated testing best practices, and deploying applications to cloud platforms.',
      targetStudents: 96,
      impact:
        'Could move 40–50 students from Developing to Internship-Ready by strengthening production practices.',
    },
    {
      title: 'System Design for Interns',
      description:
        'Short course on designing scalable systems, trade-offs between monolith and microservices, caching strategies, and database optimization.',
      targetStudents: 72,
      impact:
        'Help students articulate architectural thinking, a key differentiator in internship interviews.',
    },
    {
      title: 'Internship Experience Cohort',
      description:
        'Structured program connecting Year 2–3 students with local companies for paid internships, ensuring work experience is on their readiness profile.',
      targetStudents: 52,
      impact:
        'Directly fill the Work Readiness gap by providing real-world experience.',
    },
  ],
};
