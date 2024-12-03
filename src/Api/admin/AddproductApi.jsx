const baseURL = 'https://kiemhieptinhduyen.one'; // Update with your server URL

const AddproductApi = {
  uploadProductImage: async (image) => {
    try {
      const formData = new FormData();
      formData.append("product", image);

      const response = await fetch(`${baseURL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("An error occurred while uploading the image");
    }
  },
  addProduct: async (productData) => {
    try {
      const response = await fetch(`${baseURL}/product/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("An error occurred while adding the product");
    }
  },
};

export default AddproductApi;
