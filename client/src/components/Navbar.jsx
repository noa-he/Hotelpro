import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const signOut = () => { logout(); close(); navigate('/login'); };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/" onClick={close}>HotelPro</Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-md-center">
            <li className="nav-item"><NavLink className="nav-link" to="/" end onClick={close}>Rooms</NavLink></li>
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard" onClick={close}>
                  {user.role === 'guest' ? 'My bookings' : 'Dashboard'}
                </NavLink>
              </li>
            )}
            {user ? (
              <li className="nav-item ms-md-3">
                <button className="btn btn-outline-light btn-sm" onClick={signOut}>
                  Sign out ({user.name.split(' ')[0]})
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login" onClick={close}>Sign in</NavLink></li>
                <li className="nav-item ms-md-2">
                  <Link className="btn btn-warning btn-sm" to="/register" onClick={close}>Create account</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
