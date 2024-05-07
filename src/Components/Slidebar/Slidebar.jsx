import React from "react";
import "./Slidebar.css";
import { Link } from "react-router-dom";
import add_product_icon from "../../assets/Product_Cart.svg";
const Slidebar = () => {
  return (
    <div className="slidebar">
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Home</p>
        </div>
      </Link>
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Dashboard</p>
        </div>
      </Link>
      <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>List Product</p>
        </div>
      </Link>
      <Link to={"/Userdata"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>User Data</p>
        </div>
      </Link>
      <Link to={"/Orderdata"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Order Data</p>
        </div>
      </Link>
      <Link to={"/Logout"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Logout</p>
        </div>
      </Link>
    </div>
  );
};

export default Slidebar;
