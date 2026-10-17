import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth/AuthContext';
import type { DocType, Review, User, Verification } from '../types';
import { pillFor } from '../components/MarketCards';

export function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [docType, setDocType] = useState<DocType>('PASSPORT');
  const [docReference, setDocReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const [p, r, v] = await Promise.all([
          api.getUser(user.id),
          api.userReviews(user.id),
          api.myVerifications(),
        ]);
        setProfile(p);
        setReviews(r);
        setVerifications(v);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const submitVerification = async () => {
    setSubmitting(true);
    setFormMsg('');
    try {
      const v = await api.requestVerification({
        docType,
        docReference: docReference.trim() || undefined,
      });
      setVerifications((prev) => [v, ...prev]);
      if (profile) {
        setProfile({ ...profile, verificationStatus: 'PENDING' });
      }
      setFormMsg('Verification request submitted — status: PENDING.');
      setDocReference('');
    } catch (e) {
      setFormMsg(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading profile…</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!profile) return <div className="empty">Profile not found.</div>;

  return (
    <div>
      <h1 className="page-title">{profile.name}</h1>
      <p className="page-sub">
        {profile.travelerVerified ? (
          <span className="badge-verified">✓ verified traveler</span>
        ) : (
          <span className={`pill ${pillFor(profile.verificationStatus)}`}>
            {profile.verificationStatus === 'NONE'
              ? 'not verified'
              : profile.verificationStatus.toLowerCase()}
          </span>
        )}{' '}
        {profile.ratingCount > 0 && (
          <span className="rating">
            ★ {profile.ratingAvg.toFixed(1)} ({profile.ratingCount} reviews)
          </span>
        )}
      </p>

      <div className="two-col">
        <div>
          <div className="status-card">
            <h3 style={{ marginTop: 0 }}>Account</h3>
            <div className="kv">
              <div className="kv-row">
                <span className="kv-key">Email</span>
                <span className="kv-val">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="kv-row">
                  <span className="kv-key">Phone</span>
                  <span className="kv-val">{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="status-card">
            <h3 style={{ marginTop: 0 }}>Reviews received</h3>
            {reviews.length === 0 ? (
              <p className="small">No reviews yet — they appear after completed deals.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} style={{ marginBottom: 12 }}>
                  <p style={{ margin: '0 0 4px' }}>
                    <span className="rating">★ {r.rating}</span>{' '}
                    <strong>{r.reviewer.name}</strong>{' '}
                    <span className="small">· deal #{r.dealId}</span>
                  </p>
                  {r.comment && <p className="card-meta">{r.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="status-card">
          <h3 style={{ marginTop: 0 }}>Traveler verification</h3>
          <p className="small">
            Verified travelers get more deals. We store only a document
            reference in v1 — never the document itself.
          </p>
          {formMsg && <div className="success-box">{formMsg}</div>}
          <div className="form-group">
            <label className="label">Document type</label>
            <select
              className="select"
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocType)}
            >
              <option value="PASSPORT">Passport</option>
              <option value="AADHAAR">Aadhaar</option>
              <option value="DRIVING_LICENSE">Driving license</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Reference (last 4 digits + how checked)</label>
            <input
              className="input"
              placeholder="e.g. passport ending 1234, video call"
              value={docReference}
              onChange={(e) => setDocReference(e.target.value)}
            />
            <p className="form-hint">
              Never enter your full document number here.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-block"
            disabled={submitting}
            onClick={submitVerification}
          >
            {submitting ? 'Submitting…' : 'Request verification'}
          </button>

          {verifications.length > 0 && (
            <>
              <hr className="divider" />
              <h4>My requests</h4>
              {verifications.map((v) => (
                <div key={v.id} className="card-row" style={{ marginBottom: 8 }}>
                  <span className="small">{v.docType.replace('_', ' ')}</span>
                  <span className={`pill ${pillFor(v.status)}`}>{v.status}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
