import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from './cartcontext';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");
  const { cart } = useCart(); // Get the cart from the context

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/userprofile");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img
            src="https://preview.colorlib.com/theme/timezone/assets/img/logo/logo.png"
            alt="Logo"
          />
        </Link>
      </div>

      <div className="midnav">
        <ul className="mainmid">
          <li><Link className="link" to="/">Home</Link></li>
          <li><Link className="link" to="/shop">Shop</Link></li>
          <li><Link className="link" to="/about">About</Link></li>
          <li><Link className="link" to="/blog">Blog</Link></li>
          {role === "admin" && (
            <li><Link className="link" to="/dashboard">Dashboard</Link></li>
          )}
          <li><Link className="link" to="/contact">Contact</Link></li>
        </ul>
      </div>

      <div className="navright">
        <div onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon
            icon={faUser}
            style={{ padding: '0 10px' }}
          />
        </div>
        <Link className="link" to="/cart" style={{ position: 'relative' }}>
          <FontAwesomeIcon
            icon={faShoppingCart}
            style={{ padding: '0 10px' }}
          />
          {/* Cart Counter Badge */}
          {cart.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-10px',
                right: '0',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
              }}
            >
              {cart.length}
            </span>
          )}
        </Link>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="logoutBtn"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;