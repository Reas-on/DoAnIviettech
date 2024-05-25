// Api/Search.jsx
import axios from "axios";

export const searchProducts = async (searchTerm) => {
  try {
    const response = await axios.get(`http://localhost:4000/product/allproducts?search=${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

