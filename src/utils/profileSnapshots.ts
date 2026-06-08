/**
 * profileSnapshots.ts
 *
 * Lightweight localStorage-backed snapshot store for the "evolving profile" requirement
 * (Universities Module 03 spec: "remains current post-graduation").
 *
 * A snapshot captures the overall score + all dimension scores at a point in time.
 * Students can manually save snapshots after each major update (internship complete,
 * FYP submitted, etc.) and see their readiness timeline grow over the years.
 *
 * Production: replace localStorage with a user-account API endpoint so snapshots
 * persist across devices and survive browser clears.
 */

export interface ReadinessSnapshot {
  id: string;
  savedAt: string; // ISO 8601
  label: string;   // e.g. "Year 3 — pre-internship", "Post-graduation Month 6"
  overall: number;
  dimensions: Array<{ dimension: string; score: number }>;
  studentName: string;
}

const SNAPSHOTS_KEY = 'pathlens_profile_snapshots';

export function getSnapshots(): ReadinessSnapshot[] {
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    return raw ? (JSON.parse(raw) as ReadinessSnapshot[]) : [];
  } catch {
    return [];
  }
}

export function getSnapshotsForStudent(studentName: string): ReadinessSnapshot[] {
  return getSnapshots().filter((s) => s.studentName === studentName);
}

export function saveSnapshot(
  profile: { overall: number; dimensions: Array<{ dimension: string; score: number }> },
  studentName: string,
  label?: string
): ReadinessSnapshot {
  const all = getSnapshots();
  const snapshot: ReadinessSnapshot = {
    id: `snap_${Date.now()}`,
    savedAt: new Date().toISOString(),
    label:
      label ??
      new Date().toLocaleDateString('en-MY', { month: 'short', year: 'numeric' }),
    overall: profile.overall,
    dimensions: profile.dimensions.map((d) => ({
      dimension: d.dimension,
      score: d.score,
    })),
    studentName,
  };
  localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify([...all, snapshot]));
  return snapshot;
}

export function clearSnapshotsForStudent(studentName: string): void {
  const remaining = getSnapshots().filter((s) => s.studentName !== studentName);
  localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(remaining));
}

/**
 * Seed two historical snapshots for Daniel Lee so the judge can immediately see
 * the "evolving profile" concept in action — Year 2 (no internship, ~28/100)
 * and Year 3 (FYP in progress, ~44/100) sit behind the current Year 4 score.
 *
 * Call this once on first demo load; it exits early if snapshots already exist
 * so it never overwrites real user data.
 */
export function seedDemoSnapshots(studentName: string): boolean {
  if (studentName !== 'Daniel Lee') return false;

  const existing = getSnapshotsForStudent(studentName);
  if (existing.some((s) => s.id.startsWith('snap_daniel_'))) return false; // already seeded

  const seeded: ReadinessSnapshot[] = [
    {
      id: 'snap_daniel_y2',
      savedAt: new Date(2023, 5, 14).toISOString(), // Jun 2023
      label: 'Year 2 — no internship yet',
      overall: 27,
      dimensions: [
        { dimension: 'Technical Skills', score: 34 },
        { dimension: 'Portfolio Evidence', score: 20 },
        { dimension: 'Work Readiness', score: 10 },
        { dimension: 'Communication & Documentation', score: 38 },
        { dimension: 'Production Practices', score: 8 },
        { dimension: 'Role-Specific Fit (Software Engineer)', score: 30 },
      ],
      studentName,
    },
    {
      id: 'snap_daniel_y3',
      savedAt: new Date(2024, 5, 1).toISOString(), // Jun 2024
      label: 'Year 3 — FYP underway',
      overall: 44,
      dimensions: [
        { dimension: 'Technical Skills', score: 55 },
        { dimension: 'Portfolio Evidence', score: 38 },
        { dimension: 'Work Readiness', score: 22 },
        { dimension: 'Communication & Documentation', score: 50 },
        { dimension: 'Production Practices', score: 18 },
        { dimension: 'Role-Specific Fit (Software Engineer)', score: 48 },
      ],
      studentName,
    },
  ];

  const all = getSnapshots();
  localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify([...seeded, ...all]));
  return true;
}
