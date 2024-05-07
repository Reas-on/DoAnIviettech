import React from "react";
import "./Breadcrum.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";
import { Link } from "react-router-dom";

const Breadcrums = ({ product }) => {
  if (!product || !product.category) {
    return null; // Hoặc có thể trả về một phần tử rỗng để không render gì cả
  }
  const getCategoryRoute = (category) => {
    switch (category) {
      case "men":
        return "/mens";
      case "women":
        return "/womans";
      case "kid":
        return "/kids";
      default:
        return "/";
    }
  };

  return (
    <div className="breadcrum">
      <Link to="/">HOME</Link> <img src={arrow_icon} alt="" />
      <Link to="/">Shop</Link> <img src={arrow_icon} alt="" />{" "}
      <Link to={getCategoryRoute(product.category)}>{product.category}</Link>{" "}
      <img src={arrow_icon} alt="" /> {product.name}
    </div>
  );
};

export default Breadcrums;
