// ListProductApi.jsx
import axios from "axios";

const BASE_URL = "http://localhost:4000/product";

export const getAllProducts = async (currentPage) => {
  try {
    const response = await axios.get(`${BASE_URL}/allproducts?page=${currentPage}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const removeProduct = async (id) => {
  try {
    await axios.post(`${BASE_URL}/removeproduct`, { id });
  } catch (error) {
    throw new Error("Failed to remove product");
  }
};
