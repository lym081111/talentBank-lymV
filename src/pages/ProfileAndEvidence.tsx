import { useState, useEffect, useRef, useMemo } from 'react';
import { Evidence, StudentProfile, ExtractedSkill } from '../types/evidence';
import { EvidenceCard } from '../components/EvidenceCard';
import { EvidenceForm } from '../components/EvidenceForm';
import { SkillsByDemandVisualization } from '../components/SkillsByDemandVisualization';
import { exportEvidenceToPDF } from '../utils/pdfExport';
import { exportProfileToJSON } from '../utils/profileExport';
// import { extractSkillsFromEvidence } from '../utils/skillExtraction'; // Not currently used
import styles from './ProfileAndEvidence.module.css';

interface Props {
  profile: StudentProfile;
  evidence: Evidence[];
  isDemoMode?: boolean;
  onUpdateProfile?: (updates: Partial<StudentProfile>) => void;
  onAddEvidence: (data: Omit<Evidence, 'id'>) => void;
  onUpdateEvidence: (id: string, data: Omit<Evidence, 'id'>) => void;
  onDeleteEvidence: (id: string) => void;
  onAnalyze: () => void;
  onClearAndStart?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

type FormMode = 'closed' | 'add' | { editing: Evidence } | { template: Partial<Omit<Evidence, 'id'>> };

const EVIDENCE_TEMPLATES: Array<{
  emoji: string;
  label: string;
  hint: string;
  data: Partial<Omit<Evidence, 'id'>>;
}> = [
  {
    emoji: '💻',
    label: 'Portfolio Project',
    hint: 'A web, mobile, or software project you built',
    data: {
      type: 'portfolio',
      description: 'I built [project name], a [web/mobile app] that [describe what it does]. I used [technologies] to implement [key feature]. The main challenge was [challenge] and I solved it by [approach]. The project is [deployed/used by X users/open source on GitHub].',
      technologies: 'e.g. React, Node.js, PostgreSQL',
    },
  },
  {
    emoji: '🏢',
    label: 'Internship',
    hint: 'Work experience at a company',
    data: {
      type: 'internship',
      description: 'I interned at [Company] as a [Role] for [duration]. My main task was building/improving [feature or system] using [technologies]. I collaborated with a team of [X] engineers. Key achievement: [measurable impact, e.g. reduced load time by 30%, shipped feature used by 1000 users].',
      technologies: 'e.g. Python, Django, AWS',
    },
  },
  {
    emoji: '🏆',
    label: 'Hackathon',
    hint: 'A competition or time-limited build event',
    data: {
      type: 'hackathon',
      description: 'Competed in [Hackathon Name] over [24/48 hours] with a team of [X]. We built [project name] to solve [problem]. Used [technologies] to implement [core feature]. We [won/placed/were finalists]. My specific contribution: [what you built or led].',
      technologies: 'e.g. Python, Firebase, React',
    },
  },
  {
    emoji: '📜',
    label: 'Certificate / Course',
    hint: 'Online learning or certification',
    data: {
      type: 'certificate',
      description: 'Completed [Course Name] by [Provider, e.g. Coursera, AWS, Google] covering [key topics]. Applied the knowledge by building [project or exercise]. Skills verified: [skills]. Earned [certificate/badge] demonstrating [what the certification proves].',
      technologies: 'e.g. TensorFlow, Python, SQL',
    },
  },
  {
    emoji: '🎓',
    label: 'Final Year Project',
    hint: 'University capstone or research project',
    data: {
      type: 'fyp',
      description: 'Final year project: [project title]. I built [describe the system or research] using [technologies]. The core technical challenge was [challenge] which I addressed by [approach]. Supervised by [Prof/supervisor]. Outcome: [grade/published/deployed/presented at conference].',
      technologies: 'e.g. Python, Machine Learning, PostgreSQL',
    },
  },
];

export function ProfileAndEvidence({
  profile,
  evidence,
  isDemoMode = false,
  onUpdateProfile,
  onAddEvidence,
  onUpdateEvidence,
  onDeleteEvidence,
  onAnalyze,
  onClearAndStart,
  onBack,
  backLabel = 'Back',
}: Props) {
  const [formMode, setFormMode] = useState<FormMode>('closed');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(!isDemoMode && evidence.length === 0);
  const [editForm, setEditForm] = useState(profile);
  const formRef = useRef<HTMLDivElement>(null);
  const allExtractedSkills = useMemo(() => {
    const skills: ExtractedSkill[] = [];
    evidence.forEach(item => {
      if (item.technologies) {
        item.technologies.split(',').forEach(tech => {
          const trimmed = tech.trim();
          if (trimmed) {
            skills.push({
              skill: trimmed,
              confidence: 'high',
              sourceEvidenceId: item.id,
              sourcePhrase: item.technologies || '',
            });
          }
        });
      }
    });
    return skills;
  }, [evidence]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    setEditForm(profile);
    if (!isDemoMode && evidence.length === 0) {
      setIsEditingProfile(true);
      setFormMode('closed');
    }
  }, [profile, isDemoMode, evidence.length]);


  function handleSave(data: Omit<Evidence, 'id'>) {
    if (formMode === 'add' || (typeof formMode === 'object' && 'template' in formMode)) {
      onAddEvidence(data);
      setShowSuccess(true);
    } else if (typeof formMode === 'object' && 'editing' in formMode) {
      onUpdateEvidence(formMode.editing.id, data);
    }
    setFormMode('closed');
  }

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name: editForm.name,
        year: editForm.year,
        major: editForm.major,
        targetRole: editForm.targetRole,
        university: editForm.university,
      });
    }
    setIsEditingProfile(false);
  };

  const handleExportEvidence = () => {
    exportEvidenceToPDF(profile.name, evidence);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← {backLabel}
          </button>
        )}

        {isDemoMode && (
          <div style={{
            background: 'linear-gradient(135deg, #06111f 0%, #0f172a 55%, #172554 100%)',
            border: '1px solid rgba(34, 211, 238, 0.28)',
            borderRadius: '22px',
            padding: '22px',
            marginBottom: '24px',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '18px',
              flexWrap: 'wrap',
            }}>
              <div style={{ maxWidth: '540px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#67e8f9',
                  marginBottom: '8px',
                }}>
                  Guided demo profile
                </div>
                <h2 style={{ margin: 0, color: 'white', fontSize: '24px', fontWeight: 900, letterSpacing: '-0.04em' }}>
                  {profile.name}'s resume has already been converted into a Career OS.
                </h2>
                <p style={{ margin: '10px 0 0 0', color: 'rgba(255,255,255,0.62)', fontSize: '14px', lineHeight: 1.7 }}>
                  Review the evidence, extracted skills, readiness landscape, and next actions as if this were a real submitted resume.
                </p>
              </div>
              {onClearAndStart && (
                <button
                  onClick={onClearAndStart}
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    padding: '11px 18px',
                    background: 'white',
                    color: '#020617',
                    border: 'none',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Start a blank profile
                </button>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '10px',
              marginTop: '18px',
            }}>
              {[
                ['1', 'Resume evidence', 'Work history is split into proof blocks.'],
                ['2', 'Skill signal', 'Tools and capabilities are traceable to source.'],
                ['3', 'Readiness view', 'Scores explain gaps and next moves.'],
              ].map(([num, title, body]) => (
                <div key={num} style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.045)',
                  borderRadius: '14px',
                  padding: '13px',
                }}>
                  <div style={{ color: '#67e8f9', fontSize: '12px', fontWeight: 900 }}>{num}</div>
                  <div style={{ color: 'white', fontSize: '13px', fontWeight: 800, marginTop: '4px' }}>{title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '4px', lineHeight: 1.45 }}>{body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.profileCard}>
          {isEditingProfile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Edit Your Profile</h3>
              <div>
                <label htmlFor="profile-name" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{
                    width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label htmlFor="profile-university" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>University</label>
                <input
                  id="profile-university"
                  type="text"
                  value={editForm.university || ''}
                  onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                  placeholder="e.g., National University of Singapore"
                  style={{
                    width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label htmlFor="profile-year" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Year</label>
                  <input
                    id="profile-year"
                    type="number"
                    min="1"
                    max="5"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                    style={{
                      width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="profile-major" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Major</label>
                  <input
                    id="profile-major"
                    type="text"
                    value={editForm.major}
                    onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                    placeholder="e.g., Computer Science"
                    style={{
                      width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="profile-role" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Target Role</label>
                <input
                  id="profile-role"
                  type="text"
                  value={editForm.targetRole}
                  onChange={(e) => setEditForm({ ...editForm, targetRole: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  style={{
                    width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    flex: 1, padding: '10px', background: 'var(--color-primary)', color: 'white',
                    border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    setEditForm(profile);
                  }}
                  style={{
                    flex: 1, padding: '10px', background: 'transparent', color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0 }}>{profile.name}</h2>
                <button
                  onClick={() => {
                    setEditForm(profile);
                    setIsEditingProfile(true);
                  }}
                  style={{
                    fontSize: '12px', padding: '6px 12px', background: 'transparent',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: '600'
                  }}
                >
                  ✏️ Edit
                </button>
              </div>
              <div className={styles.profileDetails}>
                {profile.university && (
                  <div className={styles.detail}>
                    <strong>University:</strong> {profile.university}
                  </div>
                )}
                <div className={styles.detail}>
                  <strong>Year:</strong> {profile.year}
                </div>
                <div className={styles.detail}>
                  <strong>Major:</strong> {profile.major}
                </div>
                <div className={styles.detail}>
                  <strong>Target Role:</strong> {profile.targetRole}
                </div>
                <div className={styles.detail}>
                  <strong>Evidence Items:</strong> {evidence.length}
                </div>
              </div>
              <p className={styles.subtitle}>Your career profile — built during university, carried through your entire career.</p>
            </>
          )}

          <div className={styles.progressBar}>
            <div className={styles.progressInfo}>
              <span className={styles.progressLabel}>
                Evidence collected: <strong>{evidence.length}/5</strong>
              </span>
              <span className={styles.progressHint}>
                {evidence.length === 0 ? 'Add at least 3 items for best results' : evidence.length < 3 ? 'Keep adding - 3+ items recommended' : evidence.length >= 5 ? 'Perfect! Ready to assess' : 'Great! You can continue adding more'}
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${Math.min((evidence.length / 5) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>

        <div className={styles.evidenceSection}>
          {showSuccess && (
            <div className={styles.successMessage}>
              ✓ Evidence added! We'll analyze it when you're ready.
            </div>
          )}
          <div className={styles.evidenceHeader}>
            <div>
              <h3>Build Your Evidence</h3>
              <p className={styles.evidenceIntro}>
                Add your best work. We'll extract skills automatically and score your readiness across dimensions that matter for internships.
              </p>
            </div>
          </div>

          {formMode !== 'closed' && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                maxHeight: '90vh',
                overflowY: 'auto',
                width: '90%',
                maxWidth: '600px',
                padding: '32px',
              }} ref={formRef}>
                <EvidenceForm
                  initial={typeof formMode === 'object' && 'editing' in formMode ? formMode.editing : undefined}
                  startWith={typeof formMode === 'object' && 'template' in formMode ? formMode.template : undefined}
                  onSave={handleSave}
                  onCancel={() => setFormMode('closed')}
                />
              </div>
            </div>
          )}

          {evidence.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Ready to show what you've built?</p>
              <p className={styles.emptyHint}>
                Choose a template below to get started — we'll pre-fill the form so you only need to fill in the specifics.
              </p>
              <div className={styles.templateGrid}>
                {EVIDENCE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.data.type}
                    className={styles.templateCard}
                    onClick={() => setFormMode({ template: tmpl.data })}
                  >
                    <span className={styles.templateEmoji}>{tmpl.emoji}</span>
                    <span className={styles.templateLabel}>{tmpl.label}</span>
                    <span className={styles.templateHint}>{tmpl.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className={styles.evidenceList}>
                {evidence.map(item => (
                  <EvidenceCard
                    key={item.id}
                    evidence={item}
                    onEdit={e => setFormMode({ editing: e })}
                    onDelete={onDeleteEvidence}
                  />
                ))}
              </div>

              {/* Skills Grouped by Demand */}
              {allExtractedSkills.length > 0 && (
                  <div style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    marginTop: '32px',
                    marginBottom: '20px',
                  }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
                      📊 Skills Summary (by Demand Level)
                    </h3>
                    <SkillsByDemandVisualization extractedSkills={allExtractedSkills} />
                  </div>
              )}
            </>
          )}

          <div className={styles.actionButtons}>
            {evidence.length > 0 && formMode === 'closed' && (
              <button
                className={styles.exportButton}
                onClick={() => setFormMode('add')}
              >
                + Add More Evidence
              </button>
            )}
            {evidence.length > 0 && (
              <>
                <button
                  className={styles.exportButton}
                  onClick={handleExportEvidence}
                  title="Export evidence as PDF report"
                >
                  📥 Export Evidence
                </button>
                <button
                  className={styles.exportButton}
                  onClick={() => exportProfileToJSON(profile, evidence)}
                  title="Export profile and evidence as JSON"
                  style={{ fontSize: '13px' }}
                >
                  💾 Export as JSON
                </button>
              </>
            )}
            <button
              className={styles.analyzeButton}
              onClick={onAnalyze}
              disabled={evidence.length === 0}
            >
              See My Readiness
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
