import React, { useEffect, useState, useCallback } from "react";
import "./ListProduct.css";
import { Link } from "react-router-dom";

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Thêm state cho phần filter

  const fetchInfo = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/product/allproducts?page=${currentPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo, currentPage]);

  const removeProduct = async (id) => {
    try {
      await fetch("http://localhost:4000/product/removeproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      await fetchInfo();
      setMessage("Product removed successfully.");
    } catch (error) {
      console.error("Error removing product:", error.message);
      setMessage("Failed to remove product.");
    }
  };

  const handleActionClick = (id) => {
    setSelectedProductId(selectedProductId === id ? null : id);
  };

  const handleViewProduct = (product) => {
    window.open(`http://localhost:3000/product/${product.id}`, "_blank");
  };

  const totalPages = Math.ceil(allProducts.length / 9);

  // Hàm lọc sản phẩm theo tên
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="list-product">
      <h1>List Product</h1>
      <div className="message">{message}</div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {/* Phần Filter */}
      <div>
        <input
          type="text"
          placeholder="Enter product name to filter"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Danh sách sản phẩm */}
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Action</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {filteredProducts
          .slice((currentPage - 1) * 9, currentPage * 9)
          .map((product, index) => {
            return (
              <div
                key={index}
                className="listproduct-format-main listproduct-format"
              >
                <img
                  src={product.image}
                  alt=""
                  className="listproduct-product-icon"
                />
                <Link to={`/admin/listProduct/${product.id}`}>
                  <p>{product.name}</p>
                </Link>
                <p>{product.old_price.toLocaleString("en-US")} VND</p>
                <p>{product.new_price.toLocaleString("en-US")} VND</p>
                <p>{product.category}</p>
                <div
                  className="action-buttons"
                  onMouseLeave={() => setSelectedProductId(null)}
                >
                  <button
                    className="button-action"
                    onMouseEnter={() => handleActionClick(product.id)}
                  >
                    Action
                  </button>
                  {selectedProductId === product.id && (
                    <div className="action-dropdown">
                      <button onClick={() => handleViewProduct(product)}>
                        View Product
                      </button>
                      <button onClick={() => removeProduct(product.id)}>
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ListProduct;