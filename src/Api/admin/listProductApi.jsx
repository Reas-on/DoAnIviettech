const baseURL = 'http://localhost:4000';
const listProductApi = {
  getAllProducts: async (currentPage) => {
    try {
      const response = await fetch(`${baseURL}/product/allproducts?page=${currentPage}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("An error occurred while fetching data");
    }
  },
  removeProduct: async (productId) => {
    try {
      await fetch(`${baseURL}/product/removeproduct`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });
      return true;
    } catch (error) {
      throw new Error("An error occurred while removing product");
    }
  }
};

export default listProductApi;
