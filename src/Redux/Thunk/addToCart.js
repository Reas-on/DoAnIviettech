import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCartItems } from "./fetchCartItems";

export const addToCart = createAsyncThunk(
  "shop/addToCart",
  async (item, { getState, dispatch, rejectWithValue }) => {
    const authToken = localStorage.getItem("auth-token");

    try {
      if (authToken) {
        const response = await fetch("https://kiemhieptinhduyen.one/api/addtocart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
          body: JSON.stringify({ items: [item] }),
        });

        if (!response.ok) {
          throw new Error("Failed to add item to cart.");
        }

        await dispatch(fetchCartItems());
        return getState().shop.cartItems;
      } else {
        const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existingItemIndex = storedItems.findIndex(
          (storedItem) =>
            storedItem.productId === item.productId &&
            storedItem.size === item.size
        );

        if (existingItemIndex !== -1) {
          storedItems[existingItemIndex].quantity += item.quantity || 1;
        } else {
          storedItems.push({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity || 1,
          });
        }
        localStorage.setItem("cartItems", JSON.stringify(storedItems));
        dispatch(fetchCartItems());
        return storedItems;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
