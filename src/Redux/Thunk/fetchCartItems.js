import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCartItems = createAsyncThunk(
  "shop/fetchCartItems",
  async (_, thunkAPI) => {
    try {
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) {
        const storedItems = JSON.parse(localStorage.getItem("cartItems")) || {};
        return storedItems;
      }else {
        const response = await fetch("http://localhost:4000/getcart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        });
        if (!response.ok) {
          return {};
        }
        const data = await response.json();
        thunkAPI.dispatch(fetchCartItems());
        return data;
      }
    } catch (error) {
      return {};
    }
  }
);
      