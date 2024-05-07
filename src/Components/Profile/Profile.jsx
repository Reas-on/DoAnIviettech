import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.scss';

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await fetch(`http://localhost:4000/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        });

        if (!response.ok) {
          navigate('/login');
          return;
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>ID:</strong> {userInfo._id}</p>
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Password:</strong> {userInfo.password}</p>
        <p><strong>Address:</strong> {userInfo.address}</p>
        <p><strong>Phone:</strong> {userInfo.phone}</p>
      </div>
      <div className="profile-buttons">
        <Link to="/cart">
          <button className="cart-button">My Cart</button>
        </Link>
        <button className="edit-button">Edit</button>
        <button className="save-button">Save</button>
      </div>
    </div>
  );
};

export default Profile;