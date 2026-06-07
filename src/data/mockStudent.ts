import { StudentProfile, Evidence } from '../types/evidence';

// ============================================================================
// PERSONA 0: Daniel Lee  ← PRIMARY STUDENT DEMO (Universities Module 03)
// Year 4 CS student at Universiti Malaya (UM), Kuala Lumpur
// Career Path: student → targeting SWE internship / graduate roles
// Key gap: no CI/CD, no monitoring, private repos — common for final-year students
// This persona is the core Universities Track subject: readiness profile for a
// student still in university, not yet in the workforce.
// ============================================================================

const danielEvidence: Evidence[] = [
  {
    id: 'daniel_fyp',
    type: 'fyp',
    title: 'Final Year Project — AI Governance Classifier (UM, 2025)',
    description:
      'Built a text classification system for automated AI policy compliance checking. Uses a fine-tuned BERT model to classify policy documents against a custom taxonomy of 14 governance categories. Dataset: 12,000 manually labelled documents from public government and corporate sources. Achieved 83% macro-F1 on held-out test set. Deployed on a local Flask server; demo runs on localhost only — not yet publicly hosted. Supervised by Dr. Lim Chee Kong (AI & ML Lab).',
    technologies: 'Python, PyTorch, BERT, Flask, React, PostgreSQL',
    duration: '8 months (Aug 2024 – Apr 2025)',
    outcome:
      'Grade: A. Shortlisted for UM Best FYP Award 2025 (CS stream). Code is private institutional repo. No CI/CD, no deployment monitoring configured.',
    link: 'https://um.edu.my',
  },
  {
    id: 'daniel_shopee_intern',
    type: 'internship',
    title: 'Backend Engineer Intern — Shopee Malaysia, Kuala Lumpur (Summer 2024)',
    description:
      'Contributed to the seller onboarding team. Built 2 internal CRUD APIs in Python/FastAPI for seller verification document upload and status tracking. Fixed 4 bugs in an existing Go microservice (read-only code review and one patch). Wrote unit tests for new Python services (coverage: 72%). Attended weekly sprint reviews and architecture walkthroughs. Did not deploy code to production — team policy requires 6-month tenure for production pushes. Staging deployment done by team lead.',
    technologies: 'Python, FastAPI, Go (read-only), MySQL, Redis, Docker (local)',
    duration: '3 months (Jun – Aug 2024)',
    outcome:
      'Performance review: "Strong learner, good test discipline, ready for independent projects." Stipend: MYR 2,800/month. No return offer — headcount freeze.',
  },
  {
    id: 'daniel_hackathon',
    type: 'hackathon',
    title: 'Hack KL 2024 — Finalist, Education Track (Team of 4)',
    description:
      'Built SkillBridge in 36 hours: a tool that compares a student\'s GitHub activity against JD skill lists and generates a visual gap report. I built the Python backend (FastAPI + GitHub API scraper) and wrote the prompt engineering layer using OpenAI API. Teammates handled frontend (Vue.js) and the pitching deck. 320+ users tried the demo during judging. Judges noted: "solid idea, backend is well-structured, needs production robustness." App went down twice during demo due to no rate-limit handling.',
    technologies: 'Python, FastAPI, OpenAI API, GitHub API, Vue.js',
    duration: '36 hours (Oct 2024)',
    outcome:
      'Top 5 finalist out of 62 teams. Demo had 320+ users. Code on GitHub (public). App currently offline — no hosting budget. No monitoring or error tracking was added.',
    link: 'https://github.com',
  },
  {
    id: 'daniel_personal_project',
    type: 'portfolio',
    title: 'StudyRoom — Peer Study Session Booking App (Personal, 2023)',
    description:
      'Full-stack web app for UM students to book peer study sessions with tutors. Built with React frontend and Node.js/Express backend. PostgreSQL for data, JWT for auth. Deployed to Heroku (now offline after Heroku free tier removal). At peak: 80 registered users, 14 active sessions/week. No automated testing written — manual testing only. No monitoring. App went down several times and students complained via WhatsApp group.',
    technologies: 'React, Node.js, Express, PostgreSQL, JWT, Heroku',
    duration: '4 months (Jan – Apr 2023)',
    outcome:
      '80 registered users. App offline since Nov 2023 (Heroku free tier removed). No CI/CD or tests. Source code public on GitHub but README is incomplete.',
  },
  {
    id: 'daniel_aws_cert',
    type: 'certificate',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    description:
      'Completed AWS Cloud Practitioner certification to improve deployment knowledge before internship season. Covers EC2, S3, RDS, Lambda, IAM, and basic networking concepts. Knowledge-level only — no hands-on deployment project completed post-certification. Planning to redeploy the FYP Flask API to EC2 but have not done so yet.',
    technologies: 'AWS EC2, S3, RDS, Lambda, IAM, VPC',
    verified: true,
    outcome: 'Certified Mar 2025. Score: 847/1000. Valid 3 years. Deployment practice still pending.',
  },
];

export const danielLeeProfile: StudentProfile = {
  id: 'student_daniel_004',
  name: 'Daniel Lee',
  university: 'Universiti Malaya (UM), Kuala Lumpur',
  year: 4,
  major: 'Computer Science',
  targetRole: 'Software Engineer',
  evidence: danielEvidence,
};

// ============================================================================
// PERSONA 1: Priya Sharma
// Senior Software Engineer at Grab, Singapore
// Career Path: Intern (2021) → SWE II (2022) → Senior SWE (2025)
// Salary Growth: MYR 12,250/month -> MYR 28,000/month -> MYR 52,500/month + equity
// Key Success Factor: System Design mastery (Year 3 inflection point)
// ============================================================================

const priyaEvidence: Evidence[] = [
  {
    id: 'priya_internship_2021',
    type: 'internship',
    title: 'SWE Intern — Grab, Singapore (2021)',
    description:
      'Developed backend microservices for Grab\'s transportation platform using Python and Go. Built RESTful APIs handling 50K+ requests/day for trip matching and payment processing. Worked on distributed systems with Redis caching and PostgreSQL optimization. Wrote comprehensive unit tests with 92% code coverage. Mentored by Staff Engineer on system design foundations. Delivered 3 production features shipped to 2M+ users within 3 months.',
    technologies: 'Python, Go, PostgreSQL, Redis, Microservices',
    duration: '3 months (Jun – Aug 2021)',
    outcome: 'Converted to SWE II full-time. Starting salary: MYR 12,250/month.',
    link: 'https://www.grab.com',
  },
  {
    id: 'priya_swe2_2022',
    type: 'internship',
    title: 'SWE II — Grab, Singapore (2022-2023)',
    description:
      'Led development of payment reconciliation system processing MYR 35B+ in monthly transactions. Designed distributed ledger system with strong consistency guarantees using Raft consensus. Reduced transaction settlement time by 40% through algorithmic optimization. Mentored 1 junior engineer on system design and code review practices. Presented architecture to executive stakeholders. Took on-call rotation for critical payment services.',
    technologies: 'Go, Distributed Systems, PostgreSQL, Kafka, System Design',
    duration: '18 months (2022-2023)',
    outcome: 'Recognized for technical depth. Salary: MYR 28,000/month. Promoted track for Senior SWE.',
  },
  {
    id: 'priya_senior_2024',
    type: 'internship',
    title: 'Senior SWE — Grab, Singapore (2024-2025)',
    description:
      'Architect and technical lead for Grab\'s core driver-consumer matching system. Responsible for 40+ microservices serving 8M+ daily active users. Designed real-time matching algorithm reducing average wait time by 25% while improving driver earnings by 18%. Led cross-team initiatives improving system reliability to 99.99% uptime SLA. Managed team of 2 engineers, conducting code reviews and technical mentorship. Influenced platform architecture decisions affecting entire organization.',
    technologies: 'Go, Python, Distributed Systems, Machine Learning, AWS',
    duration: '12+ months (2024-2025)',
    outcome: 'Senior engineer role. Leading critical platform systems. Salary: MYR 52,500/month + RSU equity package. Total annual: ~MYR 630k+.',
    link: 'https://www.grab.com',
  },
  {
    id: 'priya_skill_system_design',
    type: 'certificate',
    title: 'System Design Mastery (Key Inflection Point)',
    issuer: 'Grab Internal Training + Self-Study',
    description:
      'Acquired deep expertise in designing large-scale distributed systems during Year 3 (2023). Fluent in CAP theorem, consistency trade-offs, sharding strategies, consensus algorithms (Raft), and database optimization. Designed systems serving 100M+ QPS. This skill inflection point was the critical factor driving 30% salary growth from SWE II to Senior SWE.',
    technologies: 'Distributed Systems, Microservices, System Design, Scalability',
    verified: true,
    outcome: 'Recognized expert in org. Salary impact: +30% increase. This skill enables Staff Engineer trajectory.',
  },
];

export const priyaSharmaProfile: StudentProfile = {
  id: 'student_priya_001',
  name: 'Priya Sharma',
  university: 'IIT Bombay (Alumni)',
  year: 5,
  major: 'Computer Science & Mathematics',
  targetRole: 'Senior Software Engineer',
  evidence: priyaEvidence,
};

// ============================================================================
// PERSONA 2: Kai Chen
// Data Engineer at ByteDance, Singapore
// Career Path: Data Analyst (2022) → Data Engineer (2023) → Senior Data Engineer (2025)
// Salary Growth: MYR 21,000/month -> MYR 35,000/month -> MYR 42,000/month + RSU
// Key Success Factor: Real-time pipeline architecture (Year 2 inflection point)
// Market Context: Data Engineer roles have VERY HIGH demand (12-15% YoY growth)
// ============================================================================

const kaiEvidence: Evidence[] = [
  {
    id: 'kai_analyst_2022',
    type: 'internship',
    title: 'Data Analyst — DBS Bank, Singapore (2022)',
    description:
      'Analyzed customer financial behavior using SQL and Python. Built Tableau dashboards for 50+ stakeholders tracking transaction patterns, fraud signals, and customer segmentation. Identified 3 high-value customer segments, enabling targeted marketing campaigns generating MYR 7M+ revenue uplift. Used SQL optimization and statistical analysis (A/B testing). Collaborated with risk and marketing teams. Foundation in data infrastructure understanding.',
    technologies: 'SQL, Python, Tableau, Excel, Statistical Analysis',
    duration: '10 months (2022)',
    outcome: 'Strong analyst foundation. Promoted to Data Engineer. Salary: MYR 21,000/month.',
  },
  {
    id: 'kai_data_engineer_2023',
    type: 'internship',
    title: 'Data Engineer — ByteDance, Singapore (2023-2024)',
    description:
      'Transitioned to ByteDance to build data pipelines. Designed real-time data pipeline ingesting 100M+ events/day using Kafka, Flink, and Spark. Reduced data latency from 4 hours to 15 minutes for recommendation system. Built data quality monitoring system detecting pipeline failures automatically. Mentored 1 junior engineer on pipeline design patterns. Owned end-to-end data infrastructure for 3 product teams.',
    technologies: 'Kafka, Apache Flink, Spark, Python, ClickHouse, Data Pipeline Architecture',
    duration: '14 months (2023-2024)',
    outcome: 'Recognized for infrastructure expertise. Salary: MYR 35,000/month. On path to Staff Engineer.',
  },
  {
    id: 'kai_senior_2025',
    type: 'internship',
    title: 'Senior Data Engineer — ByteDance, Singapore (2025)',
    description:
      'Senior role managing data infrastructure for ByteDance Southeast Asia. Leading team of 2 engineers on core data platform. Designed next-generation event streaming architecture supporting 500M events/day. Architected data warehouse consolidation reducing costs by 35%. Led RFC process for major infrastructure decisions. Mentoring junior engineers on system design and career growth.',
    technologies: 'Kafka, Spark, ClickHouse, Python, Kubernetes, Data Architecture',
    duration: '6+ months (2025)',
    outcome: 'Senior data engineer. Salary: MYR 42,000/month + RSU equity. Total annual: ~MYR 542k+.',
    link: 'https://www.bytedance.com',
  },
  {
    id: 'kai_skill_realtime',
    type: 'certificate',
    title: 'Real-Time Data Architecture Expertise',
    issuer: 'ByteDance Learning + Industry Experience',
    description:
      'Mastered real-time streaming architecture during 2023-2024. Expert in Kafka tuning, Flink windowing, stateful processing, and distributed tracing. Designed systems with sub-second latency and exactly-once semantics. This skill made Kai highly valuable in data engineering market with 15% YoY demand growth.',
    technologies: 'Real-Time Streaming, Kafka, Flink, Exactly-Once Processing',
    verified: true,
    outcome: 'Unique expertise. Salary impact: +25-30% premium for this skill in Asia tech market.',
  },
];

export const kaiChenProfile: StudentProfile = {
  id: 'student_kai_002',
  name: 'Kai Chen',
  university: 'Nanyang Technological University (NTU), Singapore',
  year: 3,
  major: 'Computer Engineering',
  targetRole: 'Data Engineer',
  evidence: kaiEvidence,
};

// ============================================================================
// PERSONA 3: Aisha Patel
// Product Manager at Lazada, India (with Singapore expansion)
// Career Path: Business Analyst (2020) → Associate PM (2021) → PM (2024) → Senior PM (2025)
// Salary Growth: MYR 84K/year -> MYR 140K/year -> MYR 196K/year -> MYR 252K/year
// Key Success Factor: Market analysis + product strategy (Year 3 inflection point)
// Market Context: PM roles are competitive but high-reward (3-5% YoY growth)
// ============================================================================

const aishaEvidence: Evidence[] = [
  {
    id: 'aisha_analyst_2020',
    type: 'internship',
    title: 'Business Analyst — Flipkart, India (2020-2021)',
    description:
      'Analyzed user behavior on Flipkart\'s e-commerce platform using SQL and Tableau. Tracked KPIs across fashion category: DAU, conversion rate, cart abandonment. Identified category trend: 40% of users abandoned due to poor search filters. Recommended and documented solution for PM team. Strong foundation in data-driven decision making and stakeholder communication.',
    technologies: 'SQL, Tableau, Excel, User Research',
    duration: '12 months (2020-2021)',
    outcome: 'Transitioned to Associate PM. Salary: MYR 84K/year.',
  },
  {
    id: 'aisha_associate_pm_2021',
    type: 'internship',
    title: 'Associate PM — Amazon India (2021-2023)',
    description:
      'Owned search experience for fashion category on Amazon India. Led discovery research (20+ user interviews) identifying key pain points in existing filters. Proposed new faceted search redesign based on market analysis of top performers. Worked with engineers and design on implementation. Launched redesign increasing conversion by 8% (estimated MYR 2.8M+ annual impact). Collaborated with brand partnerships on category expansion.',
    technologies: 'Product Strategy, User Research, Data Analysis, Stakeholder Management',
    duration: '24 months (2021-2023)',
    outcome: 'Promoted to PM at Lazada. Salary: MYR 140K/year.',
  },
  {
    id: 'aisha_pm_2024',
    type: 'internship',
    title: 'Product Manager — Lazada, Singapore (2024-2025)',
    description:
      'PM for Lazada\'s cross-border commerce initiative connecting Indian sellers to Southeast Asian buyers. Led market research across 4 countries identifying category gaps. Built business case for new marketplace vertical targeting MYR 560M opportunity. Coordinated with finance (P&L modeling), logistics, and seller onboarding teams. Launched platform in 6 months to 100K+ sellers. Current GMV: MYR 280M+ annual run rate.',
    technologies: 'Product Strategy, Market Analysis, P&L Modeling, Team Leadership',
    duration: '14 months (2024-2025)',
    outcome: 'Senior PM promotion track. Salary: MYR 224K-252K/year with regional mobility premium.',
    link: 'https://www.lazada.com',
  },
  {
    id: 'aisha_skill_market_strategy',
    type: 'certificate',
    title: 'Market Analysis & Product Strategy',
    issuer: 'Amazon + Lazada Experience',
    description:
      'Developed deep expertise in market analysis, competitive intelligence, and product strategy during 2024. Comfortable analyzing TAM/SAM/SOM, competitive positioning, and multi-country market dynamics. This skill (geographic expansion, market entry strategy) is highly valued in Asia tech. Key differentiator for PM progression to Senior/Group PM roles.',
    technologies: 'Product Strategy, Market Analysis, Financial Modeling, Cross-Functional Leadership',
    verified: true,
    outcome: 'Unique for Asia PM market. Salary impact: +40-50% premium for this skill at senior PM level.',
  },
];

export const aishaPatelProfile: StudentProfile = {
  id: 'student_aisha_003',
  name: 'Aisha Patel',
  university: 'BITS Pilani, India',
  year: 4,
  major: 'Computer Science & Economics',
  targetRole: 'Product Manager',
  evidence: aishaEvidence,
};
