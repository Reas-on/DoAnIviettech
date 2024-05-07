import React, { useContext } from "react";
import "./ProductDisplay.scss";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
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
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(20 reviews)</p>
        </div>
        <div className="productdisplay-right-prices">
          {product.old_price && product.old_price !== 0 ? (
            <div className="productdisplay-right-price-old">
              {product.old_price.toLocaleString("en-US")} VND
            </div>
          ) : null}
          <div className="productdisplay-right-price-new">
            {product.new_price.toLocaleString("en-US")} VND
          </div>
        </div>
        <div className="productdisplay-right-description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
          corporis assumenda optio enim nesciunt dolorem cumque, molestias atque
          quis fugit eius culpa, unde quos nobis modi corrupti quo inventore
          similique.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>
        <button onClick={() => addToCart(product.id)}>Add To Cart</button>
        <p className="productdisplay-right-category">
          Category: <span>{product.category}</span>
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
