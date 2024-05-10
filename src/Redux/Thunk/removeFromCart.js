import { createAsyncThunk } from "@reduxjs/toolkit";

export const removeFromCart = createAsyncThunk(
  "shop/removeFromCart",
  async (itemId, thunkAPI) => {
    try {
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) {
        // Nếu không có token, xóa sản phẩm khỏi local storage và trả về itemId
        const storedItems = JSON.parse(localStorage.getItem("cartItems")) || {};
        delete storedItems[itemId];
        localStorage.setItem("cartItems", JSON.stringify(storedItems));
        return itemId;
      }
      const response = await fetch("http://localhost:4000/removefromcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ itemId }),
      });
      await response.json();
      return itemId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
