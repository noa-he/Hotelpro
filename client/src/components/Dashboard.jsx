import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api, { getError } from '../services/api';

const STATUS_COLOR = {
  pending: 'warning', confirmed: 'primary', 'checked-in': 'success', 'checked-out': 'secondary', cancelled: 'danger',
};
const fmt = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const isStaff = user.role !== 'guest';

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');

  const load = async () => {
    try {
      const { data } = await api.get(isStaff ? '/bookings' : '/bookings/my');
      setBookings(data);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  // Runs an API call, then refreshes the list
  const run = async (request, successText) => {
    setError(''); setMessage('');
    try {
      await request();
      setMessage(successText);
      await load();
    } catch (err) {
      setError(getError(err));
    }
  };

  const cancel = (id) => window.confirm('Cancel this booking?') &&
    run(() => api.put(`/bookings/${id}`, { status: 'cancelled' }), 'Booking cancelled.');
  const confirmBooking = (id) => run(() => api.put(`/bookings/${id}`, { status: 'confirmed' }), 'Booking confirmed.');
  const checkIn = (id) => run(() => api.put(`/bookings/${id}/checkin`), 'Guest checked in.');
  const checkOut = (id) => run(() => api.put(`/bookings/${id}/checkout`), 'Guest checked out.');

  const visible = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
  const count = (s) => bookings.filter((b) => b.status === s).length;
  const revenue = bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <>
      <h1 className="h2 mb-3">{isStaff ? 'Hotel dashboard' : 'My bookings'}</h1>

      {message && <div className="alert alert-success" role="status">{message}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {isStaff && (
        <div className="row g-3 mb-4">
          {[
            ['Pending', count('pending')],
            ['Confirmed', count('confirmed')],
            ['Checked in', count('checked-in')],
            ['Booked value', `₹${revenue.toLocaleString()}`],
          ].map(([label, value]) => (
            <div className="col-6 col-md-3" key={label}>
              <div className="card shadow-sm"><div className="card-body">
                <div className="fs-3 fw-semibold">{value}</div>
                <div className="text-muted small">{label}</div>
              </div></div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-3 d-flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'].map((s) => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s.replace('-', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" role="status" /></div>
      ) : visible.length === 0 ? (
        <div className="alert alert-secondary">No bookings to show here yet.</div>
      ) : (
        <div className="table-responsive card shadow-sm">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                {isStaff && <th>Guest</th>}
                <th>Room</th><th>Dates</th><th>Guests</th><th>Total</th><th>Status</th><th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b._id}>
                  {isStaff && <td>{b.user?.name}<div className="small text-muted">{b.user?.email}</div></td>}
                  <td>{b.room ? <>#{b.room.roomNumber} <span className="text-capitalize text-muted">{b.room.type}</span></> : 'Removed'}</td>
                  <td>{fmt(b.checkIn)} to {fmt(b.checkOut)}</td>
                  <td>{b.guests}</td>
                  <td>₹{b.totalPrice.toLocaleString()}</td>
                  <td><span className={`badge text-bg-${STATUS_COLOR[b.status]}`}>{b.status}</span></td>
                  <td className="text-end text-nowrap">
                    {isStaff && b.status === 'pending' && <button className="btn btn-sm btn-primary me-1" onClick={() => confirmBooking(b._id)}>Confirm</button>}
                    {isStaff && b.status === 'confirmed' && <button className="btn btn-sm btn-success me-1" onClick={() => checkIn(b._id)}>Check in</button>}
                    {isStaff && b.status === 'checked-in' && <button className="btn btn-sm btn-secondary me-1" onClick={() => checkOut(b._id)}>Check out</button>}
                    {['pending', 'confirmed'].includes(b.status) && <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(b._id)}>Cancel</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
