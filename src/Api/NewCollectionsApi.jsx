import axios from 'axios';

const getNewCollections = async () => {
  try {
    const response = await axios.get('http://localhost:4000/newcollections');
    return response.data;
  } catch (error) {
    console.error('Error fetching new collections:', error);
    throw error;
  }
};

export default getNewCollections;
