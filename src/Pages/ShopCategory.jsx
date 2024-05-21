import React, { useEffect, useState } from "react";
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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [visibleProducts, setVisibleProducts] = useState(8); // Số sản phẩm hiển thị ban đầu
  const productsPerPage = 4; // Số sản phẩm mỗi lần hiển thị

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Function to filter products based on price range
  const filteredProducts = () => {
    return allProducts.filter((item) => {
      const itemPrice = parseFloat(item.new_price);
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      return (!min || itemPrice >= min) && (!max || itemPrice <= max);
    });
  };

  const sortedProducts = () => {
    return filteredProducts()
      .filter((item) => item.category === props.category)
      .slice(0, visibleProducts); 
  };

  const handleShowMore = () => {
    setVisibleProducts(visibleProducts + productsPerPage);
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
        <div className="shopcategory-priceFilter">
          <input
            type="text"
            placeholder="Từ Giá"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>-</span>
          <input
            type="text"
            placeholder="Giá"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
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
      {visibleProducts < filteredProducts().length && (
        <button className="shopcategory-loadmore" onClick={handleShowMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default ShopCategory;