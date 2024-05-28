import axios from 'axios';

const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`http://localhost:4000/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    throw new Error('Error verifying email.');
  }
};

export { verifyEmail };
