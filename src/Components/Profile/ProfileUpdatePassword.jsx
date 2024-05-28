import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { message } from 'antd';
import './Profile.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../Redux/Thunk/fetchUserInfo';
import { selectUserName } from '../../Redux/ShopSlice';
import './Profile.scss';

const ProfileUpdatePassword = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = useSelector(selectUserName);
  const [userInfo, setUserInfo] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      dispatch(fetchUserInfo(authToken));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('auth-token');
        if (!authToken) {
          navigate('/login');
          return;
        }
        
        const response = await fetch(`http://localhost:4000/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken
          }
        });

        if (!response.ok) {
          navigate('/login');
          return;
        }

        const data = await response.json();
        console.log('Data from backend:', data);
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  

  return (
    <div className="profile-container">
      
      <div className="profile-divider"></div>
      <div className="profile-right">
        <h2>Update Password</h2>
        <form>
          <div>
            <label htmlFor="current-password">Current Password:</label>
            <input type="password" id="current-password" />
          </div>
          <div>
            <label htmlFor="new-password">New Password:</label>
            <input type="password" id="new-password" />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" />
          </div>
          <button type="submit">Update Password</button>
        </form>
        </div>
      </div>
   
  );
};

export default ProfileUpdatePassword;
