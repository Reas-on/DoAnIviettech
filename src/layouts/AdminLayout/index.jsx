import React, { useEffect } from 'react';
import Slidebar from './Slidebar/Slidebar';
import Navbar from './NavbarAdmin/Navbar';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../Redux/Thunk/fetchUserInfo';
import { selectIsAdmin } from '../../Redux/ShopSlice';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          return <div>Unauthorized access</div>;
        }
        await dispatch(fetchUserInfo(token));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchUserData();
  }, [dispatch]);

  if (!isAdmin) {
    return <div>Check your permission</div>; 
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Slidebar />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
