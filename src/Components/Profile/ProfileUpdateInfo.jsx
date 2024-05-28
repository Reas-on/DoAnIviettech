import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './Profile.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../Redux/Thunk/fetchUserInfo';
import { selectUserName } from '../../Redux/ShopSlice';

const ProfileUpdateInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);
  const [userInfo, setUserInfo] = useState(null);
  const [editedUserInfo, setEditedUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      province: '',
      district: '',
      ward: '',
    },
  });
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
            'auth-token': authToken,
          },
        });

        if (!response.ok) {
          navigate('/login');
          return;
        }

        const data = await response.json();
        console.log('Data from backend:', data);
        setUserInfo(data);
        setEditedUserInfo({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: {
            province: data.address?.province || '',
            district: data.address?.district || '',
            ward: data.address?.ward || '',
          },
        });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [name]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('auth-token');
      if (!authToken) {
        navigate('/login');
        return;
      }
  
      const response = await fetch(`http://localhost:4000/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
        body: JSON.stringify(editedUserInfo),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save changes');
      }
  
      const updatedUser = await response.json();
      message.success('Changes saved successfully');
      setUserInfo(updatedUser.user);
    } catch (error) {
      console.error('Error saving changes:', error);
      message.error('Failed to save changes');
    }
  };

  const handleMyInfoClick = () => {
    navigate('/profile');
  };

  return (
    
      <div className="profile-container">
      
      <div className="profile-divider"></div>
      <div className="profile-right">
        <h2>Update Information</h2>
        <form className="profile-update-form" onSubmit={handleSave}>
          <div className="profile-info-group">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedUserInfo.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-info-group">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedUserInfo.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-info-group">
            <label htmlFor="phone">Phone: </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={editedUserInfo.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-info-group">
            <label>Address:</label>
            <div className="profile-address-fields">
              <input
                type="text"
                name="province"
                placeholder="Province"
                value={editedUserInfo.address.province}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="district"
                placeholder="District"
                value={editedUserInfo.address.district}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="ward"
                placeholder="Ward"
                value={editedUserInfo.address.ward}
                onChange={handleAddressChange}
              />
            </div>
          </div>
          <button type="submit" className="profile-custom-btn">Save</button>
        </form>
        </div>
      </div>
   
  );
};

export default ProfileUpdateInfo;
