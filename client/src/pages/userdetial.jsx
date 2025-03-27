import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../Components/footer';
import axios from 'axios';

const UserProfiles = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); 

    useEffect(() => {
    
        axios
          .get(`${import.meta.env.VITE_API_BASE_URL}/getUser/${id}`)
          .then((response) => {
            setUser(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
            setError("Failed to fetch user profile");
            setLoading(false);
          });
      }, [id]);
    


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
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserProfiles;
