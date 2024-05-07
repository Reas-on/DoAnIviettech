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
      <Link to={"/admin/DashBoard"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Dashboard</p>
        </div>
      </Link>
      <Link to={"/admin/Addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/admin/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>List Product</p>
        </div>
      </Link>
      <Link to={"/admin/Userdata"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>User Data</p>
        </div>
      </Link>
      <Link to={"/admin/Orderdata"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Order Data</p>
        </div>
      </Link>
      <Link to={"/admin/Logout"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Logout</p>
        </div>
      </Link>
    </div>
  );
};

export default Slidebar;
