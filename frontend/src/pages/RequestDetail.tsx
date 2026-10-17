import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import type { ProductRequest } from '../types';
import { pillFor } from '../components/MarketCards';

export function RequestDetail() {
  const { id } = useParams();
  const [req, setReq] = useState<ProductRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setReq(await api.getRequest(Number(id)));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load request');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="loading">Loading request…</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!req) return <div className="empty">Request not found.</div>;

  return (
    <div>
      <h1 className="page-title">{req.productName}</h1>
      <p className="page-sub">
        <span className={`pill ${pillFor(req.status)}`}>{req.status}</span>{' '}
        <span className="pill pill-gray">{req.category}</span>
      </p>

      <div className="two-col">
        <div className="status-card">
          <div className="kv">
            <div className="kv-row">
              <span className="kv-key">Buy in</span>
              <span className="kv-val">
                {req.buyCity ? `${req.buyCity}, ` : ''}
                {req.buyCountry}
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Deliver to</span>
              <span className="kv-val">
                {req.deliverCity ? `${req.deliverCity}, ` : ''}
                {req.deliverCountry ?? '—'}
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Max price</span>
              <span className="kv-val">
                {req.currency} {req.maxPrice.toLocaleString()} × {req.quantity}
              </span>
            </div>
            {req.description && (
              <div className="kv-row">
                <span className="kv-key">Details</span>
                <span className="kv-val">{req.description}</span>
              </div>
            )}
          </div>
          <div className="action-bar">
            <Link
              to={`/trips?to=${encodeURIComponent(req.buyCountry)}`}
              className="btn btn-primary"
            >
              Find travelers going there
            </Link>
          </div>
        </div>

        <div className="status-card">
          <h3 style={{ marginTop: 0 }}>Shopper</h3>
          <p className="card-meta">
            <strong>{req.shopper.name}</strong>
          </p>
          {req.shopper.ratingCount > 0 && (
            <p className="card-meta">
              <span className="rating">★ {req.shopper.ratingAvg.toFixed(1)}</span>{' '}
              ({req.shopper.ratingCount} reviews)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
