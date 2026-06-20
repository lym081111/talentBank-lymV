import { useState } from 'react';
import styles from './AuthPage.module.css';

export interface AuthUser {
  name: string;
  email: string;
  role: 'candidate' | 'employer' | 'university';
}

interface Props {
  onAuthenticate: (user: AuthUser) => void;
}

export function AuthPage({ onAuthenticate }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('Alyssa Tan');
  const [email, setEmail] = useState('alyssa@university.edu');
  const [role, setRole] = useState<AuthUser['role']>('candidate');
  const [message, setMessage] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextUser = {
      name: name.trim() || 'Career OS User',
      email: email.trim() || 'user@example.com',
      role,
    };

    if (mode === 'register') {
      try {
        localStorage.setItem('pathlens_registered_user', JSON.stringify(nextUser));
      } catch {
        // Registration still proceeds in-memory for the prototype.
      }
      setMode('login');
      setMessage('Account created. Log in with the same details to continue.');
      return;
    }

    setMessage('');
    onAuthenticate({
      name: nextUser.name,
      email: nextUser.email,
      role: nextUser.role,
    });
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.kicker}>Talentbank Career OS prototype</span>
          <h1>Find jobs with evidence, not guesswork.</h1>
          <p>
            PathLens starts like a real jobsite: sign in, build your profile, search roles, match jobs,
            apply with proof, and let the readiness module show what to improve next.
          </p>
          <div className={styles.featureGrid}>
            {[
              ['Profile builder', 'Turn resume items into proof blocks.'],
              ['Job search', 'Filter mock roles by keyword, location, and work mode.'],
              ['Job matching', 'See why a role fits and what blocks the application.'],
              ['Dashboards', 'Candidate, employer, and university views from one profile.'],
            ].map(([title, body]) => (
              <div key={title}>
                <strong>{title}</strong>
                <span>{body}</span>
              </div>
            ))}
          </div>
        </div>

        <form className={styles.card} onSubmit={handleSubmit}>
          <div className={styles.modeSwitch} aria-label="Authentication mode">
            <button type="button" className={mode === 'login' ? styles.active : ''} onClick={() => setMode('login')}>
              Login
            </button>
            <button type="button" className={mode === 'register' ? styles.active : ''} onClick={() => setMode('register')}>
              Register
            </button>
          </div>

          <div className={styles.formHeader}>
            <h2>{mode === 'login' ? 'Welcome back' : 'Create your Career OS account'}</h2>
            <p>{mode === 'login' ? 'Use the seeded account or enter your own details.' : 'Prototype account stored locally in this browser.'}</p>
          </div>

          {message && <div className={styles.status}>{message}</div>}

          <label>
            Full name
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
          </label>

          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>

          <label>
            Continue as
            <select value={role} onChange={(event) => setRole(event.target.value as AuthUser['role'])}>
              <option value="candidate">Candidate / Student</option>
              <option value="employer">Employer</option>
              <option value="university">University</option>
            </select>
          </label>

          <button className={styles.submit} type="submit">
            {mode === 'login' ? 'Login to Career OS' : 'Create account'}
          </button>

          <p className={styles.note}>
            Frontend prototype only: no password, no backend, no real personal data leaves the browser.
          </p>
        </form>
      </section>
    </main>
  );
}
