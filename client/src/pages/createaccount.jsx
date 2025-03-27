import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("age", age);
    formData.append("password", password);
    if (image) {
      formData.append("image", image);
    }

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/createuser`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error creating account:", error.response ? error.response.data : error.message);
      });
  };

  return (
    <div>
      <div className="header">
        <h1>Create An Account</h1>
      </div>
      <div className="loginmain">
        {/* Left Section */}
        <div className="loginleft">
          <div className="loginleft1">
            <h1>Already have an account?</h1>
            <p>Sign in to access your account.</p>
          </div>
          <div className="loginleft2">
            <Link to="/login">
              <button className="createbutton">Login</button>
            </Link>
          </div>
        </div>
        {/* Right Section */}
        <div className="loginright">
          <div className="loginright1">
            <h1>Welcome! Please Create an Account</h1>
          </div>
          <div className="loginright2">
            <form onSubmit={handleCreateAccount}>
              <div className="loginform">
                <input
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                  id="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  id="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter Age"
                  name="age"
                  id="age"
                  required
                  onChange={(e) => setAge(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  id="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button type="submit" className="loginbutton">SIGN UP</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}