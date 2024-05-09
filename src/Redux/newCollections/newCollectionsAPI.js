// src/redux/newCollections/newCollectionsAPI.js

export const fetchNewCollections = async () => {
    const response = await fetch('http://localhost:4000/newcollections');
    if (!response.ok) {
      throw new Error('Failed to fetch new collections');
    }
    return response.json();
  };
  