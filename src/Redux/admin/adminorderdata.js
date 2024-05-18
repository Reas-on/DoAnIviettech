// redux/admin/orderdata.js
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrderData = createAsyncThunk(
  'admin/fetchOrderData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/orderData');
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
