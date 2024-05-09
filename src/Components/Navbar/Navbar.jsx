import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { useSelector } from "react-redux";
import { selectTotalCartItems } from "../../Redux/ShopSlice"; // Import các action và selector từ Redux

const Navbar = () => {
  const [menu, setMenu] = useState("Shop");
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


  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>Kuromi Store</p>
      </div>
      <ul className="nav-menu">
        <li
          onClick={() => {
            setMenu("shop");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("mens");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/mens">
            Men
          </Link>
          {menu === "mens" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("womans");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/womans">
            Woman
          </Link>
          {menu === "womans" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("kids");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/kids">
            Kids
          </Link>
          {menu === "kids" ? <hr /> : <></>}
        </li>
      </ul>
      <div className="nav-login-cart">
        {authToken ? (
          <>
            <Link to="/profile">
              <button>{userName}</button>
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
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
