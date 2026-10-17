import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import type { Trip } from '../types';
import { TripCard } from '../components/MarketCards';

export function BrowseTrips() {
  const [params] = useSearchParams();
  const [from, setFrom] = useState(params.get('from') ?? '');
  const [to, setTo] = useState(params.get('to') ?? '');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (f: string, t: string) => {
    setLoading(true);
    setError('');
    try {
      setTrips(await api.searchTrips({ from: f, to: t }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="page-title">Traveler trips</h1>
      <p className="page-sub">
        People already flying — pick a route and propose your product.
      </p>
      <div className="search-bar">
        <input
          className="input"
          placeholder="From country"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          className="input"
          placeholder="To country"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => load(from, to)}>
          Search
        </button>
        <Link to="/trips/new" className="btn btn-secondary">
          + List your trip
        </Link>
      </div>
      {error && <div className="error-box">{error}</div>}
      {loading ? (
        <div className="loading">Loading trips…</div>
      ) : trips.length === 0 ? (
        <div className="empty">
          No trips found. <Link to="/trips/new" className="link">List yours</Link> and
          earn commission.
        </div>
      ) : (
        <div className="card-grid">
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      )}
    </div>
  );
}
