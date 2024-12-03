import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    const response = await fetch("https://kiemhieptinhduyen.one/product/allproducts");
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }
    const data = await response.json();
    return data;
  }
);