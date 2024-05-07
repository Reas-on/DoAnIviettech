import React, { useContext, useState } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [visibleProducts, setVisibleProducts] = useState(8); 
  const [sortBy, setSortBy] = useState(""); // State để lưu trạng thái của sắp xếp

  const loadMore = () => {
    setVisibleProducts((prevCount) => prevCount + 8); 
  };
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };
  let sortedProducts = all_product
    .filter((item) => item.category === props.category) 
    .slice(0, visibleProducts); 

  if (sortBy === "price") {
    sortedProducts = sortedProducts.sort((a, b) => a.new_price - b.new_price); 
  } else if (sortBy === "name") {
    sortedProducts = sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{Math.min(visibleProducts, all_product.length)} of {all_product.length}</span>
        </p>
        <div className="shopcategory-sort">
          <select onChange={handleSortChange}>
            <option value="">Sort by</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
          <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {sortedProducts.map((item, i) => (
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
      {visibleProducts < all_product.length && ( 
        <div className="shopcategory-loadmore" onClick={loadMore}>
          Explore More
        </div>
      )}
    </div>
  );
};

export default ShopCategory;
