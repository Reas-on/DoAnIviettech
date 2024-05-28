import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../Redux/Thunk/fetchAllProducts";
import "./CSS/ShopCategory.scss";
import Item from "../Components/Item/Item";

import { Select, Slider } from "antd";

const sortList = [
    {
        value: 1,
        label: "Sorted by Name a-z",
    },
    {
        value: 2,
        label: "Sorted by Name z-a",
    },
    {
        value: 3,
        label: "Sort by price from low to high",
    },
    {
        value: 4,
        label: "Sort by price from high to low",
    },
];


const ShopCategory = (props) => {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.shop.allProducts);
  const status = useSelector((state) => state.shop.status);
  const error = useSelector((state) => state.shop.error);
  const [sortOption, setSortOption] = useState(sortList[0].value);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [productView, setProductView] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8); // Số sản phẩm hiển thị ban đầu
  const productsPerPage = 4; // Số sản phẩm mỗi lần hiển thị

  useEffect(() => {
    dispatch(fetchAllProducts());
    sortedProducts(sortOption);
  }, [dispatch]);
  useEffect(() => {
      sortedProducts(sortOption);
  }, [visibleProducts, props.category]);
  // Function to filter products based on price range
  const filteredProducts = () => {
    return allProducts.filter((item) => {
      const itemPrice = parseFloat(item.new_price);
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      return (!min || itemPrice >= min) && (!max || itemPrice <= max);
    }).filter((item) => item.category === props.category);
  };

  const sortedProducts = (sortOption) => {
     let productList= [];
    switch(sortOption) {
      case 1:
        productList = filteredProducts()
          .slice(0, visibleProducts);
        break;
      case 2:
        productList = filteredProducts()
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, visibleProducts);
        break;
      case 3:
        productList = filteredProducts()
          .sort((a, b) => parseFloat(a.new_price) - parseFloat(b.new_price))
          .slice(0, visibleProducts);
        break;
      case 4:
        productList = filteredProducts()
          .sort((a, b) => parseFloat(b.new_price) - parseFloat(a.new_price))
          .slice(0, visibleProducts);
      default:
        break;
    }
    setProductView(productList);
  };
  const handleSort = (value) => {
    setSortOption(value);
    console.log(value,allProducts);
    sortedProducts(value);
  };

  const handleShowMore = () => {
    setVisibleProducts(visibleProducts + productsPerPage);
    console.log(filteredProducts().length, visibleProducts);
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
              <Select
                  className="sortSelect"
                  options={sortList}
                  defaultValue={sortOption}
                  onChange={handleSort}
              />
    
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
              {productView.map((item) => (
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
              <button
                  className="shopcategory-loadmore"
                  onClick={handleShowMore}
              >
                  Load More
              </button>
          )}
      </div>
  );
};

export default ShopCategory;