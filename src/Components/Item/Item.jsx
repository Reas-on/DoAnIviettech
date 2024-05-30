import React from "react";
import "./item.scss";
import { Link } from "react-router-dom";

const Item = (props) => {
  const { id, name, image, new_price, old_price } = props;
  const oldPrice = old_price && old_price !== 0 ? (
    <div className="item-price-old">{old_price.toLocaleString("en-US")} VND</div>
  ) : null;

  return (
    <div className="col-12 col-md">
      <div className="item w-100">
        <div className="d-flex flex-column align-items-center">
          <div className="product-image">
            <Link to={`/product/${id}`}>
              <img onClick={() => window.scrollTo(0, 0)} src={image} alt="" />
            </Link>
          </div>
          <p style={{ cursor: "pointer" }}>{name}</p>
          <div className="item-prices">
            <div className="item-price-new">{new_price.toLocaleString("en-US")} VND</div>
            {oldPrice}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
