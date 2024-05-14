import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { useSelector } from "react-redux";
import { selectTotalCartItems } from "../../Redux/ShopSlice";
import { Dropdown, Menu } from "antd"; // Import Dropdown and Menu components from antd

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const authToken = localStorage.getItem("auth-token");
  const totalCartItem = useSelector(selectTotalCartItems);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.location.replace("/");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:4000/profile", {
          method: "GET",
          headers: {
            "auth-token": authToken,
          },
        });
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (authToken) {
      fetchUserInfo();
    }
  }, [authToken]);

  const authMenu = (
    <Menu className="custom-dropdown-menu">
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="cart">
        <Link to="/cart">Cart</Link>
      </Menu.Item>
      {authToken === "admin-token" && ( // Check for admin token
        <Menu.Item key="admin">
          <Link to="/admin">Admin</Link>
        </Menu.Item>
      )}
      <Menu.Item key="logout">
        <button onClick={handleLogout}>Logout</button>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>Kuromi Store</p>
      </div>
      <ul className="nav-menu">
        <li className="nav-menu-item">
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>
        </li>
        <li className="nav-menu-item">
          <Link style={{ textDecoration: "none" }} to="/mens">
            Men
          </Link>
        </li>
        <li className="nav-menu-item">
          <Link style={{ textDecoration: "none" }} to="/womans">
            Woman
          </Link>
        </li>
        <li className="nav-menu-item">
          <Link style={{ textDecoration: "none" }} to="/kids">
            Kids
          </Link>
        </li>
      </ul>
      <div className="nav-login-cart">
        {authToken ? (
          <Dropdown overlay={authMenu} trigger={["click"]}>
            <button className="dropdown-trigger">{userName}</button>
          </Dropdown>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
        <Link to="/cart">
          <img src={cart_icon} alt="" />
        </Link>
        <div className="nav-cart-count">{totalCartItem}</div>
      </div>
    </div>
  );
};

export default Navbar;

