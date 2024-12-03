import axios from 'axios';

const getRelatedProducts = async () => {
  try {
    const response = await axios.get('https://kiemhieptinhduyen.one/relatedproducts');
    return response.data;
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw error;
  }
};

export default getRelatedProducts;
