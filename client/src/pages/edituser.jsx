import React, { useEffect, useState } from 'react';
import Footer from '../Components/footer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditUser() {
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:4001/getUser/${id}`)
      .then((result) => {
        setUsername(result.data.username);
        setEmail(result.data.email);
        setAge(result.data.age);
        setPassword(result.data.password);
        setImage(result.data.image);
      })
      .catch((err) => {
        console.error('Error fetching user:', err.response?.data || err);
      });
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Save the selected file to state
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('age', age);
    formData.append('password', password);
    formData.append('username', username);
    if (image) {
      formData.append('image', image);
    }

    axios
      .put(`http://localhost:4001/updateUser/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((result) => {
        ('User updated successfully:', result.data);
        navigate('/userprofile');
      })
      .catch((err) => {
        console.error('Error updating user:', err.response?.data || err);
      });
  };

  return (
    <div>
      <div className="header">
        <h1>Edit User</h1>
      </div>
      <div className="loginright">
        <form onSubmit={handleUpdate}>
          <div className="loginform">
            <input
              type="text"
              placeholder="Enter Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter your age"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              <input type="file" onChange={handleImageChange} />
            </div>
          </div>
          <div className="loginbuttonbox">
            <button type="submit" className="loginbutton">Confirm Changes</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}