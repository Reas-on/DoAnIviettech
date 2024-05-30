import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    const response = await fetch("http://localhost:4000/product/allproducts");
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }
    const data = await response.json();
    return data;
  }
);