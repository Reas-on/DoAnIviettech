import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { message } from 'antd';
import './Profile.css';

const Profile = () => {
  // const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [editedUserInfo, setEditedUserInfo] = useState(null);

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
        setEditedUserInfo({ ...data });
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleEdit = () => {
    setEditedUserInfo({ ...userInfo });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:4000/users/${userInfo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(editedUserInfo) 
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      message.success('Changes saved successfully');
      setUserInfo(editedUserInfo);
    } catch (error) {
      console.error('Error saving changes:', error);
      message.error('Failed to save changes');
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }
  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     try {
  //       const token = localStorage.getItem('auth-token');
  //       if (!token) {
  //         navigate('/login');
  //         return;
  //       }
        
  //       const response = await fetch(`http://localhost:4000/profile`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'auth-token': token
  //         }
  //       });

  //       if (!response.ok) {
  //         navigate('/login');
  //         return;
  //       }

  //       const data = await response.json();
  //       setUserInfo(data);
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //       navigate('/login');
  //     }
  //   };

  //   fetchUserInfo();
  // }, [navigate]);

  // if (!userInfo) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className={`profile-container ${isEditing ? 'edit-mode' : ''}`}>
      <h2>User Profile</h2>
      <div className="profile-info">
        {isEditing ? (
          <>
            <input type="text" value={editedUserInfo.name} onChange={(e) => setEditedUserInfo({ ...editedUserInfo, name: e.target.value })} />
            <input type="email" value={editedUserInfo.email} onChange={(e) => setEditedUserInfo({ ...editedUserInfo, email: e.target.value })} />
            <input type="password" value={editedUserInfo.password} onChange={(e) => setEditedUserInfo({ ...editedUserInfo, password: e.target.value })} />
            <input type="address" value={editedUserInfo.address} onChange={(e) => setEditedUserInfo({ ...editedUserInfo, address: e.target.value })} />
            <input type="phone" value={editedUserInfo.phone} onChange={(e) => setEditedUserInfo({ ...editedUserInfo, phone: e.target.value })} />
          </>
        ) : (
          <>
        <p><strong>ID:</strong> {userInfo?._id}</p>
        <p><strong>Name:</strong> {userInfo?.name}</p>
        <p><strong>Email:</strong> {userInfo?.email}</p>
        <p><strong>Password:</strong> {userInfo?.password}</p>
        <p><strong>Address:</strong> {userInfo?.address}</p>
        <p><strong>Phone:</strong> {userInfo?.phone}</p>
        </>
        )}
      </div>
      <div className="profile-buttons">
        <Link to="/cart">
          <button className="cart-button">My Cart</button>
        </Link>
        <button className="edit-button" onClick={handleEdit}>Edit</button>
        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Profile;
