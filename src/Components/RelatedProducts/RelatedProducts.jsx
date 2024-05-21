import React, { useState, useEffect } from 'react';
import './RelatedProducts.scss';
import Item from '../Item/Item';

const RelatedProducts = ({ productCategory }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/relatedproducts`)
      .then((response) => response.json())
      .then((data) => {
        setRelatedProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching related products:", error);
      });
  }, [productCategory]);

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
}


export default RelatedProducts;
