import axios from 'axios';

const fetchReviews = async (productId) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/comments/${productId}`);
    return response.data.comments;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

const addReview = async (productId, comment, rating, token) => {
  try {
    const response = await axios.post(
      'http://localhost:4000/api/addcomment',
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
