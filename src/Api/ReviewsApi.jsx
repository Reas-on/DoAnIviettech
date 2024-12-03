import axios from 'axios';

const fetchReviews = async (productId) => {
  try {
    const response = await axios.get(`https://kiemhieptinhduyen.one/api/comments/${productId}`);
    return response.data.comments;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

const addReview = async (productId, comment, rating, token) => {
  try {
    const response = await axios.post(
      'https://kiemhieptinhduyen.one/api/addcomment',
      { productId, comment, rating },
      {
        headers: { 'auth-token': token }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export { fetchReviews, addReview };
