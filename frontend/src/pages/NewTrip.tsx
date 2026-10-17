import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export function NewTrip() {
  const navigate = useNavigate();
  const [fromCountry, setFromCountry] = useState('India');
  const [fromCity, setFromCity] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [availableKg, setAvailableKg] = useState('');
  const [categories, setCategories] = useState('electronics,fashion');
  const [commissionPct, setCommissionPct] = useState('10');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCountry.trim() || !toCountry.trim() || !departureDate) {
      setError('Origin country, destination country and departure date are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const trip = await api.createTrip({
        fromCountry: fromCountry.trim(),
        fromCity: fromCity.trim() || undefined,
        toCountry: toCountry.trim(),
        toCity: toCity.trim() || undefined,
        departureDate,
        arrivalDate: arrivalDate || undefined,
        availableKg: availableKg ? Number(availableKg) : undefined,
        categories: categories.trim() || undefined,
        commissionPct: commissionPct ? Number(commissionPct) : undefined,
      });
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">List your trip</h1>
      <p className="page-sub">
        Tell shoppers where you're flying — earn commission carrying
        what they want.
      </p>
      <form className="form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-row">
          <div className="form-group">
            <label className="label">From country *</label>
            <input
              className="input"
              value={fromCountry}
              onChange={(e) => setFromCountry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">From city</label>
            <input
              className="input"
              placeholder="Hyderabad"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">To country *</label>
            <input
              className="input"
              placeholder="USA"
              value={toCountry}
              onChange={(e) => setToCountry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">To city</label>
            <input
              className="input"
              placeholder="New York"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Departure date *</label>
            <input
              className="input"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">Return date</label>
            <input
              className="input"
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Spare luggage (kg)</label>
            <input
              className="input"
              type="number"
              min="0"
              step="0.5"
              value={availableKg}
              onChange={(e) => setAvailableKg(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">Commission %</label>
            <input
              className="input"
              type="number"
              min="0"
              step="0.5"
              value={commissionPct}
              onChange={(e) => setCommissionPct(e.target.value)}
            />
            <p className="form-hint">Your cut of each deal's product price.</p>
          </div>
        </div>
        <div className="form-group">
          <label className="label">Categories you'll carry</label>
          <input
            className="input"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          />
          <p className="form-hint">
            Comma-separated: electronics, fashion, perfume, other.
          </p>
        </div>
        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Listing…' : 'List trip'}
        </button>
      </form>
    </div>
  );
}
