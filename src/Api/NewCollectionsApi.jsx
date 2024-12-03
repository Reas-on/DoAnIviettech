import axios from 'axios';

const getNewCollections = async () => {
  try {
    const response = await axios.get('https://kiemhieptinhduyen.one/newcollections');
    return response.data;
  } catch (error) {
    console.error('Error fetching new collections:', error);
    throw error;
  }
};

export default getNewCollections;
