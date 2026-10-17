import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);
  const goLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">✈</span>
          <span className="brand-name">CarryMate</span>
        </Link>
        <button
          className="hamburger"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
        <div className={`nav-links${open ? ' nav-open' : ''}`}>
          <NavLink to="/trips" className="nav-link" onClick={close}>
            Trips
          </NavLink>
          <NavLink to="/requests" className="nav-link" onClick={close}>
            Requests
          </NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className="nav-link" onClick={close}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className="nav-link" onClick={close}>
                {user.name.split(' ')[0]}
              </NavLink>
              <button className="btn btn-small" onClick={goLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={close}>
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="btn btn-primary btn-small"
                onClick={close}
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
