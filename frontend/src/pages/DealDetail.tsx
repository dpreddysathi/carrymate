import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth/AuthContext';
import type { Customs, Deal, DealStatus } from '../types';
import { pillFor } from '../components/MarketCards';

const PIPELINE: DealStatus[] = [
  'PROPOSED',
  'ACCEPTED',
  'PURCHASED',
  'IN_TRANSIT',
  'DELIVERED',
  'CONFIRMED',
];

const STEP_LABELS: Record<DealStatus, string> = {
  PROPOSED: 'Deal proposed',
  ACCEPTED: 'Traveler accepted',
  PURCHASED: 'Product purchased abroad',
  IN_TRANSIT: 'On the way',
  DELIVERED: 'Delivered',
  CONFIRMED: 'Confirmed — money released',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
};

const CANCELLABLE: DealStatus[] = ['PROPOSED', 'ACCEPTED', 'PURCHASED', 'IN_TRANSIT'];

export function DealDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [customs, setCustoms] = useState<Customs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // customs form
  const [items, setItems] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  // review form
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const load = useCallback(async () => {
    try {
      const d = await api.getDeal(Number(id));
      setDeal(d);
      try {
        setCustoms(await api.customsForDeal(Number(id)));
      } catch {
        setCustoms(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load deal');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (fn: () => Promise<Deal>, label: string) => {
    if (!window.confirm(`${label}?`)) return;
    setBusy(true);
    setError('');
    try {
      const d = await fn();
      setDeal(d);
      try {
        setCustoms(await api.customsForDeal(Number(id)));
      } catch {
        setCustoms(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  const holdPayment = async () => {
    setBusy(true);
    setError('');
    try {
      await api.holdPayment(Number(id));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment hold failed');
    } finally {
      setBusy(false);
    }
  };

  const declareCustoms = async () => {
    if (!items.trim() || !declaredValue) {
      setError('Describe the items and the declared value.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      setCustoms(
        await api.declareCustoms({
          dealId: Number(id),
          itemsDescription: items.trim(),
          declaredValue: Number(declaredValue),
        }),
      );
      setItems('');
      setDeclaredValue('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Declaration failed');
    } finally {
      setBusy(false);
    }
  };

  const confirmCustoms = async () => {
    if (!customs) return;
    setBusy(true);
    setError('');
    try {
      setCustoms(await api.confirmCustoms(customs.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Confirmation failed');
    } finally {
      setBusy(false);
    }
  };

  const submitReview = async () => {
    setBusy(true);
    setError('');
    try {
      await api.createReview({
        dealId: Number(id),
        rating: Number(rating),
        comment: comment.trim() || undefined,
      });
      setComment('');
      alert('Thanks! Your review was recorded.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Review failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="loading">Loading deal…</div>;
  if (error && !deal) return <div className="error-box">{error}</div>;
  if (!deal) return <div className="empty">Deal not found.</div>;

  const isTraveler = user?.id === deal.traveler.id;
  const isShopper = user?.id === deal.shopper.id;
  const doneSteps = new Set(deal.events.map((e) => e.status));

  return (
    <div>
      <h1 className="page-title">Deal #{deal.id}</h1>
      <p className="page-sub">
        <span className={`pill ${pillFor(deal.status)}`}>{deal.status.replace('_', ' ')}</span>{' '}
        {deal.productRequest.productName} · {deal.currency}{' '}
        {deal.totalAmount.toLocaleString()} total
      </p>

      {error && <div className="error-box">{error}</div>}

      <div className="two-col">
        <div>
          <div className="status-card">
            <h3 style={{ marginTop: 0 }}>Progress</h3>
            <div className="timeline">
              {PIPELINE.map((step) => {
                const done = doneSteps.has(step);
                const current = deal.status === step;
                return (
                  <div
                    key={step}
                    className={`timeline-step${done && !current ? ' timeline-done' : ''}${
                      current ? ' timeline-current' : ''
                    }`}
                  >
                    <div className="timeline-dot" />
                    <div>
                      <div className="timeline-label">{STEP_LABELS[step]}</div>
                      {deal.events
                        .filter((e) => e.status === step)
                        .map((e, i) => (
                          <div key={i} className="timeline-time">
                            {new Date(e.at).toLocaleString()}
                            {e.note ? ` — ${e.note}` : ''}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="action-bar">
              {deal.status === 'PROPOSED' && isTraveler && (
                <>
                  <button
                    className="btn btn-primary"
                    disabled={busy}
                    onClick={() => act(() => api.acceptDeal(deal.id), 'Accept this deal')}
                  >
                    Accept deal
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={busy}
                    onClick={() => act(() => api.declineDeal(deal.id), 'Decline this deal')}
                  >
                    Decline
                  </button>
                </>
              )}
              {deal.status === 'ACCEPTED' && isShopper && !deal.payment && (
                <button className="btn btn-primary" disabled={busy} onClick={holdPayment}>
                  Pay {deal.currency} {deal.totalAmount.toLocaleString()} into escrow
                </button>
              )}
              {deal.status === 'ACCEPTED' && isTraveler && !deal.payment && (
                <p className="small">Waiting for the shopper to pay into escrow…</p>
              )}
              {deal.status === 'PURCHASED' && isTraveler && (
                <button
                  className="btn btn-primary"
                  disabled={busy}
                  onClick={() =>
                    act(() => api.advanceDeal(deal.id, 'IN_TRANSIT'), 'Mark as in transit')
                  }
                >
                  Mark in transit
                </button>
              )}
              {deal.status === 'IN_TRANSIT' && isTraveler && (
                <button
                  className="btn btn-primary"
                  disabled={busy}
                  onClick={() =>
                    act(() => api.advanceDeal(deal.id, 'DELIVERED'), 'Mark as delivered')
                  }
                >
                  Mark delivered
                </button>
              )}
              {deal.status === 'DELIVERED' && isShopper && (
                <button
                  className="btn btn-primary"
                  disabled={busy}
                  onClick={() =>
                    act(
                      () => api.confirmDeal(deal.id),
                      'Confirm delivery (releases escrow to traveler)',
                    )
                  }
                >
                  Confirm delivery — release payment
                </button>
              )}
              {CANCELLABLE.includes(deal.status) && (isTraveler || isShopper) && (
                <button
                  className="btn btn-danger"
                  disabled={busy}
                  onClick={() => act(() => api.cancelDeal(deal.id), 'Cancel this deal')}
                >
                  Cancel deal
                </button>
              )}
            </div>
          </div>

          <div className="status-card">
            <h3 style={{ marginTop: 0 }}>Deal terms</h3>
            <div className="kv">
              <div className="kv-row">
                <span className="kv-key">Product</span>
                <span className="kv-val">{deal.productRequest.productName}</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Route</span>
                <span className="kv-val">
                  {deal.trip.fromCity ?? deal.trip.fromCountry} →{' '}
                  {deal.trip.toCity ?? deal.trip.toCountry}
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Product price</span>
                <span className="kv-val">
                  {deal.currency} {deal.agreedProductPrice.toLocaleString()}
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Commission</span>
                <span className="kv-val">
                  {deal.currency} {deal.commissionAmount.toLocaleString()}
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Traveler</span>
                <span className="kv-val">
                  {deal.traveler.name}
                  {deal.traveler.travelerVerified && ' ✓'}
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Shopper</span>
                <span className="kv-val">{deal.shopper.name}</span>
              </div>
            </div>
          </div>

          {deal.status === 'CONFIRMED' && (isTraveler || isShopper) && (
            <div className="status-card">
              <h3 style={{ marginTop: 0 }}>Leave a review</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="label">Rating</label>
                  <select
                    className="select"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} star{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Comment</label>
                  <input
                    className="input"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How did it go?"
                  />
                </div>
              </div>
              <button
                className="btn btn-secondary"
                disabled={busy}
                onClick={submitReview}
              >
                Submit review
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="status-card">
            <h3 style={{ marginTop: 0 }}>Escrow payment</h3>
            {deal.payment ? (
              <div className="kv">
                <div className="kv-row">
                  <span className="kv-key">Amount</span>
                  <span className="kv-val">
                    {deal.payment.currency} {deal.payment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">Status</span>
                  <span className="kv-val">
                    <span className={`pill ${pillFor(deal.payment.status)}`}>
                      {deal.payment.status}
                    </span>
                  </span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">Reference</span>
                  <span className="kv-val small">{deal.payment.gatewayRef}</span>
                </div>
              </div>
            ) : (
              <p className="small">
                No payment yet. The shopper pays the total into platform
                hold after the traveler accepts — it's released only on
                delivery confirmation.
              </p>
            )}
          </div>

          <div className="status-card">
            <h3 style={{ marginTop: 0 }}>Customs declaration</h3>
            {customs ? (
              <div className="kv">
                <div className="kv-row">
                  <span className="kv-key">Items</span>
                  <span className="kv-val">{customs.itemsDescription}</span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">Declared value</span>
                  <span className="kv-val">
                    {customs.currency} {customs.declaredValue.toLocaleString()}
                  </span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">Est. duty</span>
                  <span className="kv-val">
                    {customs.currency} {customs.estimatedDuty.toLocaleString()}{' '}
                    <span className="small">(ESTIMATE)</span>
                  </span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">Confirmed</span>
                  <span className="kv-val">
                    {customs.travelerConfirmed ? 'Yes ✓' : 'Not yet'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="small">No declaration filed yet.</p>
            )}
            {!customs && isTraveler && CANCELLABLE.includes(deal.status) && (
              <div style={{ marginTop: 12 }}>
                <div className="form-group">
                  <label className="label">What are you carrying?</label>
                  <input
                    className="input"
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    placeholder="e.g. 1x Nike Air Jordan 1, US 10"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Declared value (INR)</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-secondary btn-block"
                  disabled={busy}
                  onClick={declareCustoms}
                >
                  File declaration + estimate duty
                </button>
              </div>
            )}
            {customs && isTraveler && !customs.travelerConfirmed && (
              <button
                className="btn btn-secondary btn-block"
                disabled={busy}
                onClick={confirmCustoms}
                style={{ marginTop: 12 }}
              >
                I confirm this declaration is truthful
              </button>
            )}
            <p className="form-hint">
              Duty is an ESTIMATE for planning only. Always declare
              truthfully and check official customs rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
