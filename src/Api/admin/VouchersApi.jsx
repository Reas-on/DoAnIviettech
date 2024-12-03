import axios from 'axios';

const baseURL = 'https://kiemhieptinhduyen.one/api/vouchers';

const VouchersApi = {
  getAllVouchers: async () => {
    try {
      const response = await axios.get(baseURL);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch vouchers');
    }
  },

  createVoucher: async (newVoucher) => {
    try {
      const response = await axios.post(baseURL, newVoucher);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create voucher');
    }
  },

  deleteVoucher: async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
    } catch (error) {
      throw new Error('Failed to delete voucher');
    }
  }
};

export default VouchersApi;
