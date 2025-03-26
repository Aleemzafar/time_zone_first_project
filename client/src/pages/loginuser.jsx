import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/footer';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`/api/login`, formData);
      
      if (response.data) {
        // Store user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", response.data.user.username);

        // Navigate based on role
        if (response.data.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/userprofile');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Login</h1>
      </div>
      <div className="loginmain">
        <div className="loginleft">
          <div className="loginleft1">
            <h1>New to our Shop?</h1>
            <p>Stay ahead by creating an account with us!</p>
          </div>
          <div className="loginleft2">
            <Link to="/createaccount">
              <button className="createbutton">CREATE AN ACCOUNT</button>
            </Link>
          </div>
        </div>
        <div className="loginright">
          <div className="loginright1">
            <h1>Welcome Back! Please Sign in now</h1>
          </div>
          <div className="loginright2">
            <form onSubmit={handleSubmit}>
              <div className="loginform">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="rememberlogin">
                  <input type="checkbox" id="checkboxlogin" />
                  <label htmlFor="checkboxlogin">Remember me</label>
                </div>
              </div>
              {error && (
                <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                  {error}
                </div>
              )}
              <div className="loginbuttonbox">
                <button type="submit" className="loginbutton">LOG IN</button>
                <Link to="/forgot-password" className="forgotpasswordlink">
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
