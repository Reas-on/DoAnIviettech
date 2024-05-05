import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Thêm state cho sản phẩm được chọn
  
  useEffect(() => {
    fetchInfo();
  }, [currentPage]);

  const fetchInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/allproducts?page=${currentPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      await fetch('http://localhost:4000/removeproduct', {
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

  const handleViewClick = (product) => {
    setSelectedProduct(product);
  };

  const handleEditClick = (product) => {
  };

  const totalPages = Math.ceil(allProducts.length / 9); 

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
        {allProducts
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
                <p>{product.name}</p>
                <p>{product.old_price.toLocaleString("en-US")} VND</p>
                <p>{product.new_price.toLocaleString("en-US")} VND</p>
                <p>{product.category}</p>
                <div className="action-buttons" onMouseLeave={() => setSelectedProductId(null)}>
                  <button
                    className="button-action"
                    onMouseEnter={() => handleActionClick(product.id)}
                  >
                    Action
                  </button>
                  {selectedProductId === product.id && (
                    <div className="action-dropdown">
                      <button onClick={() => handleEditClick(product)}>Edit</button>
                      <button onClick={() => handleViewClick(product)}>View</button>
                      <button onClick={() => removeProduct(product.id)}>Remove</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      {/* Hiển thị chi tiết sản phẩm */}
      {selectedProduct && (
        <div className="product-detail">
          <h2>Product Detail</h2>
          <p>ID: {selectedProduct.id}</p>
          <p>Image: {selectedProduct.image}</p>
          <p>Name: {selectedProduct.name}</p>
          <p>Old Price: {selectedProduct.old_price} VND</p>
          <p>New Price: {selectedProduct.new_price} VND</p>
          <p>Category: {selectedProduct.category}</p>
        <p>Date: {selectedProduct.date}</p>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
