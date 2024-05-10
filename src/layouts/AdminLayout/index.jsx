import React from 'react';
import Slidebar from './Slidebar/Slidebar';
import Navbar from './NavbarAdmin/Navbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Slidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
