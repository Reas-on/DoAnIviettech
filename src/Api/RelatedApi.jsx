import axios from 'axios';

const getRelatedProducts = async () => {
  try {
    const response = await axios.get('http://localhost:4000/relatedproducts');
    return response.data;
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw error;
  }
};

export default getRelatedProducts;
