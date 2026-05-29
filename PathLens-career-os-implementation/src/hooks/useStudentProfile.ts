import { useState, useCallback } from 'react';
import { StudentProfile } from '../types/evidence';
import { danielLeeProfile } from '../data/mockStudent';

const STORAGE_KEY = 'pathlens_student_profile';

function loadProfile(): StudentProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as StudentProfile;
  } catch {
    // ignore parse errors
  }
  return danielLeeProfile;
}

function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore storage errors
  }
}

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);

  const updateProfile = useCallback((updates: Partial<StudentProfile> | StudentProfile) => {
    setProfile((prev) => {
      // If it's a full profile object, use it directly
      if ('id' in updates && 'evidence' in updates) {
        const next = updates as StudentProfile;
        saveProfile(next);
        return next;
      }
      // Otherwise merge partial updates
      const next = { ...prev, ...(updates as Partial<StudentProfile>) };
      saveProfile(next);
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(danielLeeProfile);
    saveProfile(danielLeeProfile);
  }, []);

  const isDemoProfile = profile.name === danielLeeProfile.name && profile.id === danielLeeProfile.id;

  return { profile, updateProfile, resetProfile, isDemoProfile };
}
