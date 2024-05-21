import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "../../Redux/Thunk/fetchUserInfo";
import {
  selectTotalCartItems,
  selectUserName,
  selectIsAdmin,
  selectAllProducts,
} from "../../Redux/ShopSlice";
import { Dropdown, Menu, Modal, Input, List } from "antd";

const Navbar = () => {
  const dispatch = useDispatch();
  const authToken = localStorage.getItem("auth-token");
  const userName = useSelector(selectUserName);
  const isAdmin = useSelector(selectIsAdmin);
  const totalCartItem = useSelector(selectTotalCartItems);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const products = useSelector(selectAllProducts);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.location.replace("/");
  };

  const handleSearchClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSearchResults(e.target.value.trim() !== "");
  };

  useEffect(() => {
    if (authToken) {
      dispatch(fetchUserInfo(authToken));
    }
  }, [authToken, dispatch]);

  const authMenu = (
    <Menu className="custom-dropdown-menu">
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="cart">
        <Link to="/cart">Cart</Link>
      </Menu.Item>
      {isAdmin && (
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
        <li className="nav-menu-item">
          <Link style={{ textDecoration: "none" }} to="/checkorder">
            Order
          </Link>
        </li>
        <li className="nav-menu-item">
          <span style={{ cursor: "pointer" }} onClick={handleSearchClick}>
            Search
          </span>
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
      <Modal
        title="Search"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        {showSearchResults && (
          <List
            itemLayout="horizontal"
            dataSource={filteredProducts}
            renderItem={(product) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  }
                  title={
                    <Link
                      to={`/product/${product.id}`}
                      style={{ display: "block", marginBottom: "5px" }}
                    >
                      {product.name}
                    </Link>
                  }
                  description={
                    <span style={{ display: "block" }}>
                      Price: {product.new_price.toLocaleString("en-US")} VND
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default Navbar;
