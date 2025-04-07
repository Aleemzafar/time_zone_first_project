import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/footer';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!token || !isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchUserProfile();
  }, [navigate]);


  const handleDelete = (id) => {
    axios.delete(`http://localhost:4001/deleteUser/` + id)
      .then((result) => {
        (result);
        setUser(result.data);
        window.location.reload();
      }).catch((error) => {
        (error);

      });
  };
  const fetchUserProfile = () => {
    const token = localStorage.getItem('token');
    ("Sending token:", token); // Add this for debugging

    axios
      .get(`http://localhost:4001/userprofile`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Ensure 'Bearer' is included
        },
      })
      .then((response) => {
        if (response.data) {
          setUser(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err.response?.data || err);
        setError('Failed to load profile');
        setLoading(false);
      });
  };


  if (loading) {
    return (
      <div>
        <div className="userprofile">
          <div className="loading"><div class="loader">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="userprofile">
          <div className="error">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <div className="userprofile">
          <div className="error">No user data found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div className="userprofile">
        <div className="profileheader">
          <h1>User Profile</h1>
        </div>
        <div className="profilemain">
          <div className="profileleft">
            <div className="profileimage">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="userprofileimg"
                />
              ) : (
                <div className="defaultprofile">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
            <div className="profilename">
              <h2>{user.username}</h2>
            </div>
          </div>
          <div className="profileright">
            <div className="profileinfo">
              <div className="infoitem">
                <label>Username:</label>
                <span>{user.username}</span>
              </div>
              <div className="infoitem">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="infoitem">
                <label>Age:</label>
                <span>{user.age}</span>
              </div>
              <div className="infoitem">
                <label>Role:</label>
                <span>{user.role}</span>
              </div>
            </div>
            <div className="profileactions">
              <Link to={`/updateUser/${user._id}`} ><button className="btn editbtn">Edit</button></Link>
              <button className="btn deletebtn" onClick={() => handleDelete(user._id)}>Delete</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
