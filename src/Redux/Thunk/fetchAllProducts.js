import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllProducts = createAsyncThunk(
    "shop/fetchAllProducts",
    async () => {
      try {
        const response = await fetch("http://localhost:4000/product/allproducts");
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error("Failed to fetch products: " + error.message);
      }
    }
  );