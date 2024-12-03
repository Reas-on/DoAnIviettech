import axios from 'axios';

const BASE_URL = 'https://kiemhieptinhduyen.one/zalo';

export const checkZaloPayment = async (app_trans_id) => {
  try {
    const response = await axios.post(`${BASE_URL}/checkzalopayment`, { app_trans_id });
    return response.data;
  } catch (error) {
    console.error('Error checking Zalo payment:', error);
    throw error;
  }
};

export const createZaloPayment = async (orderInfo) => {
  try {
    const response = await axios.post(`${BASE_URL}/payment`, {
      amount: orderInfo.amount,
      productName: orderInfo.productName,
      productDescription: orderInfo.productDescription,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Zalo payment:', error);
    throw error;
  }
};
