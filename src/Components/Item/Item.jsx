import React from "react";
import "./item.scss";
import { Link } from "react-router-dom";

const MAX_LENGTH = 30; 

const shortenName = (name) => {
  if (name.length > MAX_LENGTH) {
    return name.substring(0, MAX_LENGTH) + "...";
  }
  return name;
};

const Item = (props) => {
  const { id, name, image, new_price, old_price } = props;
  const shortName = shortenName(name); 
  const oldPrice = old_price && old_price !== 0 ? (
    <div className="item-price-old">{old_price.toLocaleString("en-US")} VND</div>
  ) : null;

  const price = new_price === 0 ? "Out of Stock" : `${new_price.toLocaleString("en-US")} VND`;
  const priceClassName = new_price === 0 ? "out-of-stock" : "";

  return (
    <div className="col-12 col-md">
      <div className="item w-100">
        <div className="d-flex flex-column align-items-center">
          <div className="product-image">
            <Link to={`/product/${id}`}>
              <img onClick={() => window.scrollTo(0, 0)} src={image} alt="" />
            </Link>
          </div>
          <p style={{ cursor: "pointer" , fontWeight: "bold" , textAlign: "center" }}>{shortName}</p>
          <div className="item-prices">
            <div className={`item-price-new ${priceClassName}`}>{price}</div>
            {oldPrice}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
