import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Rate } from "antd";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDisplay.scss";
import { addToCart } from "../../Redux/Thunk/addToCart";
import { fetchReviews } from "../../Api/ReviewsApi";

const ProductDisplay = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        if (product && product.id) {
          const comments = await fetchReviews(product.id);
          setReviews(comments);
          const totalStars = comments.reduce((acc, cur) => acc + cur.rating, 0);
          setAverageRating(comments.length > 0 ? totalStars / comments.length : 0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProductReviews();
  }, [product]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    console.log(`Selected size: ${size}`);
  };

  const handleAddToCart = () => {
    if (selectedSize === null) {
      toast.error("Please select a size.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    const item = { productId: product.id, size: selectedSize, quantity: 1 };
    dispatch(addToCart(item));
    toast.success(`Added Product ${product.name} to your cart`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  if (!product) {
    return null;
  }

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="producdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <Rate allowHalf value={averageRating} style={{ color: "#ff4141" }} disabled />
          <p className="rating-text">{averageRating.toFixed(1)} ({reviews.length} reviews)</p>
        </div>
        <div className="productdisplay-right-prices">
          {product.old_price && product.old_price !== 0 ? (
            <div className="productdisplay-right-price-old">
              {product.old_price.toLocaleString("en-US")} VND
            </div>
          ) : null}
          {product.new_price !== 0 ? (
            <div className="productdisplay-right-price-new">
              {product.new_price.toLocaleString("en-US")} VND
            </div>
          ) : (
            <div className="out-of-stock">Out of Stock</div>
          )}
        </div>

        <div className="productdisplay-right-description">
          <p>{product.shortDescription}</p>
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={`size ${selectedSize === size ? "active" : ""}`}
                onClick={() => handleSizeClick(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
        <div className="productdisplay-right-cart">
          <button onClick={handleAddToCart} disabled={product.new_price === 0}>
            Add To Cart
          </button>
        </div>
        <p className="productdisplay-right-category">
          Category: <span>{product.category}</span>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductDisplay;
