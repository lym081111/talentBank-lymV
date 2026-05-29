import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://your-instance.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'your-token',
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get cohort insight (simulated with Redis cache)
app.get('/api/cohort/insight', async (req, res) => {
  try {
    // Try to get from Redis cache first
    const cached = await redis.get('cohort:insight');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // If not cached, return mock data and cache it
    const cohortData = {
      totalStudents: 47,
      readinessDistribution: {
        internshipReady: 18,
        developing: 22,
        emerging: 7,
      },
      topGaps: [
        {
          dimension: 'Production Practices',
          studentCount: 28,
          percentage: 59.6,
        },
        {
          dimension: 'Communication',
          studentCount: 19,
          percentage: 40.4,
        },
        {
          dimension: 'Role-Specific Fit',
          studentCount: 15,
          percentage: 31.9,
        },
      ],
      suggestedInterventions: [
        {
          title: 'CI/CD Mastery Workshop',
          description: 'Learn deployment pipelines, Docker, and cloud platforms',
          targetStudents: 28,
          impact: 'Could push ~15 students to Internship-Ready',
        },
        {
          title: 'Technical Communication Group',
          description: 'Practice explaining code, architecture, and technical decisions',
          targetStudents: 19,
          impact: 'Improve communication skills and interview confidence',
        },
      ],
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 1 hour
    await redis.setex('cohort:insight', 3600, JSON.stringify(cohortData));

    res.json(cohortData);
  } catch (error) {
    console.error('Error fetching cohort insight:', error);
    // Return mock data as fallback
    res.json({
      totalStudents: 47,
      readinessDistribution: {
        internshipReady: 18,
        developing: 22,
        emerging: 7,
      },
      topGaps: [
        { dimension: 'Production Practices', studentCount: 28, percentage: 59.6 },
        { dimension: 'Communication', studentCount: 19, percentage: 40.4 },
      ],
      suggestedInterventions: [],
      lastUpdated: new Date().toISOString(),
    });
  }
});

// Save student profile (for future use)
app.post('/api/student/profile', async (req, res) => {
  try {
    const { studentId, profile } = req.body;
    if (!studentId || !profile) {
      return res.status(400).json({ error: 'Missing studentId or profile' });
    }

    // Save to Redis
    await redis.set(`student:${studentId}`, JSON.stringify(profile));
    res.json({ success: true, studentId });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Get student profile
app.get('/api/student/profile/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const profile = await redis.get(`student:${studentId}`);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(JSON.parse(profile));
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get cohort statistics
app.get('/api/cohort/stats', async (req, res) => {
  try {
    const stats = {
      totalStudents: 47,
      averageReadiness: 62.3,
      topDimensions: [
        { dimension: 'Technical Skills', average: 68 },
        { dimension: 'Work Readiness', average: 65 },
        { dimension: 'Portfolio Evidence', average: 59 },
      ],
      studentsByReadinessLevel: {
        'Emerging (<30)': 7,
        'Developing (30-54)': 22,
        'Internship-Ready (55-74)': 15,
        'Advanced (75+)': 3,
      },
      timestamp: new Date().toISOString(),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
  console.log(`✅ PathLens Backend running on port ${PORT}`);
  console.log(`📊 Cohort endpoint: http://localhost:${PORT}/api/cohort/insight`);
  console.log(`💾 Redis connection: ${process.env.UPSTASH_REDIS_REST_URL ? 'Connected' : 'Using mock data'}`);
});

export default app;
