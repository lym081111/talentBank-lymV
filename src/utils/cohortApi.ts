/**
 * Cohort data layer — localStorage-backed for hackathon demo.
 * Production: replace localStorage calls with a real API endpoint.
 */

import { ReadinessProfile } from '../types/evidence';

const COHORT_KEY = 'pathlens_cohort_submissions';

interface CohortSubmission {
  studentId: string;
  overall: number;
  dimensions: { dimension: string; score: number }[];
  timestamp: string;
}

function loadSubmissions(): CohortSubmission[] {
  try {
    const raw = localStorage.getItem(COHORT_KEY);
    return raw ? (JSON.parse(raw) as CohortSubmission[]) : [];
  } catch {
    return [];
  }
}

function saveSubmissions(submissions: CohortSubmission[]): void {
  try {
    localStorage.setItem(COHORT_KEY, JSON.stringify(submissions));
  } catch {
    // storage quota exceeded — ignore
  }
}

/**
 * Submit student profile to cohort (anonymous, localStorage).
 * Returns true on success.
 */
export async function submitToCohort(profile: ReadinessProfile): Promise<boolean> {
  try {
    const submissions = loadSubmissions();
    const studentId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const submission: CohortSubmission = {
      studentId,
      overall: profile.overall,
      dimensions: profile.dimensions.map((d) => ({
        dimension: d.dimension,
        score: d.score,
      })),
      timestamp: new Date().toISOString(),
    };

    submissions.push(submission);
    saveSubmissions(submissions);
    // Submission confirmed
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the count of cohort submissions stored locally.
 */
export function getCohortSubmissionCount(): number {
  return loadSubmissions().length;
}
