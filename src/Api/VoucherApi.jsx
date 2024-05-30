import axios from 'axios';

const BASE_URL = 'http://localhost:4000/zalo';

// GET all vouchers
const getAllVouchers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/vouchers`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving vouchers:', error);
    throw error;
  }
};

// POST a new voucher
const createNewVoucher = async (voucherData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/vouchers`, voucherData);
    return response.data;
  } catch (error) {
    console.error('Error creating voucher:', error);
    throw error;
  }
};

export { getAllVouchers, createNewVoucher };
