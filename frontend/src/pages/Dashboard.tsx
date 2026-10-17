import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth/AuthContext';
import type { Deal, ProductRequest, Trip } from '../types';
import { pillFor, routeLabel } from '../components/MarketCards';

type Tab = 'deals' | 'trips' | 'requests';

export function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('deals');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [d, t, r] = await Promise.all([
          api.myDeals(),
          api.myTrips(),
          api.myRequests(),
        ]);
        setDeals(d);
        setTrips(t);
        setRequests(r);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;

  return (
    <div>
      <h1 className="page-title">Hi, {user?.name.split(' ')[0]} 👋</h1>
      <p className="page-sub">Your trips, requests and deals in one place.</p>
      {error && <div className="error-box">{error}</div>}

      <div className="tabs">
        {(['deals', 'trips', 'requests'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`tab${tab === t ? ' tab-active' : ''}`}
            onClick={() => setTab(t)}
          >
            My {t} (
            {t === 'deals' ? deals.length : t === 'trips' ? trips.length : requests.length})
          </button>
        ))}
      </div>

      {tab === 'deals' && (
        <div>
          {deals.length === 0 ? (
            <div className="empty">
              No deals yet. <Link to="/trips" className="link">Browse trips</Link> or{' '}
              <Link to="/requests" className="link">browse requests</Link>.
            </div>
          ) : (
            <div className="card-grid">
              {deals.map((d) => (
                <Link key={d.id} to={`/deals/${d.id}`} className="card-link">
                  <div className="card">
                    <div className="card-row">
                      <h3 className="card-title">Deal #{d.id}</h3>
                      <span className={`pill ${pillFor(d.status)}`}>
                        {d.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="card-meta">{d.productRequest.productName}</p>
                    <p className="card-meta">
                      {routeLabel(
                        d.trip.fromCity,
                        d.trip.fromCountry,
                        d.trip.toCity,
                        d.trip.toCountry,
                      )}
                    </p>
                    <div className="card-row">
                      <span>
                        {d.currency} {d.totalAmount.toLocaleString()}
                      </span>
                      <span className="small">
                        {d.traveler.id === user?.id ? 'You carry' : 'You shop'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'trips' && (
        <div>
          <div className="action-bar" style={{ marginBottom: 16 }}>
            <Link to="/trips/new" className="btn btn-primary btn-small">
              + List a trip
            </Link>
          </div>
          {trips.length === 0 ? (
            <div className="empty">No trips listed yet.</div>
          ) : (
            <div className="card-grid">
              {trips.map((t) => (
                <Link key={t.id} to={`/trips/${t.id}`} className="card-link">
                  <div className="card">
                    <div className="card-row">
                      <h3 className="card-title">
                        {routeLabel(t.fromCity, t.fromCountry, t.toCity, t.toCountry)}
                      </h3>
                      <span className={`pill ${pillFor(t.status)}`}>{t.status}</span>
                    </div>
                    <p className="card-meta">Departs {t.departureDate}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'requests' && (
        <div>
          <div className="action-bar" style={{ marginBottom: 16 }}>
            <Link to="/requests/new" className="btn btn-primary btn-small">
              + New request
            </Link>
          </div>
          {requests.length === 0 ? (
            <div className="empty">No requests posted yet.</div>
          ) : (
            <div className="card-grid">
              {requests.map((r) => (
                <Link key={r.id} to={`/requests/${r.id}`} className="card-link">
                  <div className="card">
                    <div className="card-row">
                      <h3 className="card-title">{r.productName}</h3>
                      <span className={`pill ${pillFor(r.status)}`}>{r.status}</span>
                    </div>
                    <p className="card-meta">
                      Buy in {r.buyCountry} · {r.currency}{' '}
                      {r.maxPrice.toLocaleString()} max
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
