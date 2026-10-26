import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getError } from '../services/api';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const { confirm, ...payload } = form;
      await register(payload);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 mb-3">Create your account</h1>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full name</label>
                <input id="name" name="name" className="form-control" required value={form.name}
                  onChange={handleChange} autoComplete="name" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input id="email" name="email" type="email" className="form-control" required value={form.email}
                  onChange={handleChange} autoComplete="email" />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone (optional)</label>
                <input id="phone" name="phone" className="form-control" value={form.phone}
                  onChange={handleChange} autoComplete="tel" />
              </div>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input id="password" name="password" type="password" className="form-control" required
                    value={form.password} onChange={handleChange} autoComplete="new-password" />
                </div>
                <div className="col-sm-6 mb-3">
                  <label htmlFor="confirm" className="form-label">Confirm password</label>
                  <input id="confirm" name="confirm" type="password" className="form-control" required
                    value={form.confirm} onChange={handleChange} autoComplete="new-password" />
                </div>
              </div>
              <button className="btn btn-dark w-100" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
            <p className="text-muted small mt-3 mb-0">
              Already registered? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
