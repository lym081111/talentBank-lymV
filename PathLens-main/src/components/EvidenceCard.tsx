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
      <p className={styles.description}>{evidence.description}</p>
      {evidence.technologies && (
        <div className={styles.tech}>
          <strong>Tech:</strong> {evidence.technologies}
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
    </article>
  );
}
