import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
const AdminRoute = ({ element, ...rest }) => {
    const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          setIsAdmin(false); 
          return;
        }

        const response = await fetch('http://localhost:4000/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setIsAdmin(userData.isAdmin); 
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error fetching admin status:', error);
        setIsAdmin(false);
      }
    };

    fetchAdminStatus();
  }, []);

  return (
    <Route
      {...rest}
      element={isAdmin ? element : <Navigate to="/not-admin" replace />} 
    />
  );
}

export default AdminRoute;
