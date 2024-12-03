// Redux/admin/adduser.js
import { createAsyncThunk } from '@reduxjs/toolkit';

export const addUser = createAsyncThunk(
  'admin/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://kiemhieptinhduyen.one/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
