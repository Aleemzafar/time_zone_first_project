import React, { useState, useEffect } from "react";
import Footer from "../Components/footer";
import Sidebar from "../Components/sidebar";
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!token || !isLoggedIn) {
      navigate("/login");
      return;
    }

    if (role !== "admin") {
      navigate("/");
      return;
    }

    fetchUsers();
    countorders();
    countitem();
  }, [navigate]);

  const countorders = () => {
    axios.get(`http://localhost:4001/countorder`)
      .then((response) => {
        setOrders(response.data.count);
        setLoading(false);
      }).catch((err) => {
        setError("Something went wrong with orders counting ");
        setLoading(false);
      });
  }

  const countitem = () => {
    axios.get(`http://localhost:4001/countitem`)
      .then((response) => {
        setItems(response.data.count);
        setLoading(false);
      }).catch((err) => {
        setError("Something went wrong with items counting ");
        setLoading(false);
      });
  }

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:4001/allusers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
        setLoading(false);
      });
  };

  const handleDeleteUser = (userId) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete('http://localhost:4001/deleteUser/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          fetchUsers(); // Refresh user list after deletion
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          alert("Failed to delete user");
        });
    }
  };

  if (loading) {
    return (
      <div>
        <div className="dashboard">
          <Sidebar />
          <div className="dashdata">
            <h2>Loading...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="dashboard">
          <Sidebar />
          <div className="dashdata">
            <h2>Error: {error}</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard">
        <Sidebar />
        <div className="dashdata">
          <h1>Welcome Admin!</h1>
          <ul>
            <li className="ball1">All users ({users.length})</li>
            <li className="ball2">All products({items})</li>
            <li className="ball3">All orders({orders})</li>
          </ul>

          <h3>User List</h3>
          {users.length > 0 ? (
            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td>{user.role}</td>
                    <td>
                      <Link to={`/userdetail/${user._id}`}>
                        <button
                          className="btn btn-danger"
                        >
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
