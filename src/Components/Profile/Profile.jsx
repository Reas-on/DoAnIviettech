import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.scss';

const Profile = () => {
  // const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({});
  
  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'));
    if (userFromLocalStorage) {
      setUserInfo(userFromLocalStorage);
      setEditedUserInfo(userFromLocalStorage);
    } else {
      const defaultUserInfo = {
        _id: '123',
        name: 'duy',
        email: 'duy00@gmail.com',
        password: '123456',
        address: 'Da Nang',
        phone: '0901887889',
      };
      setUserInfo(defaultUserInfo);
      setEditedUserInfo(defaultUserInfo);
    }
  }, []);
  
  const handleEditClick = () => {
    setIsEditing(true); 
  };
  
  const handleSaveClick = () => {
    console.log('Edited user info:', editedUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(editedUserInfo));
    setIsEditing(false);
    setUserInfo(editedUserInfo);
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
        <button className="edit-button" onClick={handleEditClick}>Edit</button>
        <button className="save-button"onClick={handleSaveClick}>Save</button>
      </div>
    </div>
  );
};

export default Profile;