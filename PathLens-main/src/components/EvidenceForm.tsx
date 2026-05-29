import { useState } from 'react';
import { Evidence, EvidenceType } from '../types/evidence';
import styles from './EvidenceForm.module.css';

interface Props {
  initial?: Evidence;
  /** Pre-fills form fields without treating this as an edit (heading stays "Add Evidence") */
  startWith?: Partial<Omit<Evidence, 'id'>>;
  onSave: (data: Omit<Evidence, 'id'>) => void;
  onCancel: () => void;
}

const EVIDENCE_TYPES: { value: EvidenceType; label: string }[] = [
  { value: 'fyp', label: 'Final Year Project' },
  { value: 'internship', label: 'Internship' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'hackathon', label: 'Hackathon' },
];

interface FormErrors {
  title?: string;
  description?: string;
  type?: string;
  link?: string;
}

/** Scores description quality on 4 signals (0–4). Used to show real-time writing feedback. */
function scoreDescription(text: string): { score: number; hints: string[] } {
  const lower = text.toLowerCase();
  const hints: string[] = [];
  let score = 0;

  if (text.trim().length >= 50) score++;
  if (/\b(built|developed|created|designed|implemented|deployed|shipped|engineered)\b/.test(lower)) score++;
  else hints.push('Add an action verb (Built, Deployed, Designed…)');

  if (/\d+[%x]|\d+\s*(users|requests|ms|seconds|hours|days|customers|features|tests)/.test(lower))
    score++;
  else hints.push('Add a metric (e.g. "40% faster", "500 users")');

  if (/\b(because|so that|which|resulted|impact|outcome|led to|improved|reduced|increased|saving)\b/.test(lower))
    score++;
  else hints.push('Explain the outcome or impact of your work');

  return { score, hints };
}

export function EvidenceForm({ initial, startWith, onSave, onCancel }: Props) {
  const seed = initial ?? startWith;
  const [type, setType] = useState<EvidenceType>(seed?.type ?? 'portfolio');
  const [title, setTitle] = useState(initial?.title ?? startWith?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? startWith?.description ?? '');
  const [technologies, setTechnologies] = useState(initial?.technologies ?? startWith?.technologies ?? '');
  const [duration, setDuration] = useState(initial?.duration ?? startWith?.duration ?? '');
  const [outcome, setOutcome] = useState(initial?.outcome ?? startWith?.outcome ?? '');
  const [link, setLink] = useState(initial?.link ?? startWith?.link ?? '');
  const [yourRole, setYourRole] = useState(initial?.yourRole ?? startWith?.yourRole ?? '');
  const [teamSize, setTeamSize] = useState(initial?.teamSize?.toString() ?? startWith?.teamSize?.toString() ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const next: FormErrors = {};
    if (title.trim().length < 3) next.title = 'Title must be at least 3 characters.';
    if (description.trim().length < 50)
      next.description = `Description must be at least 50 characters (${description.trim().length}/50).`;
    if (link.trim() && !isValidUrl(link.trim())) {
      next.link = 'Invalid URL. Try: github.com/user/project or https://deployed-app.com';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function isValidUrl(string: string): boolean {
    // Allow URLs with or without https://
    const urlString = string.startsWith('http://') || string.startsWith('https://')
      ? string
      : `https://${string}`;

    try {
      new URL(urlString);
      return true;
    } catch (_) {
      return false;
    }
  }

  function normalizeUrl(string: string): string {
    if (!string) return '';
    if (string.startsWith('http://') || string.startsWith('https://')) {
      return string;
    }
    return `https://${string}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      type,
      title: title.trim(),
      description: description.trim(),
      technologies: technologies.trim() || undefined,
      duration: duration.trim() || undefined,
      outcome: outcome.trim() || undefined,
      link: link.trim() ? normalizeUrl(link.trim()) : undefined,
      yourRole: yourRole.trim() || undefined,
      teamSize: teamSize.trim() ? parseInt(teamSize.trim()) : undefined,
    });
    // Clear form after successful submission (only if not editing)
    if (!initial) {
      setTitle('');
      setDescription('');
      setType('portfolio');
      setTechnologies('');
      setDuration('');
      setOutcome('');
      setLink('');
      setYourRole('');
      setTeamSize('');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.heading}>{initial ? 'Edit Evidence' : startWith ? `Add Evidence — ${startWith.type === 'internship' ? 'Internship' : startWith.type === 'hackathon' ? 'Hackathon' : startWith.type === 'certificate' ? 'Certificate' : startWith.type === 'fyp' ? 'Final Year Project' : 'Portfolio Project'}` : 'Add Evidence'}</h3>

      {!initial && (
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent-light) 100%)',
          border: '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: '20px',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          lineHeight: '1.5'
        }}>
          <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>💡 Pro Tip:</strong>
          The more specific you are about what you built and what you learned, the better we can assess your skills.
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ev-type">Type *</label>
        <select
          id="ev-type"
          className={styles.select}
          value={type}
          onChange={e => setType(e.target.value as EvidenceType)}
        >
          {EVIDENCE_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ev-title">Title *</label>
        <input
          id="ev-title"
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. AI Document Classifier"
          maxLength={120}
          aria-describedby={errors.title ? 'ev-title-error' : undefined}
          aria-invalid={!!errors.title}
        />
        {errors.title && <span id="ev-title-error" className={styles.error}>{errors.title}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ev-description">Description *</label>
        <textarea
          id="ev-description"
          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          aria-describedby={errors.description ? 'ev-desc-error' : undefined}
          aria-invalid={!!errors.description}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe what you built, what you learned, and what impact it had. Be specific (50+ characters)."
          rows={4}
        />
        <div className={styles.charCounterContainer}>
          <div className={styles.charProgress}>
            <div
              className={styles.charProgressFill}
              style={{
                width: `${Math.min((description.trim().length / 50) * 100, 100)}%`,
              }}
            />
          </div>
          <span className={`${styles.charCountText} ${description.trim().length >= 50 ? styles.valid : ''}`}>
            {description.trim().length}/50 characters — {description.trim().length >= 50 ? '✓ Ready' : `${50 - description.trim().length} more needed`}
          </span>
        </div>
        {/* Description quality indicator — helps users write better evidence */}
        {description.trim().length >= 20 && (() => {
          const { score, hints } = scoreDescription(description);
          const stars = ['☆☆☆☆', '★☆☆☆', '★★☆☆', '★★★☆', '★★★★'][score];
          const label = score === 4 ? 'Excellent' : score === 3 ? 'Good' : score === 2 ? 'Fair' : 'Weak';
          const color = score >= 3 ? 'var(--color-success)' : score >= 2 ? 'var(--color-warning)' : 'var(--color-danger)';
          return (
            <div style={{ marginTop: '8px', padding: '8px 12px', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: hints.length > 0 ? '6px' : '0' }}>
                <span style={{ color, fontWeight: '700' }}>{stars} {label} description</span>
                {score < 4 && <span style={{ color: 'var(--color-text-muted)' }}>— {4 - score} improvement{4 - score !== 1 ? 's' : ''} left</span>}
              </div>
              {hints.slice(0, 2).map((hint, i) => (
                <div key={i} style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  ↗ {hint}
                </div>
              ))}
            </div>
          );
        })()}
        {errors.description && <span id="ev-desc-error" className={styles.error}>{errors.description}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ev-tech">Technologies</label>
        <input
          id="ev-tech"
          className={styles.input}
          type="text"
          value={technologies}
          onChange={e => setTechnologies(e.target.value)}
          placeholder="e.g. Python, React, PostgreSQL, REST API"
          maxLength={200}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="ev-duration">Duration</label>
          <input
            id="ev-duration"
            className={styles.input}
            type="text"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            placeholder="e.g. 6 months"
            maxLength={60}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="ev-outcome">Outcome</label>
          <input
            id="ev-outcome"
            className={styles.input}
            type="text"
            value={outcome}
            onChange={e => setOutcome(e.target.value)}
            placeholder="e.g. Finalist, deployed to production"
            maxLength={120}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ev-link">Project Link</label>
        <input
          id="ev-link"
          className={`${styles.input} ${errors.link ? styles.inputError : ''}`}
          type="text"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="e.g. github.com/username/project (we'll add https:// automatically)"
          maxLength={300}
          aria-describedby={errors.link ? 'ev-link-error' : undefined}
          aria-invalid={!!errors.link}
        />
        {errors.link && <span id="ev-link-error" className={styles.error}>{errors.link}</span>}
        {!errors.link && <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
          Optional: Link to GitHub, deployed app, or project demo. Enter with or without https://
        </span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Your Role</label>
          <input
            className={styles.input}
            type="text"
            value={yourRole}
            onChange={e => setYourRole(e.target.value)}
            placeholder="e.g. Backend Lead, Full-stack, QA Tester"
            maxLength={60}
          />
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
            Optional: What was your specific contribution?
          </span>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Team Size</label>
          <input
            className={styles.input}
            type="number"
            value={teamSize}
            onChange={e => setTeamSize(e.target.value)}
            placeholder="e.g. 3"
            min="1"
            max="100"
          />
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
            Optional: How many people were on the team?
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.saveBtn}>
          {initial ? 'Save Changes' : 'Add Evidence'}
        </button>
      </div>
    </form>
  );
}
