import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCartItems } from "./fetchCartItems";

export const addToCart = createAsyncThunk(
  "shop/addToCart",
  async (itemId, { getState, dispatch, rejectWithValue }) => {
    const authToken = localStorage.getItem("auth-token");

    if (authToken) {
      try {
        const response = await fetch("http://localhost:4000/api/addtocart", {
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
        await dispatch(fetchCartItems());  // Fetch cart items after adding to cart
        return data.cartItems;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    } else {
      const storedItems = JSON.parse(localStorage.getItem("cartItems")) || {};
      storedItems[itemId] = (storedItems[itemId] || 0) + 1;
      localStorage.setItem("cartItems", JSON.stringify(storedItems));
      dispatch(fetchCartItems());  // Fetch cart items after adding to cart
      return storedItems;
    }
  }
);
