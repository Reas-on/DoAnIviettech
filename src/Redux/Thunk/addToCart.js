// actions/AddToCart.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCartItems } from "./fetchCartItems";

export const addToCart = createAsyncThunk(
  "shop/addToCart",
  async (itemId, thunkAPI) => {
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      try {
        const response = await fetch("http://localhost:4000/addtocart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
          body: JSON.stringify({ itemId }),
        });
        if (!response.ok) {
          throw new Error("Failed to add item to cart.");
        }
        const data = await response.json();
        return data.cartItems;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    } else {
      const storedItems = JSON.parse(localStorage.getItem("cartItems")) || {};
      storedItems[itemId] = (storedItems[itemId] || 0) + 1;
      localStorage.setItem("cartItems", JSON.stringify(storedItems));
      thunkAPI.dispatch(fetchCartItems());
      return storedItems;
    }
  }
);