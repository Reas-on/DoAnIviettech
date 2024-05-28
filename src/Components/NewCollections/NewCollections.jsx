import React, { useState, useEffect } from 'react';
import './NewCollections.scss';
import Item from '../Item/Item';
import getNewCollections from '../../Api/NewCollectionsApi';

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    const fetchNewCollections = async () => {
      try {
        const data = await getNewCollections();
        setNewCollection(data);
      } catch (error) {
        console.error("Error fetching new collections:", error);
      }
    };

    fetchNewCollections();
  }, []);

  return (
    <div className="new-collections">
      <h1>NEW COLLECTION</h1>
      <hr />
      <div className="collections">
        {newCollection.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price === 0 ? "Out of Stock" : item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCollections;
