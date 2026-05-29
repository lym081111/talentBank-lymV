import { describe, it, expect } from 'vitest';
import { extractSkillsFromEvidence } from '../skillExtraction';
import { calculateReadinessProfile } from '../readinessScoring';
import { analyzePortfolioQuality } from '../portfolioQuality';
import { Evidence } from '../../types/evidence';

describe('Edge Cases — Skill Extraction', () => {
  it('handles empty evidence array', () => {
    const skills = extractSkillsFromEvidence([]);
    expect(skills).toEqual([]);
  });

  it('handles evidence with no technologies field', () => {
    const evidence: Evidence[] = [{
      id: '1',
      type: 'portfolio',
      title: 'Python Project',
      description: 'Built a web scraper using Python and requests library',
      duration: '2 months',
      outcome: 'Deployed',
      link: 'github.com/user/project',
    }];
    const skills = extractSkillsFromEvidence(evidence);
    expect(skills.length).toBeGreaterThan(0);
    expect(skills.some(s => s.skill.toLowerCase().includes('python'))).toBe(true);
  });

  it('handles evidence with empty descriptions', () => {
    const evidence: Evidence[] = [{
      id: '1',
      type: 'portfolio',
      title: 'My Project',
      description: '',
      technologies: '',
    }];
    const skills = extractSkillsFromEvidence(evidence);
    expect(Array.isArray(skills)).toBe(true);
  });

  it('extracts skills from minimal text', () => {
    const evidence: Evidence[] = [{
      id: '1',
      type: 'portfolio',
      title: 'React App',
      description: 'Made with React',
      technologies: 'React, Node.js',
    }];
    const skills = extractSkillsFromEvidence(evidence);
    expect(skills.length).toBeGreaterThan(0);
  });

  it('deduplicates duplicate skills correctly', () => {
    const evidence: Evidence[] = [
      {
        id: '1',
        type: 'portfolio',
        title: 'Project 1',
        description: 'Built with Python and Django',
        technologies: 'Python',
      },
      {
        id: '2',
        type: 'internship',
        title: 'Project 2',
        description: 'Wrote Python scripts for automation',
        technologies: 'Python, Bash',
      },
    ];
    const skills = extractSkillsFromEvidence(evidence);
    const pythonSkills = skills.filter(s => s.skill.toLowerCase().includes('python'));
    expect(pythonSkills.length).toBe(1);
  });

  it('handles case-insensitive matching', () => {
    const evidence: Evidence[] = [{
      id: '1',
      type: 'portfolio',
      title: 'PROJECT IN PYTHON',
      description: 'USED REACT AND TYPESCRIPT',
      technologies: 'JAVASCRIPT, PYTHON',
    }];
    const skills = extractSkillsFromEvidence(evidence);
    expect(skills.length).toBeGreaterThan(0);
  });

  it('handles special characters in text', () => {
    const evidence: Evidence[] = [{
      id: '1',
      type: 'portfolio',
      title: 'C++ & Node.js Project!!!',
      description: 'Used C++, Node.js, and @angular/core',
      technologies: 'C++, JavaScript/TypeScript',
    }];
    const skills = extractSkillsFromEvidence(evidence);
    expect(skills.length).toBeGreaterThan(0);
  });
});

describe('Edge Cases — Readiness Scoring', () => {
  it('handles empty evidence', () => {
    const profile = calculateReadinessProfile([]);
    // Even with no evidence, scoring functions produce some baseline score
    expect(profile.overall).toBeGreaterThanOrEqual(0);
    expect(profile.overall).toBeLessThanOrEqual(100);
    expect(profile.dimensions.length).toBe(6);
  });

  it('handles profile with rich evidence (higher scores)', () => {
    const evidence: Evidence[] = [
      {
        id: '1',
        type: 'portfolio',
        title: 'Complex Full Stack Project',
        description: 'Built a scalable microservices system with React, Node.js, PostgreSQL, Docker, Kubernetes. Deployed to AWS. Implemented comprehensive testing and CI/CD. Led team of 4 people. Project handles 1M+ requests daily.',
        technologies: 'React, Node.js, PostgreSQL, Docker, Kubernetes, AWS, TypeScript, REST API, CI/CD',
        outcome: 'Production system',
        duration: '6 months',
        yourRole: 'Tech Lead',
        teamSize: 4,
        link: 'github.com/user/project',
      },
      {
        id: '2',
        type: 'internship',
        title: 'Software Engineer Internship',
        description: 'Developed backend features in Python. Participated in code reviews. Learned about production practices. Deployed changes to live systems.',
        technologies: 'Python, FastAPI, PostgreSQL, Docker',
        outcome: 'Converted to full-time',
        duration: '3 months',
      },
    ];
    const profile = calculateReadinessProfile(evidence);
    expect(profile.overall).toBeGreaterThan(50);
    expect(profile.dimensions.length).toBe(6);
  });

  it('handles profile with mixed evidence', () => {
    const evidence: Evidence[] = [
      {
        id: '1',
        type: 'portfolio',
        title: 'Simple Project',
        description: 'Made a TODO list app with HTML and CSS',
        technologies: 'HTML, CSS',
      },
      {
        id: '2',
        type: 'hackathon',
        title: 'Hackathon Project',
        description: 'Built a web app in 24 hours using React',
        technologies: 'React, JavaScript',
      },
    ];
    const profile = calculateReadinessProfile(evidence);
    expect(profile.overall).toBeGreaterThan(0);
    expect(profile.overall).toBeLessThan(100);
  });
});

describe('Edge Cases — Portfolio Quality', () => {
  it('handles empty evidence portfolio', () => {
    const scores = analyzePortfolioQuality([]);
    expect(scores).toEqual([]);
  });

  it('handles single project portfolio', () => {
    const evidence: Evidence[] = [{
      id: '1',
      type: 'portfolio',
      title: 'My Project',
      description: 'A project I built from scratch with careful attention to quality',
      technologies: 'React, Node.js, PostgreSQL',
      outcome: 'Deployed to production',
      link: 'github.com/user/project',
    }];
    const scores = analyzePortfolioQuality(evidence);
    expect(scores.length).toBe(1);
    expect(scores[0].overallScore).toBeGreaterThanOrEqual(0);
    expect(scores[0].overallScore).toBeLessThanOrEqual(100);
  });

  it('handles projects with missing optional fields', () => {
    const evidence: Evidence[] = [
      {
        id: '1',
        type: 'portfolio',
        title: 'Project',
        description: 'Description',
      },
      {
        id: '2',
        type: 'internship',
        title: 'Internship',
        description: 'Internship work',
        duration: '3 months',
      },
    ];
    const scores = analyzePortfolioQuality(evidence);
    expect(scores.length).toBe(2);
    scores.forEach(s => {
      expect(s.overallScore).toBeGreaterThanOrEqual(0);
      expect(s.overallScore).toBeLessThanOrEqual(100);
    });
  });

  it('handles projects with very long descriptions', () => {
    const longDesc = 'Built and deployed '.repeat(100) + 'a complex system';
    const evidence: Evidence[] = [{
      id: '1',
      type: 'portfolio',
      title: 'Complex Project',
      description: longDesc,
      technologies: 'React, Node.js, PostgreSQL',
      outcome: 'Production',
    }];
    const scores = analyzePortfolioQuality(evidence);
    expect(scores.length).toBe(1);
    expect(typeof scores[0].overallScore).toBe('number');
  });

  it('handles projects with extreme complexity signals', () => {
    const evidence: Evidence[] = [
      {
        id: '1',
        type: 'portfolio',
        title: 'Simple Project',
        description: 'Made a TODO app',
        technologies: 'HTML, CSS',
      },
      {
        id: '2',
        type: 'portfolio',
        title: 'Complex Project',
        description: 'Microservices architecture with 10 services, deployed on K8s, handled 1M requests/day, used event-driven patterns, implemented sagas, used CQRS',
        technologies: 'Docker, Kubernetes, Node.js, PostgreSQL, Redis, RabbitMQ, gRPC',
        outcome: 'Production system',
      },
    ];
    const scores = analyzePortfolioQuality(evidence);
    expect(scores.length).toBe(2);
    // Complex project should score higher
    expect(scores[1].overallScore).toBeGreaterThan(scores[0].overallScore);
  });
});

describe('Edge Cases — Integration', () => {
  it('full pipeline with minimal evidence', () => {
    const evidence: Evidence[] = [{
      id: '1',
      type: 'portfolio',
      title: 'Project',
      description: 'Built something',
    }];
    const skills = extractSkillsFromEvidence(evidence);
    const portfolioScores = analyzePortfolioQuality(evidence);

    expect(Array.isArray(skills)).toBe(true);
    expect(portfolioScores.length).toBe(1);
  });

  it('full pipeline with rich evidence', () => {
    const evidence: Evidence[] = [
      {
        id: '1',
        type: 'portfolio',
        title: 'Full Stack E-Commerce Platform',
        description: 'Built a scalable e-commerce platform with React frontend, Node.js/Express backend, and PostgreSQL database. Implemented JWT authentication, payment integration with Stripe, and Redis caching. Optimized API response times by 45%. Deployed on AWS with Docker and CI/CD pipelines.',
        technologies: 'React, Node.js, Express, PostgreSQL, Redis, Docker, AWS, JWT, Stripe',
        outcome: 'Live with 500+ users',
        duration: '4 months',
        yourRole: 'Full-Stack Lead',
        teamSize: 3,
        link: 'github.com/user/ecommerce',
      },
      {
        id: '2',
        type: 'internship',
        title: 'Backend Engineering Intern',
        description: 'Worked on microservices architecture. Built REST APIs in Python using FastAPI. Wrote comprehensive unit tests (90% coverage). Participated in code reviews and learned about production-ready deployment.',
        technologies: 'Python, FastAPI, PostgreSQL, Docker, Kubernetes',
        duration: '3 months',
        outcome: 'Converted to full-time offer',
        link: 'company.com',
      },
    ];
    const skills = extractSkillsFromEvidence(evidence);
    const portfolioScores = analyzePortfolioQuality(evidence);

    expect(skills.length).toBeGreaterThan(5);
    expect(portfolioScores.length).toBe(2);
  });
});
