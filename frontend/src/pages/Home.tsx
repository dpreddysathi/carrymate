import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { ProductRequest, Trip } from '../types';
import { RequestCard, TripCard } from '../components/MarketCards';

type Tab = 'trips' | 'requests';

export function Home() {
  const [tab, setTab] = useState<Tab>('trips');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [buyCountry, setBuyCountry] = useState('');
  const [q, setQ] = useState('');
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [requests, setRequests] = useState<ProductRequest[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      setTrips(await api.searchTrips({ from, to }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const searchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      setRequests(await api.searchRequests({ buyCountry, q }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">Shop the world, carried by travelers</h1>
        <p className="hero-sub">
          Someone is already flying where you want to buy. List your trip
          and earn commission, or get that iPhone, those sneakers, that
          perfume — delivered by a verified traveler.
        </p>
        <div className="hero-actions">
          <Link to="/trips/new" className="btn btn-primary">
            List your trip
          </Link>
          <Link to="/requests/new" className="btn btn-secondary">
            Request a product
          </Link>
        </div>
      </section>

      <section className="steps">
        <div className="step">
          <div className="step-num">1</div>
          <h3 className="step-title">Match</h3>
          <p className="step-text">
            Shoppers post what they want; travelers list where they're
            going. Make a deal on price + commission.
          </p>
        </div>
        <div className="step">
          <div className="step-num">2</div>
          <h3 className="step-title">Pay safely</h3>
          <p className="step-text">
            Money is held in escrow — the traveler only gets paid after
            you confirm delivery.
          </p>
        </div>
        <div className="step">
          <div className="step-num">3</div>
          <h3 className="step-title">Fly &amp; deliver</h3>
          <p className="step-text">
            The traveler buys abroad, declares at customs (we estimate
            the duty), and hands it over at home.
          </p>
        </div>
      </section>

      <div className="tabs">
        <button
          className={`tab${tab === 'trips' ? ' tab-active' : ''}`}
          onClick={() => setTab('trips')}
        >
          Browse trips
        </button>
        <button
          className={`tab${tab === 'requests' ? ' tab-active' : ''}`}
          onClick={() => setTab('requests')}
        >
          Browse requests
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {tab === 'trips' && (
        <div>
          <div className="search-bar">
            <input
              className="input"
              placeholder="From country (e.g. India)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              className="input"
              placeholder="To country (e.g. USA)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <button className="btn btn-primary" onClick={searchTrips} disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>
          {trips === null ? (
            <div className="empty">
              Search for travelers flying your route — or{' '}
              <Link to="/trips" className="link">browse all trips</Link>.
            </div>
          ) : trips.length === 0 ? (
            <div className="empty">No trips match. Try different countries.</div>
          ) : (
            <div className="card-grid">
              {trips.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'requests' && (
        <div>
          <div className="search-bar">
            <input
              className="input"
              placeholder="Buy country (e.g. USA)"
              value={buyCountry}
              onChange={(e) => setBuyCountry(e.target.value)}
            />
            <input
              className="input"
              placeholder="Product (e.g. sneakers)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn btn-primary" onClick={searchRequests} disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>
          {requests === null ? (
            <div className="empty">
              Search what shoppers are asking for — or{' '}
              <Link to="/requests" className="link">browse all requests</Link>.
            </div>
          ) : requests.length === 0 ? (
            <div className="empty">No requests match. Try different terms.</div>
          ) : (
            <div className="card-grid">
              {requests.map((r) => (
                <RequestCard key={r.id} req={r} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
