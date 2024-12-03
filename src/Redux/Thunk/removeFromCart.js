import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCartItems } from "./fetchCartItems";

export const removeFromCart = createAsyncThunk(
  "shop/removeFromCart",
  async ({ productId, size }, { getState, dispatch, rejectWithValue }) => {
    const authToken = localStorage.getItem("auth-token");

    try {
      if (authToken) {
        const response = await fetch("https://kiemhieptinhduyen.one/api/removefromcart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
          body: JSON.stringify({ productId, size, quantity: 1 }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to remove item from cart.");
        }

        await dispatch(fetchCartItems());
        return { productId, size, isGuest: false };
      } else {
        let storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existingItemIndex = storedItems.findIndex(
          (item) => item.productId === productId && item.size === size
        );

        if (existingItemIndex !== -1) {
          if (storedItems[existingItemIndex].quantity > 1) {
            storedItems[existingItemIndex].quantity -= 1;
          } else {
            storedItems.splice(existingItemIndex, 1);
          }
        }

        localStorage.setItem("cartItems", JSON.stringify(storedItems));
        return { productId, size, isGuest: true };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
