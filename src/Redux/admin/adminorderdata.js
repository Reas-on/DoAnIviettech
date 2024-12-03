// redux/admin/orderdata.js
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrderData = createAsyncThunk(
  'admin/fetchOrderData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://kiemhieptinhduyen.one/orderData');
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

export const submitOrder = createAsyncThunk(
  'admin/submitOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://kiemhieptinhduyen.one/orderData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit order');
      }
      const data = await response.json();
      console.log('Order submitted:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);