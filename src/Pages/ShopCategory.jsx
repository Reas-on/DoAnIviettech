import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../Redux/Thunk/fetchAllProducts";
import "./CSS/ShopCategory.scss";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";

const ShopCategory = (props) => {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.shop.allProducts);
  const status = useSelector((state) => state.shop.status);
  const error = useSelector((state) => state.shop.error);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const sortedProducts = () => {
    return allProducts.filter((item) => item.category === props.category);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <div className="shopcategory-sort">
          <select>
            <option value="">Sort by</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
          <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {sortedProducts().map((item) => (
          <Item
            key={item.id}
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
};

export default ShopCategory;
