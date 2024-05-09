import { createAsyncThunk } from "@reduxjs/toolkit"; 

export const fetchCartItems = createAsyncThunk(
    "shop/fetchCartItems",
    async () => {
      try {
        const authToken = localStorage.getItem("auth-token");
        if (!authToken) {
          throw new Error("Authentication token is missing.");
        }
        const response = await fetch("http://localhost:4000/getcart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch cart items.");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error("Failed to fetch cart items: " + error.message);
      }
    }
  );