import { createAsyncThunk } from "@reduxjs/toolkit";

export const removeFromCart = createAsyncThunk(
  "shop/removeFromCart",
  async (itemId) => {
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
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
    } else {
      throw new Error("Authentication token is missing.");
    }
  }
);
