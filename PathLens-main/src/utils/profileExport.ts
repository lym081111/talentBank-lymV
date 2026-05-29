/**
 * Profile export utilities for PathLens.
 *
 * Provides JSON export of a student's profile and evidence, producing a
 * portable, machine-readable file that could be consumed by Module 04
 * (Internship Marketplace) or other Career OS components.
 *
 * Output format: { profile, evidence[], exportedAt }
 * File naming: pathlens-profile-{name}-{date}.json
 */
import { StudentProfile, Evidence } from '../types/evidence';

/**
 * Triggers a browser download of the student's profile as a JSON file.
 * Suitable for sharing with career services or importing into other tools.
 *
 * @param profile - Student profile metadata (name, university, role)
 * @param evidence - Array of evidence items to include
 */
export function exportProfileToJSON(profile: StudentProfile, evidence: Evidence[]): void {
  const data = {
    profile: {
      name: profile.name,
      university: profile.university,
      year: profile.year,
      major: profile.major,
      targetRole: profile.targetRole,
    },
    evidence: evidence.map(e => ({
      type: e.type,
      title: e.title,
      description: e.description,
      technologies: e.technologies,
      link: e.link,
      duration: e.duration,
      outcome: e.outcome,
    })),
    exportedAt: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pathlens-profile-${profile.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
