// MoMoApi.jsx
import axios from 'axios';

export const createMomoPayment = async (amount, orderInfo) => {
  try {
    const response = await axios.post('http://localhost:4000/momo/payment', {
      amount,
      orderInfo,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    throw error;
  }
};

export const checkMomoPayment = async ({ orderId }) => {  // Chỉnh sửa để nhận đối tượng có orderId
  try {
    const response = await axios.post('http://localhost:4000/momo/checkmomopayment', {
      orderId,
    });
    return response.data;
  } catch (error) {
    console.error('Error checking MoMo payment:', error);
    throw error;
  }
};
