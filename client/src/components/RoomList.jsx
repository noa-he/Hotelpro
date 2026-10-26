import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getError } from '../services/api';
import socket from '../services/socket';

const today = () => new Date().toISOString().split('T')[0];
const TYPES = ['single', 'double', 'deluxe', 'suite'];

export default function RoomList() {
  const [filters, setFilters] = useState({ checkIn: '', checkOut: '', guests: '', type: '', maxPrice: '' });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = async (e, silent = false) => {
    if (e) e.preventDefault();
    setError('');
    if ((filters.checkIn && !filters.checkOut) || (!filters.checkIn && filters.checkOut)) {
      return setError('Choose both a check-in and a check-out date, or leave both empty.');
    }
    if (filters.checkIn && filters.checkOut <= filters.checkIn) {
      return setError('Check-out must be after check-in.');
    }
    if (!silent) setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get('/rooms', { params });
      setRooms(data.rooms);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(); }, []); // load all rooms on first visit

  // Live update: when any room is booked or cancelled, quietly refresh the list
  const searchRef = useRef(search);
  searchRef.current = search;
  useEffect(() => {
    const refresh = () => searchRef.current(null, true);
    socket.on('rooms:changed', refresh);
    return () => socket.off('rooms:changed', refresh);
  }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const bookingLink = (room) => {
    const q = new URLSearchParams();
    if (filters.checkIn && filters.checkOut) {
      q.set('in', filters.checkIn);
      q.set('out', filters.checkOut);
    }
    q.set('guests', filters.guests || 1);
    return `/book/${room._id}?${q.toString()}`;
  };

  return (
    <>
      <h1 className="h2 mb-3">Find your room</h1>

      <form className="card card-body shadow-sm mb-4" onSubmit={search}>
        <div className="row g-3 align-items-end">
          <div className="col-6 col-md-2">
            <label htmlFor="checkIn" className="form-label">Check-in</label>
            <input id="checkIn" name="checkIn" type="date" min={today()} className="form-control"
              value={filters.checkIn} onChange={handleChange} />
          </div>
          <div className="col-6 col-md-2">
            <label htmlFor="checkOut" className="form-label">Check-out</label>
            <input id="checkOut" name="checkOut" type="date" min={filters.checkIn || today()} className="form-control"
              value={filters.checkOut} onChange={handleChange} />
          </div>
          <div className="col-4 col-md-2">
            <label htmlFor="guests" className="form-label">Guests</label>
            <input id="guests" name="guests" type="number" min="1" className="form-control"
              value={filters.guests} onChange={handleChange} />
          </div>
          <div className="col-8 col-md-2">
            <label htmlFor="type" className="form-label">Room type</label>
            <select id="type" name="type" className="form-select" value={filters.type} onChange={handleChange}>
              <option value="">Any</option>
              {TYPES.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <label htmlFor="maxPrice" className="form-label">Max price</label>
            <input id="maxPrice" name="maxPrice" type="number" min="0" className="form-control"
              value={filters.maxPrice} onChange={handleChange} />
          </div>
          <div className="col-6 col-md-2">
            <button className="btn btn-dark w-100">Search rooms</button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" role="status" /><p className="mt-2">Loading rooms…</p></div>
      ) : rooms.length === 0 ? (
        <div className="alert alert-secondary">No rooms match those dates and filters. Try different dates or a higher price limit.</div>
      ) : (
        <div className="row g-3">
          {rooms.map((room) => (
            <div className="col-sm-6 col-lg-4" key={room._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start">
                    <h2 className="h5 mb-0">Room {room.roomNumber}</h2>
                    <span className="badge text-bg-secondary text-capitalize">{room.type}</span>
                  </div>
                  <p className="text-muted small mt-2 mb-2">Sleeps {room.capacity}</p>
                  <div className="mb-3">
                    {room.amenities.slice(0, 4).map((a) => (
                      <span key={a} className="badge rounded-pill text-bg-light border me-1">{a}</span>
                    ))}
                  </div>
                  <p className="mt-auto fs-5 fw-semibold mb-2">
                    ₹{room.pricePerNight.toLocaleString()} <small className="text-muted fw-normal">/ night</small>
                  </p>
                  <Link to={bookingLink(room)} className="btn btn-outline-dark">Book this room</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
