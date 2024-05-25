// AddCommentApi.jsx
import axios from 'axios';

const addComment = async (productId, comment, rating, token) => {
  try {
    const response = await axios.post(
      'http://localhost:4000/api/addcomment',
      {
        productId,
        comment,
        rating,
      },
      {
        headers: {
          'auth-token': token,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default addComment;
