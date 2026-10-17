import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-panel">
        <h2>Your trip is someone's delivery.</h2>
        <p>
          Join thousands of travelers earning commission on baggage space
          they'd waste anyway.
        </p>
        <ul className="auth-pitch">
          <li>
            <span className="tick">✓</span>
            <span>Escrow-protected payments on every deal</span>
          </li>
          <li>
            <span className="tick">✓</span>
            <span>Verified travelers, real ratings</span>
          </li>
          <li>
            <span className="tick">✓</span>
            <span>Customs duty estimated up front</span>
          </li>
        </ul>
      </div>
      <div className="auth-card">
        <h1 className="page-title">Welcome back</h1>
        <p className="page-sub">Log in to manage your trips, requests and deals.</p>
        <div className="demo-hint">
          🚧 <strong>Demo mode:</strong> log in with{' '}
          <strong>demo@carrymate.app</strong> and any password.
        </div>
        <form className="form" onSubmit={submit}>
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
          <p className="form-hint" style={{ marginTop: 12 }}>
            New here? <Link to="/register" className="link">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
