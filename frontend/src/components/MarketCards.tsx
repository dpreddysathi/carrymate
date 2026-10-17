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
      return 'pill-green';
    case 'CANCELLED':
    case 'REJECTED':
    case 'DISPUTED':
      return 'pill-red';
    case 'PROPOSED':
    case 'ACCEPTED':
    case 'PURCHASED':
    case 'HELD':
    case 'PENDING':
      return 'pill-amber';
    case 'MATCHED':
    case 'IN_TRANSIT':
    case 'DELIVERED':
      return 'pill-blue';
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
  return (
    <p className="card-meta">
      by <strong>{traveler.name}</strong>{' '}
      {traveler.travelerVerified && (
        <span className="badge-verified">✓ verified</span>
      )}{' '}
      {traveler.ratingCount > 0 && (
        <span className="rating">★ {traveler.ratingAvg.toFixed(1)}</span>
      )}
    </p>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link to={`/trips/${trip.id}`} className="card-link">
      <div className="card">
        <div className="card-row">
          <h3 className="card-title">
            {routeLabel(trip.fromCity, trip.fromCountry, trip.toCity, trip.toCountry)}
          </h3>
          <span className={`pill ${pillFor(trip.status)}`}>{trip.status}</span>
        </div>
        <TravelerLine traveler={trip.traveler} />
        <p className="card-meta">
          Departs {trip.departureDate}
          {trip.availableKg != null && ` · ${trip.availableKg} kg space`}
          {trip.commissionPct != null && ` · ${trip.commissionPct}% commission`}
        </p>
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
          <h3 className="card-title">{req.productName}</h3>
          <span className={`pill ${pillFor(req.status)}`}>{req.status}</span>
        </div>
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
          <span className="pill pill-gray">{req.category}</span>
        </div>
        <p className="card-meta">by {req.shopper.name}</p>
      </div>
    </Link>
  );
}
