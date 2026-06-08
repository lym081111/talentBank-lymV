import { Evidence, ReadinessProfile, StudentProfile, DimensionScore } from '../types/evidence';

const panelStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-xl)',
  padding: '28px',
  boxShadow: 'var(--shadow-sm)',
  marginBottom: '28px',
} as const;

const labelStyle = {
  fontSize: '11px',
  fontWeight: 900,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--color-primary)',
  marginBottom: '8px',
} as const;

function getWeakDimensions(profile: ReadinessProfile) {
  return [...profile.dimensions].sort((a, b) => a.score - b.score).slice(0, 3);
}

function getStrongDimensions(profile: ReadinessProfile) {
  return [...profile.dimensions].sort((a, b) => b.score - a.score).slice(0, 2);
}

function getEvidenceTitle(evidence: Evidence[], id: string) {
  return evidence.find((item) => item.id === id)?.title || 'Evidence item';
}

function getRequirementSet(targetRole: string) {
  const role = targetRole.toLowerCase();

  if (role.includes('data')) {
    return ['Python', 'SQL', 'Data Pipeline', 'Testing', 'Communication'];
  }

  if (role.includes('product')) {
    return ['User Research', 'Analytics', 'Communication', 'Documentation', 'Roadmap'];
  }

  return ['React', 'TypeScript', 'API', 'Testing', 'Deployment'];
}

function matchesRequirement(skill: string, requirement: string) {
  const normalizedSkill = skill.toLowerCase();
  const normalizedRequirement = requirement.toLowerCase();

  if (normalizedRequirement === 'api') {
    return normalizedSkill.includes('api') || normalizedSkill.includes('node') || normalizedSkill.includes('express');
  }

  if (normalizedRequirement === 'deployment') {
    return normalizedSkill.includes('vercel') || normalizedSkill.includes('aws') || normalizedSkill.includes('docker');
  }

  if (normalizedRequirement === 'data pipeline') {
    return normalizedSkill.includes('pipeline') || normalizedSkill.includes('spark') || normalizedSkill.includes('kafka') || normalizedSkill.includes('flink');
  }

  return normalizedSkill.includes(normalizedRequirement) || normalizedRequirement.includes(normalizedSkill);
}

function evidenceQuality(evidence: Evidence[]) {
  const linked = evidence.filter((item) => item.link || item.verified).length;
  const outcome = evidence.filter((item) => item.outcome).length;
  const production = evidence.filter((item) => {
    const text = `${item.description} ${item.outcome || ''} ${item.technologies || ''}`.toLowerCase();
    return text.includes('deploy') || text.includes('production') || text.includes('user') || text.includes('merged');
  }).length;

  return { linked, outcome, production };
}

export function ReadinessWorkspacePanel({
  profile,
  studentProfile,
  evidence,
  onViewGaps,
}: {
  profile: ReadinessProfile;
  studentProfile: StudentProfile;
  evidence: Evidence[];
  onViewGaps: () => void;
}) {
  const blockers = getWeakDimensions(profile);
  const quality = evidenceQuality(evidence);

  return (
    <section style={panelStyle} aria-label="Internship readiness workspace">
      <div style={labelStyle}>Internship Readiness Workspace</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'start' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-text)', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.04em' }}>
            Career Signal Map for {studentProfile.targetRole || 'your target role'}.
          </h2>
          <p style={{ margin: '12px 0 0 0', color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '15px' }}>
            This is not a scoreboard. PathLens turns evidence into a working plan: what is proven, what is weak, what to fix in 30 days, and what can be sent to a hiring team.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px' }}>
            {[
              `${evidence.length} proof blocks`,
              `${quality.linked} linked sources`,
              `${quality.production} production signals`,
              `${profile.allExtractedSkills.length} skill signals`,
            ].map((item) => (
              <span key={item} style={{
                border: '1px solid var(--color-border)',
                borderRadius: '999px',
                padding: '8px 12px',
                background: 'var(--color-surface-hover)',
                color: 'var(--color-text)',
                fontSize: '12px',
                fontWeight: 800,
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent-light) 100%)',
          border: '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            3 blockers before you apply
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {blockers.map((dimension) => (
              <div key={dimension.dimension} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--color-text)' }}>{dimension.dimension}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-danger)' }}>{dimension.score}/100</span>
                </div>
                <p style={{ margin: '6px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
                  {dimension.explanation}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={onViewGaps}
            style={{
              marginTop: '14px',
              width: '100%',
              padding: '12px 14px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: 'white',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Open blocker plan
          </button>
        </div>
      </div>
    </section>
  );
}

export function ReadinessSprint({
  dimensions,
  evidence,
}: {
  dimensions: DimensionScore[];
  evidence: Evidence[];
}) {
  const blockers = [...dimensions].sort((a, b) => a.score - b.score).slice(0, 3);
  const strongestEvidence = evidence.find((item) => item.outcome) || evidence[0];

  const sprint = [
    {
      week: 'Week 1',
      title: 'Turn the strongest proof block into a public artifact',
      body: strongestEvidence
        ? `Polish "${strongestEvidence.title}" with a clear README, outcome, screenshots, and one source link.`
        : 'Add one project, internship, or coursework artifact with technologies, outcome, and a source link.',
    },
    {
      week: 'Week 2',
      title: `Close the weakest signal: ${blockers[0]?.dimension || 'Portfolio Evidence'}`,
      body: blockers[0]?.explanation || 'Add evidence that shows the skill in context, not just as a keyword.',
    },
    {
      week: 'Week 3',
      title: 'Create one recruiter-readable proof story',
      body: 'Write one STAR-style project story with problem, action, measurable result, and exact stack used.',
    },
    {
      week: 'Week 4',
      title: 'Run the profile again before applications',
      body: 'Update the evidence bank, rerun extraction, and compare blocker movement before sending applications.',
    },
  ];

  return (
    <section style={panelStyle} aria-label="30-day readiness sprint">
      <div style={labelStyle}>30-Day Readiness Sprint</div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
        Fix the evidence, not the vibes.
      </h3>
      <p style={{ margin: '0 0 18px 0', color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
        A practical sprint that turns the lowest readiness signals into proof an internship reviewer can inspect.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {sprint.map((item) => (
          <div key={item.week} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px', background: 'var(--color-surface-hover)' }}>
            <div style={{ color: 'var(--color-accent)', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{item.week}</div>
            <strong style={{ display: 'block', color: 'var(--color-text)', fontSize: '14px', marginBottom: '8px' }}>{item.title}</strong>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ApplicationPack({
  profile,
  studentProfile,
  evidence,
}: {
  profile: ReadinessProfile;
  studentProfile: StudentProfile;
  evidence: Evidence[];
}) {
  const topSkills = profile.allExtractedSkills.slice(0, 5).map((skill) => skill.skill);
  const strongest = evidence.find((item) => item.outcome) || evidence[0];

  return (
    <section style={panelStyle} aria-label="Application pack">
      <div style={labelStyle}>Application Pack</div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
        Ready-to-use material from the evidence bank.
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '18px' }}>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <div style={labelStyle}>Resume bullet</div>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.65, fontSize: '13px' }}>
            Built {strongest?.title || 'a verified project'} using {topSkills.slice(0, 3).join(', ') || 'documented technologies'}, with evidence mapped to {profile.level.toLowerCase()} readiness for {studentProfile.targetRole || 'target roles'}.
          </p>
        </div>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <div style={labelStyle}>Portfolio summary</div>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.65, fontSize: '13px' }}>
            Shows {evidence.length} proof blocks, {profile.allExtractedSkills.length} extracted skill signals, and traceable sources instead of generic resume claims.
          </p>
        </div>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <div style={labelStyle}>Interview prompts</div>
          <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.75 }}>
            <li>Explain the strongest technical decision in {strongest?.title || 'your best evidence'}.</li>
            <li>Show where the source artifact proves {topSkills[0] || 'your main skill'}.</li>
            <li>Describe one gap you will close before the next application cycle.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function EvidenceBackedHiringBrief({
  profile,
  studentProfile,
  evidence,
}: {
  profile: ReadinessProfile;
  studentProfile: StudentProfile;
  evidence: Evidence[];
}) {
  const strengths = getStrongDimensions(profile);
  const risks = getWeakDimensions(profile);
  const quality = evidenceQuality(evidence);

  return (
    <section style={panelStyle} aria-label="Evidence-backed hiring brief">
      <div style={labelStyle}>Evidence-backed Hiring Brief</div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
        What a recruiter can trust about {studentProfile.name}.
      </h3>
      <p style={{ margin: '0 0 18px 0', color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '14px' }}>
        Generated from student-controlled evidence. This is a demo brief, not an automated hiring decision.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px', background: 'var(--color-surface-hover)' }}>
          <strong style={{ color: 'var(--color-text)', fontSize: '14px' }}>Shortlist reason</strong>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: '8px 0 0 0' }}>
            {strengths.map((item) => `${item.dimension} ${item.score}/100`).join(' and ') || 'Evidence is still developing'} with {quality.outcome} outcome-backed proof block{quality.outcome === 1 ? '' : 's'}.
          </p>
        </div>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px', background: 'var(--color-surface-hover)' }}>
          <strong style={{ color: 'var(--color-text)', fontSize: '14px' }}>Risk to inspect</strong>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: '8px 0 0 0' }}>
            Validate {risks.map((item) => item.dimension).join(', ') || 'source quality'} in interview. Ask for artifact walkthrough, trade-offs, and test/deployment proof.
          </p>
        </div>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px', background: 'var(--color-surface-hover)' }}>
          <strong style={{ color: 'var(--color-text)', fontSize: '14px' }}>Suggested MYR band</strong>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: '8px 0 0 0' }}>
            Internship / junior evaluation band: MYR 3,000-4,500 per month, adjusted by verified production evidence and interview outcome.
          </p>
        </div>
      </div>
    </section>
  );
}

export function JobDescriptionMatch({
  profile,
  studentProfile,
  evidence,
}: {
  profile: ReadinessProfile;
  studentProfile: StudentProfile;
  evidence: Evidence[];
}) {
  const requirements = getRequirementSet(studentProfile.targetRole || 'Software Engineer Intern');
  const matched = requirements.filter((requirement) =>
    profile.allExtractedSkills.some((skill) => matchesRequirement(skill.skill, requirement))
  );
  const missing = requirements.filter((requirement) => !matched.includes(requirement));
  const matchPct = Math.round((matched.length / requirements.length) * 100);

  return (
    <section style={panelStyle} aria-label="Job description match">
      <div style={labelStyle}>Lightweight Job Description Match</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-text)', fontSize: '22px', fontWeight: 900, letterSpacing: '-0.03em' }}>
            {studentProfile.targetRole || 'Software Engineer Intern'} match, based only on evidence.
          </h3>
          <p style={{ margin: '10px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
            A mocked JD scanner shows how the same readiness profile can become application guidance. It is intentionally lightweight for Stage 1.
          </p>
        </div>
        <div style={{ textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px', background: 'var(--color-surface-hover)' }}>
          <div style={{ fontSize: '34px', fontWeight: 900, color: matchPct >= 70 ? 'var(--color-success)' : matchPct >= 45 ? 'var(--color-warning)' : 'var(--color-danger)' }}>{matchPct}%</div>
          <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Evidence match</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '18px' }}>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <strong style={{ color: 'var(--color-text)', fontSize: '14px' }}>Matched requirements</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {matched.length ? matched.map((item) => (
              <span key={item} style={{ background: 'var(--color-success-light)', color: 'var(--color-success)', border: '1px solid var(--color-success)', borderRadius: '999px', padding: '5px 9px', fontSize: '12px', fontWeight: 800 }}>{item}</span>
            )) : <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>No direct requirement match yet.</span>}
          </div>
        </div>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <strong style={{ color: 'var(--color-text)', fontSize: '14px' }}>Missing evidence</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {missing.length ? missing.map((item) => (
              <span key={item} style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)', border: '1px solid var(--color-warning)', borderRadius: '999px', padding: '5px 9px', fontSize: '12px', fontWeight: 800 }}>{item}</span>
            )) : <span style={{ color: 'var(--color-success)', fontSize: '13px', fontWeight: 800 }}>No major requirement gap found.</span>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '16px', color: 'var(--color-text-muted)', fontSize: '12px', lineHeight: 1.6 }}>
        Sample source trail: {profile.allExtractedSkills.slice(0, 3).map((skill) => `${skill.skill} from ${getEvidenceTitle(evidence, skill.sourceEvidenceId)}`).join(' | ') || 'Add evidence to generate a source trail.'}
      </div>
    </section>
  );
}
