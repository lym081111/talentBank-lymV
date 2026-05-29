export function AppFooter() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '24px 20px',
        borderTop: '1px solid var(--color-divider)',
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        background: 'var(--color-surface)',
        marginTop: '48px',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
          PathLens — <span style={{ fontWeight: '400' }}>Adaptive Readiness Profile · Module 03 of 5 · Universities Track</span>
        </p>
        <p style={{ margin: '0 0 5px 0' }}>
          Talentbank Tech Hackathon 2026 · Build Asia's Career OS
        </p>
        <p style={{ margin: '0 0 5px 0', fontSize: '11px' }}>
          A lifetime career profile — built during university, updated through your career, portable across Asia.
        </p>
        <p style={{ margin: '0', fontSize: '11px' }}>
          🤖 <strong>AI:</strong> Claude claude-haiku-4-5 (Anthropic) · narrative insights only ·{' '}
          <strong>Scoring:</strong> rule-based keyword extraction · transparent, not ML ·{' '}
          <strong>Data:</strong> localStorage only · no external servers
        </p>
      </div>
    </footer>
  );
}
