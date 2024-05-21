import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './Profile.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../Redux/Thunk/fetchUserInfo';
import { selectUserName } from '../../Redux/ShopSlice';


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);
  const [userInfo, setUserInfo] = useState(null);
  const [editedUserInfo, setEditedUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
        console.log('Data from backend:', data)
        setUserInfo(data);
        setEditedUserInfo({ ...data, password: '' });
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = async () => {
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
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      message.error('Failed to save changes');
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`profile-container ${isEditing ? 'edit-mode' : ''}`}>
      <h2>User Profile</h2>
      <div className="profile-info">
      {isEditing ? (
  <>
    <input 
      type="text" 
      value={editedUserInfo.name} 
      onChange={(e) => setEditedUserInfo({ ...editedUserInfo, name: e.target.value })} 
    />
    <input 
      type="email" 
      value={editedUserInfo.email} 
      onChange={(e) => setEditedUserInfo({ ...editedUserInfo, email: e.target.value })} 
    />
    <input 
      type="text" 
      value={editedUserInfo.address.province} 
      onChange={(e) => setEditedUserInfo({ ...editedUserInfo, address: { ...editedUserInfo.address, province: e.target.value } })} 
      placeholder="Province" 
    />
    <input 
      type="text" 
      value={editedUserInfo.address.district} 
      onChange={(e) => setEditedUserInfo({ ...editedUserInfo, address: { ...editedUserInfo.address, district: e.target.value } })} 
      placeholder="District" 
    />
    <input 
      type="text" 
      value={editedUserInfo.address.ward} 
      onChange={(e) => setEditedUserInfo({ ...editedUserInfo, address: { ...editedUserInfo.address, ward: e.target.value } })} 
      placeholder="Ward" 
    />
    <input 
      type="text" 
      value={editedUserInfo.phone} 
      onChange={(e) => setEditedUserInfo({ ...editedUserInfo, phone: e.target.value })} 
    />
  </>
) : (
          <>
            <p><strong>ID:</strong> {userInfo?._id}</p>
            <p><strong>Name:</strong> {userName}</p>
            <p><strong>Email:</strong> {userInfo?.email}</p>
            <p><strong>Address:</strong> {userInfo?.address}</p>
            <p><strong>Phone:</strong> {userInfo?.phone}</p>
          </>
        )}
      </div>
      <div className="profile-buttons">
        <Link to="/cart">
          <button className="cart-button">My Cart</button>
        </Link>
        {!isEditing && <button className="edit-button" onClick={handleEdit}>Edit</button>}
        {isEditing && <button className="save-button" onClick={handleSave}>Save</button>}
      </div>
    </div>
  );
};

export default Profile;
