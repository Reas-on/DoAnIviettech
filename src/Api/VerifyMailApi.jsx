import axios from 'axios';

const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`https://kiemhieptinhduyen.one/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    throw new Error('Error verifying email.');
  }
};

export { verifyEmail };
