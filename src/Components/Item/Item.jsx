import React from "react";
import "./item.scss";
import { Link } from "react-router-dom";

const Item = (props) => {
  const { id, name, image, new_price, old_price } = props;
  const oldPrice = old_price && old_price !== 0 ? (
    <div className="item-price-old">{old_price.toLocaleString("en-US")} VND</div>
  ) : null;

  return (
    <div className="item">
      <Link to={`/product/${id}`}>
        <img onClick={() => window.scrollTo(0, 0)} src={image} alt="" />
      </Link>
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-new">{new_price.toLocaleString("en-US")} VND</div>
        {oldPrice}
      </div>
    </div>
  );
};

export default Item;
