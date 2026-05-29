import { StudentProfile, Evidence } from '../types/evidence';

const evidence: Evidence[] = [
  {
    id: 'fyp_001',
    type: 'fyp',
    title: 'AI Governance Document Classifier',
    description:
      'Built an AI-powered system to classify and analyze university governance documents using Python and NLP (spaCy + scikit-learn). Developed a React dashboard for governance staff to review and annotate classified documents in real-time. Integrated PostgreSQL for document storage with a REST API backend. System processes 200+ documents monthly and is actively used by the university governance office. Wrote unit tests with pytest; achieved 87% classification accuracy.',
    technologies: 'Python, spaCy, scikit-learn, React, PostgreSQL, REST API, pytest',
    duration: '6 months (Sep 2023 – Mar 2024)',
    outcome: 'Deployed to university server. Graded A. Adopted by governance office.',
    link: 'https://github.com/daniellee-dev/ai-governance-classifier',
  },
  {
    id: 'internship_001',
    type: 'internship',
    title: 'Software Engineering Intern — FinTech Startup, Kuala Lumpur',
    description:
      'Developed backend features for a SaaS payments platform using Node.js and Express. Built and documented REST APIs for user management and transaction processing, handling 500+ requests/day. Participated in daily standups, sprint planning, and code reviews. Resolved 3 critical production bugs using error logging (Sentry) and reduced average API latency by 18%. Mentored by senior engineers in a team of 6.',
    technologies: 'Node.js, Express, JavaScript, PostgreSQL, REST API, Sentry, Agile',
    duration: '3 months (Jun – Aug 2024)',
    outcome: 'Delivered 5 sprint features. Received return offer.',
    link: 'https://github.com/daniellee-dev/internship-portfolio',
  },
  {
    id: 'portfolio_001',
    type: 'portfolio',
    title: 'Personal Developer Portfolio',
    description:
      'Designed and built a personal portfolio site to showcase projects with a React frontend and Node.js API. Deployed on Vercel with automatic CI via GitHub Actions. Includes project descriptions, technology breakdowns, and live demo links. Receives 80+ unique monthly visitors. Code is fully open-source.',
    technologies: 'React, Node.js, CSS Modules, JavaScript, GitHub Actions, Vercel',
    link: 'https://github.com/daniellee-dev/portfolio-website',
    outcome: 'Live site with CI/CD pipeline. 80+ monthly visitors.',
  },
  {
    id: 'certificate_001',
    type: 'certificate',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    description:
      'Passed the AWS Certified Cloud Practitioner exam (CLF-C02). Covered core AWS services: EC2, S3, RDS, Lambda, IAM, and VPC. Completed 12 hours of hands-on labs deploying applications on AWS. Understands cloud cost optimization and shared responsibility security model.',
    technologies: 'AWS, EC2, S3, Lambda, IAM, Cloud Architecture',
    verified: true,
    outcome: 'Certified. Score: 832/1000.',
  },
  {
    id: 'hackathon_001',
    type: 'hackathon',
    title: 'Hack@UTM 2024 — RecSys Finalist',
    description:
      'Built a course recommendation system in 24 hours with 3 teammates. Implemented collaborative filtering in Python (scikit-learn) to match students with elective courses based on historical enrollment patterns. React frontend with live recommendation feed. Presented a working demo to a panel of 5 judges, answering technical questions on the algorithm design.',
    technologies: 'Python, scikit-learn, React, REST API, Collaborative Filtering',
    teamSize: 4,
    yourRole: 'Backend & ML developer',
    outcome: 'Finalist (top 5 of 40 teams). Live demo shipped.',
    link: 'https://github.com/daniellee-dev/hackutm-recsys',
  },
];

export const danielLeeProfile: StudentProfile = {
  id: 'student_001',
  name: 'Daniel Lee',
  university: 'Universiti Teknologi Malaysia (UTM)',
  year: 3,
  major: 'Computer Science',
  targetRole: 'Software Engineer',
  evidence,
};

// Additional demo personas for judges
const sarahTanEvidence: Evidence[] = [
  {
    id: 'coursework_001',
    type: 'certificate',
    title: 'Data Analysis & Visualization Coursework',
    issuer: 'National University of Singapore',
    description:
      'Completed a semester-long data analysis project analyzing 500K+ records of Singapore public transportation usage patterns. Built interactive Tableau dashboards showing peak-hour trends, cost analysis by zone, and passenger demographics. Wrote Python scripts to clean, aggregate, and analyze the dataset. Final report included statistical significance testing and business recommendations.',
    technologies: 'Python, Pandas, NumPy, Tableau, SQL',
    verified: false,
    outcome: 'Grade: A-. Dashboard published on Tableau Public.',
  },
  {
    id: 'portfolio_002',
    type: 'portfolio',
    title: 'Weather Prediction Model',
    description:
      'Built an end-to-end ML pipeline to predict daily rainfall in Singapore using historical weather data (2010-2024, 5.5K records). Trained multiple models (Linear Regression, Random Forest, XGBoost) and achieved 87% accuracy with XGBoost. Deployed model as REST API on Heroku. Created a React dashboard that predicts weather for the next 7 days. Processes 10K predictions daily.',
    technologies: 'Python, scikit-learn, XGBoost, REST API, React, Heroku, PostgreSQL',
    link: 'https://github.com/sarahtan-ds/weather-predictor',
    outcome: 'Live API with 10K daily predictions. Model achieving 87% accuracy.',
  },
  {
    id: 'internship_002',
    type: 'internship',
    title: 'Data Analytics Intern — E-Commerce Company, Singapore',
    description:
      'Analyzed user behavior data (2M+ events/month) using Python and SQL. Built automated dashboards tracking daily active users, conversion funnels, and feature engagement. Identified a critical bug in checkout flow causing 8% cart abandonment—fix increased conversions by 12%. Mentored by data lead in a team of 5 analysts. Learned advanced SQL optimization and A/B testing methodologies.',
    technologies: 'Python, SQL, Tableau, Google Analytics, Excel, Statistical Analysis',
    duration: '4 months (May – Aug 2024)',
    outcome: 'Identified 8% conversion loss. Return offer received.',
    link: 'https://github.com/sarahtan-ds/ecommerce-analytics',
  },
  {
    id: 'project_001',
    type: 'portfolio',
    title: 'Real-Time Metrics Dashboard',
    description:
      'Designed and deployed a real-time monitoring dashboard for a fintech platform. Ingests 500K+ events daily from a Kafka pipeline. Built with React frontend + Node.js backend + ClickHouse for analytics. Shows system health, transaction volumes, and revenue metrics with 30-second latency. Used by 15+ internal stakeholders.',
    technologies: 'React, Node.js, Kafka, ClickHouse, WebSockets, AWS EC2',
    link: 'https://github.com/sarahtan-ds/realtime-dashboard',
    outcome: 'In production. 500K events/day. Used by 15+ stakeholders.',
  },
];

export const sarahTanProfile: StudentProfile = {
  id: 'student_002',
  name: 'Sarah Tan',
  university: 'National University of Singapore (NUS)',
  year: 3,
  major: 'Data Science',
  targetRole: 'Data Engineer',
  evidence: sarahTanEvidence,
};

const ahmadRazifEvidence: Evidence[] = [
  {
    id: 'portfolio_003',
    type: 'portfolio',
    title: 'Task Management Mobile App',
    description:
      'Built a full-stack mobile app for task management using React Native, Django, and PostgreSQL. Features include task prioritization, recurring reminders, team collaboration, and cloud sync. Deployed on Google Play Store and App Store with 200+ downloads. Integrated Firebase for push notifications. Implemented complex state management using Redux.',
    technologies: 'React Native, Django, PostgreSQL, Redux, Firebase, JavaScript, Python',
    link: 'https://github.com/ahmadrazif/task-mate-app',
    outcome: 'Live on both stores. 200+ downloads. 4.5★ rating.',
  },
  {
    id: 'portfolio_004',
    type: 'portfolio',
    title: 'E-Learning Platform',
    description:
      'Developed a web-based e-learning platform with video streaming, quiz system, and progress tracking. Built with React frontend and Node.js/Express backend. Integrated Stripe for payment processing and YouTube API for video delivery. Supports 50+ concurrent users. Database optimized with PostgreSQL indexing.',
    technologies: 'React, Node.js, Express, PostgreSQL, Stripe API, YouTube API',
    link: 'https://github.com/ahmadrazif/elearning-platform',
    outcome: 'Live platform. 50 concurrent users. Payment processing working.',
  },
  {
    id: 'hackathon_002',
    type: 'hackathon',
    title: 'KLIKHACK 2024 — Smart City Solutions',
    description:
      'Built an IoT data visualization dashboard in 48 hours with 2 teammates. Real-time data from 50+ sensors across Kuala Lumpur. Uses Flutter for mobile UI and Node.js backend. Maps sensor locations and alerts for anomalies (temperature, humidity, pollution). Presented to 10 corporate judges.',
    technologies: 'Flutter, Node.js, MongoDB, AWS IoT, Real-time Data Processing',
    teamSize: 3,
    yourRole: 'Full-stack developer',
    outcome: 'Completed and presented. Positive feedback from judges.',
    link: 'https://github.com/ahmadrazif/smartcity-iot',
  },
  {
    id: 'portfolio_005',
    type: 'portfolio',
    title: 'API Testing Automation Suite',
    description:
      'Created an automated testing suite for REST APIs using Postman and JavaScript (Newman). Tests cover 40+ endpoints with 95% coverage. Integrated with GitHub Actions for CI/CD pipeline. Tests run on every PR and alert team of failures.',
    technologies: 'Postman, JavaScript, GitHub Actions, CI/CD',
    link: 'https://github.com/ahmadrazif/api-test-suite',
    outcome: '40+ endpoints tested. 95% coverage. CI/CD integrated.',
  },
];

export const ahmadRazifProfile: StudentProfile = {
  id: 'student_003',
  name: 'Ahmad Razif',
  university: 'Universiti Malaya (UM)',
  year: 2,
  major: 'Computer Science',
  targetRole: 'Full-Stack Engineer',
  evidence: ahmadRazifEvidence,
};
