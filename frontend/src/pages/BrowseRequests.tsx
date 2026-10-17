import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { ProductRequest } from '../types';
import { CATEGORIES } from '../types';
import { RequestCard } from '../components/MarketCards';

export function BrowseRequests() {
  const [buyCountry, setBuyCountry] = useState('');
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setRequests(
        await api.searchRequests({
          buyCountry,
          category: category || undefined,
          q,
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="page-title">Product requests</h1>
      <p className="page-sub">
        What shoppers want carried — flying that way? Make a deal.
      </p>
      <div className="search-bar">
        <input
          className="input"
          placeholder="Buy country"
          value={buyCountry}
          onChange={(e) => setBuyCountry(e.target.value)}
        />
        <select
          className="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="input"
          placeholder="Product name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-primary" onClick={load}>
          Search
        </button>
        <Link to="/requests/new" className="btn btn-secondary">
          + New request
        </Link>
      </div>
      {error && <div className="error-box">{error}</div>}
      {loading ? (
        <div className="loading">Loading requests…</div>
      ) : requests.length === 0 ? (
        <div className="empty">
          No requests found. <Link to="/requests/new" className="link">Post yours</Link> and
          a traveler will carry it.
        </div>
      ) : (
        <div className="card-grid">
          {requests.map((r) => (
            <RequestCard key={r.id} req={r} />
          ))}
        </div>
      )}
    </div>
  );
}
