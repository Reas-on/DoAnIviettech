import axios from 'axios';

const getPopularProducts = async () => {
  try {
    const response = await axios.get('https://kiemhieptinhduyen.one/popularwomen');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular products:', error);
    throw error;
  }
};

export default getPopularProducts;
