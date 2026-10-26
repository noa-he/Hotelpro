import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api, { getError } from '../services/api';
import useAvailability from '../hooks/useAvailability';

const today = () => new Date().toISOString().split('T')[0];
const fmt = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function BookingForm() {
  const { roomId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [form, setForm] = useState({
    checkIn: params.get('in') || '',
    checkOut: params.get('out') || '',
    guests: Number(params.get('guests')) || 1,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const availability = useAvailability(roomId, form.checkIn, form.checkOut);

  useEffect(() => {
    api.get(`/rooms/${roomId}`)
      .then((res) => setRoom(res.data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, [roomId]);

  const nights = form.checkIn && form.checkOut
    ? Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000)
    : 0;
  const total = room ? nights * room.pricePerNight : 0;
  const canBook = availability.status === 'available' && nights > 0 && !submitting;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (Number(form.guests) > room.capacity) return setError(`This room sleeps ${room.capacity} guests at most.`);

    setSubmitting(true);
    try {
      await api.post('/bookings', { room: roomId, ...form, guests: Number(form.guests) });
      navigate('/dashboard', { state: { message: 'Booking created. The hotel will confirm it shortly.' } });
    } catch (err) {
      setError(getError(err));
      availability.recheck(); // the server said no, so refresh what we show
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" role="status" /></div>;
  if (!room) return <div className="alert alert-danger">{error || 'Room not found.'} <Link to="/">Back to rooms</Link></div>;

  return (
    <div className="row g-4">
      <div className="col-md-7">
        <h1 className="h2">Book Room {room.roomNumber} <span className="badge text-bg-secondary text-capitalize fs-6">{room.type}</span></h1>
        <p>{room.description}</p>
        <p className="text-muted">Sleeps {room.capacity}</p>
        <div className="mb-4">
          {room.amenities.map((a) => <span key={a} className="badge rounded-pill text-bg-light border me-1">{a}</span>)}
        </div>

        <h2 className="h6">Already booked</h2>
        {availability.bookedRanges.length === 0 ? (
          <p className="text-muted small">No upcoming bookings. Every date is open.</p>
        ) : (
          <ul className="list-group list-group-flush small">
            {availability.bookedRanges.map((r, i) => (
              <li key={i} className="list-group-item px-0">{fmt(r.checkIn)} to {fmt(r.checkOut)}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="col-md-5">
        <form className="card shadow-sm" onSubmit={handleSubmit}>
          <div className="card-body p-4">
            <p className="fs-4 fw-semibold mb-3">₹{room.pricePerNight.toLocaleString()} <small className="text-muted fw-normal">/ night</small></p>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <div className="mb-3">
              <label htmlFor="checkIn" className="form-label">Check-in</label>
              <input id="checkIn" name="checkIn" type="date" min={today()} className="form-control" required
                value={form.checkIn} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="checkOut" className="form-label">Check-out</label>
              <input id="checkOut" name="checkOut" type="date" min={form.checkIn || today()} className="form-control" required
                value={form.checkOut} onChange={handleChange} />
            </div>

            {/* Live availability status */}
            <div aria-live="polite" className="mb-3">
              {availability.status === 'checking' && (
                <div className="alert alert-secondary py-2 mb-0"><span className="spinner-border spinner-border-sm me-2" />Checking availability…</div>
              )}
              {availability.status === 'available' && (
                <div className="alert alert-success py-2 mb-0">Available for these dates.</div>
              )}
              {availability.status === 'unavailable' && (
                <div className="alert alert-danger py-2 mb-0">
                  {availability.reason === 'maintenance'
                    ? 'This room is closed for maintenance.'
                    : <>Not available. Already booked: {availability.conflicts.map((c) => `${fmt(c.checkIn)} to ${fmt(c.checkOut)}`).join('; ')}.</>}
                </div>
              )}
              {availability.status === 'error' && (
                <div className="alert alert-warning py-2 mb-0">{availability.error}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="guests" className="form-label">Guests</label>
              <input id="guests" name="guests" type="number" min="1" max={room.capacity} className="form-control" required
                value={form.guests} onChange={handleChange} />
            </div>
            {nights > 0 && (
              <div className="alert alert-light border">
                {nights} night{nights > 1 ? 's' : ''} × ₹{room.pricePerNight.toLocaleString()} ={' '}
                <strong>₹{total.toLocaleString()}</strong>
              </div>
            )}
            <button className="btn btn-dark w-100" disabled={!canBook}>
              {submitting ? 'Booking…' : 'Confirm booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
