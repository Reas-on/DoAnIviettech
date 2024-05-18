import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCartItems = createAsyncThunk(
  "shop/fetchCartItems",
  async (_, thunkAPI) => {
    try {
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) {
        const storedItems = JSON.parse(localStorage.getItem("cartItems")) || {};
        return storedItems;
      } else {
        const response = await fetch("http://localhost:4000/api/getcart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        });
        if (!response.ok) {
          return thunkAPI.rejectWithValue('Failed to fetch cart items');
        }
        const data = await response.json();
        return data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);