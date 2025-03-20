import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/footer";
import Sidebar from "../Components/sidebar";

export default function AdminProfile() {
  const [admin, setAdmin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    fetchAdminProfile();
  }, [navigate]);


  const fetchAdminProfile = () => {
    const token = localStorage.getItem('token');
    ("Token from localStorage:", token); // Debugging log

    if (!token) {
      setError('No token found');
      setLoading(false);
      navigate('/login'); // Redirect to login if no token is found
      return;
    }

    axios
      .get('http://localhost:4001/userprofile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setAdmin(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err.response?.data || err);
        setError('Failed to load profile');
        setLoading(false);
        if (err.response?.status === 403) {
          navigate('/login'); // Redirect to login if token is invalid
        }
      });
  };


  if (loading) {
    return (
      <div>
        <div className="loader">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="profileadmin">
        <div className="profiles">
          <div className="profileimg">
            <img src={admin.image || "/images/profile.jpg"} alt={admin.username} title={admin.username} />
          </div>
          <Link to={`/updateUser/${admin._id}`}>
            <button className="btn btn-success">Edit Profile</button>
          </Link>
          <h1>{admin.username || "Admin Username"}</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
}
