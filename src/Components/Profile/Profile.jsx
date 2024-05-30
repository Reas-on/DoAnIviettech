import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { List, message } from 'antd';
import './Profile.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../Redux/Thunk/fetchUserInfo';
import { selectUserName } from '../../Redux/ShopSlice';
import { ContactsOutlined, LockOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import MyProfile from './MyProfile';
import ChangePassword from './ChangePassword';
import ChangeProfile from './ChangeProfile';


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);
  const [userInfo, setUserInfo] = useState(null);
  const [menuAciveKey, setMenuActiveKey] = useState(1);

  useEffect(() => {
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      dispatch(fetchUserInfo(authToken));
    }
  }, [dispatch]);
  const handleSave = async (editedUserInfo) => {
      try {
          const authToken = localStorage.getItem("auth-token");
          if (!authToken) {
              navigate("/login");
              return;
          }
          const response = await fetch(`http://localhost:4000/api/profile`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": authToken,
              },
              body: JSON.stringify(editedUserInfo),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to save changes");
          }

          const updatedUser = await response.json();
          message.success("Changes saved successfully");
          setUserInfo(updatedUser.user);
      } catch (error) {
          console.error("Error saving changes:", error);
          message.error("Failed to save changes");
      }
  };
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
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

 

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
      <>
          <div className="container mt-5">
              <div className="row justify-content-between">
                  <div className="col-4  col-sm-12 col-md-4  border border-1 rounded-2 menu p-0">
                      <div
                          className={
                              "d-flex align-items-center py-2 menu-item " +
                              (menuAciveKey == 1 ? "active" : "")
                          }
                          onClick={() => setMenuActiveKey(1)}
                      >
                          <UserOutlined className="ms-3 menu-icon" />
                          <div className="ms-3 my-1">My Profile</div>
                      </div>
                      <div
                          className={
                              "d-flex align-items-center py-2 menu-item " +
                              (menuAciveKey == 2 ? "active" : "")
                          }
                          onClick={() => setMenuActiveKey(2)}
                      >
                          <LockOutlined className="ms-3 menu-icon" />
                          <div className="ms-3 my-1">Change Password</div>
                      </div>
                      <div
                          className={
                              "d-flex align-items-center py-2 menu-item " +
                              (menuAciveKey == 3 ? "active" : "")
                          }
                          onClick={() => setMenuActiveKey(3)}
                      >
                          <ContactsOutlined className="ms-3 menu-icon" />
                          <div className="ms-3 my-1">Update Profile</div>
                      </div>
                      <Link
                          to="/cart"
                          className="d-flex align-items-center py-2 menu-item"
                      >
                          <ShoppingCartOutlined className="ms-3 menu-icon" />

                          <div className="ms-3 my-1">My Cart</div>
                      </Link>
                  </div>
                  <div className="col-8 col-sm-12 col-md-8 pl-5">
                      <div className="content border border-1 rounded-2 p-3">
                          {menuAciveKey === 1 ? (
                              <MyProfile userInfo={userInfo} />
                          ) : menuAciveKey === 2 ? (
                              <ChangePassword
                                  userInfo={userInfo}
                                  handleSave={handleSave}
                              />
                          ) : (
                              menuAciveKey === 3 && (
                                  <ChangeProfile
                                      userInfo={userInfo}
                                      setUserInfo={setUserInfo}
                                      handleSave={handleSave}
                                  />
                              )
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </>
  );
};

export default Profile;
