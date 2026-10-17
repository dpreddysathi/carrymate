import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth/AuthContext';
import type { ProductRequest, Trip } from '../types';
import { pillFor, routeLabel, TravelerLine } from '../components/MarketCards';

export function TripDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [myRequests, setMyRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Deal proposal form
  const [showForm, setShowForm] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [price, setPrice] = useState('');
  const [commission, setCommission] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const t = await api.getTrip(Number(id));
        setTrip(t);
        setCommission(t.commissionPct != null ? String(t.commissionPct) : '');
        if (user) {
          const mine = await api.myRequests();
          setMyRequests(mine.filter((r) => r.status === 'OPEN'));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load trip');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  const propose = async () => {
    if (!requestId || !price) {
      setFormError('Pick a request and agree a product price.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const agreed = Number(price);
      const commPct = commission ? Number(commission) : 0;
      const deal = await api.proposeDeal({
        tripId: Number(id),
        requestId: Number(requestId),
        agreedProductPrice: agreed,
        // commission entered as % of product price for convenience
        commissionAmount: Math.round(agreed * (commPct / 100) * 100) / 100,
      });
      navigate(`/deals/${deal.id}`);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Proposal failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading trip…</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!trip) return <div className="empty">Trip not found.</div>;

  const isOwner = user?.id === trip.traveler.id;

  return (
    <div>
      <h1 className="page-title">
        {routeLabel(trip.fromCity, trip.fromCountry, trip.toCity, trip.toCountry)}
      </h1>
      <p className="page-sub">
        <span className={`pill ${pillFor(trip.status)}`}>{trip.status}</span>
      </p>

      <div className="two-col">
        <div className="status-card">
          <div className="kv">
            <div className="kv-row">
              <span className="kv-key">Departure</span>
              <span className="kv-val">{trip.departureDate}</span>
            </div>
            {trip.arrivalDate && (
              <div className="kv-row">
                <span className="kv-key">Arrival</span>
                <span className="kv-val">{trip.arrivalDate}</span>
              </div>
            )}
            {trip.availableKg != null && (
              <div className="kv-row">
                <span className="kv-key">Luggage space</span>
                <span className="kv-val">{trip.availableKg} kg</span>
              </div>
            )}
            {trip.commissionPct != null && (
              <div className="kv-row">
                <span className="kv-key">Commission</span>
                <span className="kv-val">{trip.commissionPct}%</span>
              </div>
            )}
            {trip.categories && (
              <div className="kv-row">
                <span className="kv-key">Carries</span>
                <span className="kv-val">{trip.categories}</span>
              </div>
            )}
          </div>

          {!isOwner && trip.status === 'OPEN' && (
            <div className="action-bar">
              {user ? (
                <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
                  {showForm ? 'Hide proposal form' : 'Propose a deal'}
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Log in to propose a deal
                </Link>
              )}
            </div>
          )}

          {showForm && user && (
            <div style={{ marginTop: 16 }}>
              <hr className="divider" />
              <h3>Propose a deal</h3>
              {formError && <div className="form-error">{formError}</div>}
              {myRequests.length === 0 ? (
                <p>
                  You have no open product requests.{' '}
                  <Link to="/requests/new" className="link">
                    Create one first
                  </Link>
                  .
                </p>
              ) : (
                <>
                  <div className="form-group">
                    <label className="label">Your request</label>
                    <select
                      className="select"
                      value={requestId}
                      onChange={(e) => setRequestId(e.target.value)}
                    >
                      <option value="">Choose a request…</option>
                      {myRequests.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.productName} (buy in {r.buyCountry})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Agreed product price (INR)</label>
                      <input
                        className="input"
                        type="number"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Commission %</label>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        value={commission}
                        onChange={(e) => setCommission(e.target.value)}
                      />
                      <p className="form-hint">
                        Suggested: {trip.commissionPct ?? '—'}% (traveler's ask)
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={propose}
                    disabled={submitting}
                  >
                    {submitting ? 'Proposing…' : 'Send proposal'}
                  </button>
                  <p className="form-hint">
                    Nothing is charged yet — the traveler accepts first, then
                    you pay into escrow.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="status-card">
          <h3 style={{ marginTop: 0 }}>Traveler</h3>
          <TravelerLine traveler={trip.traveler} />
          <p className="card-meta">{trip.traveler.email}</p>
          {trip.traveler.travelerVerified ? (
            <p>
              <span className="badge-verified">✓ identity verified</span>
            </p>
          ) : (
            <p className="small">Identity not verified yet.</p>
          )}
          {trip.traveler.ratingCount > 0 && (
            <p className="small">
              {trip.traveler.ratingCount} review
              {trip.traveler.ratingCount === 1 ? '' : 's'} from past deals
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
