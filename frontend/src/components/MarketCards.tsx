import { Link } from 'react-router-dom';
import type { ProductRequest, Trip } from '../types';

/** Pill color for any status string. */
export function pillFor(status: string): string {
  switch (status) {
    case 'OPEN':
      return 'pill-open';
    case 'CONFIRMED':
    case 'COMPLETED':
    case 'RELEASED':
    case 'VERIFIED':
      return 'pill-teal';
    case 'CANCELLED':
    case 'REJECTED':
    case 'DISPUTED':
      return 'pill-red';
    case 'PROPOSED':
    case 'PENDING':
    case 'HELD':
      return 'pill-amber';
    case 'ACCEPTED':
    case 'MATCHED':
    case 'IN_TRANSIT':
      return 'pill-blue';
    case 'PURCHASED':
    case 'DELIVERED':
      return 'pill-indigo';
    default:
      return 'pill-gray';
  }
}

export function routeLabel(
  fromCity: string | null,
  fromCountry: string,
  toCity: string | null,
  toCountry: string,
): string {
  const from = fromCity ? `${fromCity}, ${fromCountry}` : fromCountry;
  const to = toCity ? `${toCity}, ${toCountry}` : toCountry;
  return `${from} → ${to}`;
}

export function TravelerLine({ traveler }: { traveler: Trip['traveler'] }) {
  const initial = (traveler.name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className="traveler-row">
      <span className="avatar" aria-hidden="true">
        {initial}
      </span>
      <p className="card-meta">
        <strong>{traveler.name}</strong>{' '}
        {traveler.travelerVerified && (
          <span className="badge-verified">✓ verified</span>
        )}{' '}
        {traveler.ratingCount > 0 && (
          <span className="rating">★ {traveler.ratingAvg.toFixed(1)}</span>
        )}
      </p>
    </div>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  const from = trip.fromCity ? `${trip.fromCity}, ${trip.fromCountry}` : trip.fromCountry;
  const to = trip.toCity ? `${trip.toCity}, ${trip.toCountry}` : trip.toCountry;
  return (
    <Link to={`/trips/${trip.id}`} className="card-link">
      <div className="card">
        <div className="card-row">
          <span className={`pill ${pillFor(trip.status)}`}>{trip.status}</span>
          {trip.commissionPct != null && (
            <span className="chip chip-accent">💰 {trip.commissionPct}% commission</span>
          )}
        </div>
        <div className="route">
          <span>{from}</span>
          <span className="route-plane" aria-hidden="true">
            ✈
          </span>
          <span>{to}</span>
        </div>
        <TravelerLine traveler={trip.traveler} />
        <div className="card-row">
          <span className="card-meta">🗓 {trip.departureDate}</span>
          {trip.availableKg != null && (
            <span className="chip">🎒 {trip.availableKg} kg space</span>
          )}
        </div>
        {trip.categories && (
          <p className="card-meta">Carries: {trip.categories}</p>
        )}
      </div>
    </Link>
  );
}

export function RequestCard({ req }: { req: ProductRequest }) {
  return (
    <Link to={`/requests/${req.id}`} className="card-link">
      <div className="card">
        <div className="card-row">
          <span className={`pill ${pillFor(req.status)}`}>{req.status}</span>
          <span className="pill pill-gray">{req.category}</span>
        </div>
        <h3 className="card-title">📦 {req.productName}</h3>
        <p className="card-meta">
          Buy in {req.buyCity ? `${req.buyCity}, ` : ''}
          {req.buyCountry} · deliver to {req.deliverCity ?? req.deliverCountry ?? '—'}
        </p>
        <div className="card-row">
          <span>
            <strong>
              {req.currency} {req.maxPrice.toLocaleString()}
            </strong>{' '}
            <span className="small">max × {req.quantity}</span>
          </span>
          <span className="card-meta">by {req.shopper.name}</span>
        </div>
      </div>
    </Link>
  );
}
