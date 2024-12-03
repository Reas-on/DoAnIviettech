import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPendingOrders = createAsyncThunk(
  'admin/fetchPendingOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://kiemhieptinhduyen.one/orderData');
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      const data = await response.json();
      const pendingOrders = data.filter(order => order.status === 'pending');
      return pendingOrders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://kiemhieptinhduyen.one/orderData/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
