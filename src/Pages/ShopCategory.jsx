import React, { useEffect, useLayoutEffect, useState } from "react";
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

const sortPrice = [
  {
    value: 0,
    label: "Toàn bộ",
  },
  {
    value: 1,
    label: "Dưới 1,000,000",
  },
  {
    value: 2,
    label: "Từ 1,000,000 đến 3,000,000",
  },
  {
    value: 3,
    label: "Từ 3,000,000 đến 5,000,000",
  },
  {
    value: 4,
    label: "Trên 5,000,000",
  },
]


const ShopCategory = (props) => {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.shop.allProducts);
  const status = useSelector((state) => state.shop.status);
  const error = useSelector((state) => state.shop.error);
  const [sortOption, setSortOption] = useState(sortList[0].value);
  const [sortPriceOption, setSortPriceOption] = useState(sortPrice[0].value);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999999999);
  const [productView, setProductView] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(6); // Số sản phẩm hiển thị ban đầu
  const productsPerPage = 3; // Số sản phẩm mỗi lần hiển thị

  useLayoutEffect(() => {
    dispatch(fetchAllProducts());
    sortedProducts(sortOption);
  }, [dispatch]);
  useEffect(() => {
    sortedProducts(sortOption);
  }, allProducts)
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

  useEffect(() => {
    sortedProducts(sortOption);
  }, [minPrice, maxPrice, sortPriceOption])

  const sortedProducts = (sortOption) => {
    let productList = [];
    switch (sortOption) {
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
    console.log(value, allProducts);
    sortedProducts(value);
  };

  const handleSortPrice = (value) => {
    console.log(value);
    switch (value) {
      case 0:
        setMinPrice(0)
        setMaxPrice(99999999999)
        break;

      case 1:
        setMinPrice(0)
        setMaxPrice(1000000)
        break;

      case 2:
        setMinPrice(1000001)
        setMaxPrice(3000000)
        break;

      case 3:
        setMinPrice(3000001)
        setMaxPrice(5000000)
        break;

      case 4:
        setMinPrice(5000001)
        setMaxPrice(99999999999)
        break;
    }
    setSortPriceOption(value);
    console.log(value, allProducts);
    // sortedProducts(sortOption);
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
          <Select
            className="sortSelect"
            options={sortPrice}
            defaultValue={sortPriceOption}
            onChange={handleSortPrice}
          />
          {/* <input
            type="text"
            placeholder="Từ Giá"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          /> */}
          {/* <span>-</span>
          <input
            type="text"
            placeholder="Giá"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          /> */}
        </div>
      </div>
      <div className="container mt-5 shopcategory-products">
        <div className="row gap-3">
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