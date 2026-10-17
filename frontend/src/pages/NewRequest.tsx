import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { CATEGORIES } from '../types';

export function NewRequest() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [buyCountry, setBuyCountry] = useState('');
  const [buyCity, setBuyCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState('electronics');
  const [deliverCity, setDeliverCity] = useState('');
  const [deliverCountry, setDeliverCountry] = useState('India');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !buyCountry.trim() || !maxPrice) {
      setError('Product name, buy country and max price are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const req = await api.createRequest({
        productName: productName.trim(),
        description: description.trim() || undefined,
        buyCountry: buyCountry.trim(),
        buyCity: buyCity.trim() || undefined,
        maxPrice: Number(maxPrice),
        currency: currency.trim() || 'INR',
        quantity: Number(quantity) || 1,
        category,
        deliverCity: deliverCity.trim() || undefined,
        deliverCountry: deliverCountry.trim() || undefined,
      });
      navigate(`/requests/${req.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Request a product</h1>
      <p className="page-sub">
        What do you want carried, from where? A traveler flying that
        route can pick it up.
      </p>
      <form className="form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label className="label">Product name *</label>
          <input
            className="input"
            placeholder="iPhone 16 Pro 256GB"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="label">Details</label>
          <textarea
            className="textarea"
            placeholder="Color, size, model — anything the traveler needs to buy the right thing."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Buy country *</label>
            <input
              className="input"
              placeholder="USA"
              value={buyCountry}
              onChange={(e) => setBuyCountry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">Buy city</label>
            <input
              className="input"
              placeholder="New York"
              value={buyCity}
              onChange={(e) => setBuyCity(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Max product price *</label>
            <input
              className="input"
              type="number"
              min="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">Currency</label>
            <input
              className="input"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Quantity</label>
            <input
              className="input"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Deliver city</label>
            <input
              className="input"
              placeholder="Hyderabad"
              value={deliverCity}
              onChange={(e) => setDeliverCity(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">Deliver country</label>
            <input
              className="input"
              value={deliverCountry}
              onChange={(e) => setDeliverCountry(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post request'}
        </button>
      </form>
    </div>
  );
}
