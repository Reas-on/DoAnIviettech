import axios from 'axios';

const fetchOrderData = async (orderNumber) => {
  try {
    const response = await axios.get(`http://localhost:4000/orderData/${orderNumber}`);
    return response.data;
  } catch (error) {
    throw new Error('Order not found');
  }
};

export { fetchOrderData };
