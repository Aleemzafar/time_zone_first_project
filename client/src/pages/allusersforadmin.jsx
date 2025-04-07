import React, { useEffect, useState } from 'react';
import Footer from '../Components/footer';
import Sidebar from '../Components/sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Allusersforadmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = () => {
        axios.get(`http://localhost:4001/allusers`)
            .then((result) => {
                setUsers(result.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching users:", err.response || err.message);
                setError("Failed to fetch users");
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        if (window.confirm('Are you sure you want to delete this user?')) {
            axios.delete(`http://localhost:4001/deleteUser/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(() => {
                    ("User deleted successfully");
                    setUsers(users.filter(user => user._id !== id));
                })
                .catch(err => {
                    console.error("Error deleting user:", err.response || err.message);
                    alert("Failed to delete user");
                });
        }
    };

    if (loading) {
        return (
            <div>
                <Sidebar />
                <div className="allusersforaddmin">
                    <div class="loader">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Sidebar />
                <div className="allusersforaddmin">
                    <p>Error: {error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Sidebar />
            <div className="allusersforaddmin">
                <table className="table table-hover table-bordered border-success text-center align-middle">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Profile</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Action</th> {/* Removed password column */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.role}</td>
                                <td className='userimg' title={user.username}>
                                    {user.image ? (
                                        <img src={user.image} alt={user.username} />
                                    ) : (
                                        <img src="/images/profile.jpg" alt="default image" title="Default Image" />
                                    )}
                                </td>

                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.age}</td>
                                <td>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
}
