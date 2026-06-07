import { Evidence } from '../types/evidence';
import styles from './EvidenceCard.module.css';

interface Props {
  evidence: Evidence;
  onEdit?: (evidence: Evidence) => void;
  onDelete?: (id: string) => void;
}

export function EvidenceCard({ evidence, onEdit, onDelete }: Props) {
  const typeLabels: Record<string, string> = {
    fyp: 'Final Year Project',
    internship: 'Internship',
    portfolio: 'Portfolio',
    certificate: 'Certificate',
    hackathon: 'Hackathon',
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${evidence.title}"? This cannot be undone.`)) {
      onDelete?.(evidence.id);
    }
  };

  const technologies = evidence.technologies
    ? evidence.technologies.split(',').map((tech) => tech.trim()).filter(Boolean)
    : [];
  const hasOutcome = Boolean(evidence.outcome);
  const hasSource = Boolean(evidence.link || evidence.verified);
  const text = `${evidence.description} ${evidence.outcome || ''} ${evidence.technologies || ''}`.toLowerCase();
  const hasProductionSignal = ['deploy', 'production', 'user', 'merged', 'reduced', 'improved'].some((signal) => text.includes(signal));
  const quality = hasOutcome && hasSource
    ? 'Verified'
    : hasOutcome || hasProductionSignal
      ? 'Needs source link'
      : 'Needs stronger proof';
  const missingProof = [
    !hasSource ? 'source URL' : '',
    !hasOutcome ? 'measurable outcome' : '',
    !hasProductionSignal ? 'production or user signal' : '',
  ].filter(Boolean);

  return (
    <article className={styles.card} aria-label={`${typeLabels[evidence.type]}: ${evidence.title}`}>
      <div className={styles.header}>
        <h3>{evidence.title}</h3>
        <div className={styles.headerRight}>
          <span className={styles.badge} aria-label={`Type: ${typeLabels[evidence.type]}`}>{typeLabels[evidence.type]}</span>
          {(onEdit || onDelete) && (
            <div className={styles.cardActions} role="group" aria-label={`Actions for ${evidence.title}`}>
              {onEdit && (
                <button
                  className={styles.editBtn}
                  onClick={() => onEdit(evidence)}
                  aria-label={`Edit ${evidence.title}`}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  className={styles.deleteBtn}
                  onClick={handleDelete}
                  aria-label={`Delete ${evidence.title}`}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.passportStrip}>
        <div>
          <span className={styles.passportLabel}>Evidence quality</span>
          <strong className={styles.passportValue}>{quality}</strong>
        </div>
        <div>
          <span className={styles.passportLabel}>Why it matters</span>
          <strong className={styles.passportValue}>{hasProductionSignal ? 'Shows applied work' : 'Needs external proof'}</strong>
        </div>
      </div>

      <p className={styles.description}>{evidence.description}</p>
      {technologies.length > 0 && (
        <div className={styles.signalBlock}>
          <strong>Detected signals:</strong>
          <div className={styles.techPills}>
            {technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      )}
      {evidence.duration && (
        <div className={styles.meta}>
          <strong>Duration:</strong> {evidence.duration}
        </div>
      )}
      {evidence.outcome && (
        <div className={styles.meta}>
          <strong>Outcome:</strong> {evidence.outcome}
        </div>
      )}
      <div className={styles.missingProof}>
        <strong>Missing proof:</strong>{' '}
        {missingProof.length ? missingProof.join(', ') : 'none flagged for this demo block'}
      </div>
    </article>
  );
}
