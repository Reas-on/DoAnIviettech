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
} from "../../Redux/ShopSlice";
import { Dropdown, Menu, Modal, Input, List } from "antd";
import { searchProducts } from "../../Api/SearchApi";

const Navbar = () => {
  const dispatch = useDispatch();
  const authToken = localStorage.getItem("auth-token");
  const userName = useSelector(selectUserName);
  const isAdmin = useSelector(selectIsAdmin);
  const totalCartItem = useSelector(selectTotalCartItems);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = (status) => setIsNavCollapsed(status);

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
    setFilteredProducts([]);
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() !== "") {
      try {
        const results = await searchProducts(value);
        setFilteredProducts(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setShowSearchResults(false);
      setFilteredProducts([]);
    }
  };

  useEffect(() => {
    if (authToken) {
      dispatch(fetchUserInfo(authToken));
    }
  }, [authToken, dispatch]);

  const authMenu = (
    <Menu className="custom-dropdown-menu">
      <Menu.Item key="profile">
        <Link to="/profile" style={{ textDecoration: "none" }}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="cart">
        <Link to="/cart" style={{ textDecoration: "none" }}>Cart</Link>
      </Menu.Item>
      {isAdmin && (
        <Menu.Item key="admin">
          <Link to="/admin" style={{ textDecoration: "none" }}>Admin</Link>
        </Menu.Item>
      )}
      <Menu.Item key="logout">
        <a href="#" style={{ textDecoration: "none" }} onClick={handleLogout}>Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="navbar navbar-expand-lg">
      <Link className="navbar-brand d-flex justify-content-center align-items-center" to={"/"}>
        <img src={logo} alt="logo" style={{ width: "120px", height: "auto" }}/>
        {/* <h3 className="ms-2 mb-0">Kuromi Store</h3> */}
      </Link>
      <button
        className={"navbar-toggler"}
        type="button"
        data-toggle="collapse"
        data-target="#header-navbar"
        aria-controls="header-navbar"
        aria-expanded={!isNavCollapsed ? true : false}
        aria-label="Toggle navigation"
        onClick={() => setIsNavCollapsed(!isNavCollapsed)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="header-navbar">
        <ul className="navbar-nav w-100 justify-content-center">
          <li className="nav-item active">
            <Link className="nav-link" to="/" onClick={() => setIsNavCollapsed(true)}>
              Shop
            </Link>
            {/* <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> */}
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/mens" onClick={() => setIsNavCollapsed(true)}>
              Men
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/womans" onClick={() => setIsNavCollapsed(true)}>
              Woman
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/kids" onClick={() => setIsNavCollapsed(true)}>
              Kids
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/checkorder" onClick={() => setIsNavCollapsed(true)}>
              Order
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav justify-content-center">
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={handleSearchClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search d-none d-lg-inline" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path>
              </svg>
              <span className="d-lg-none">Tìm kiếm</span>
            </a>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link" onClick={() => setIsNavCollapsed(true)}>
              <div className="position-relative">
                <span className="me-2 d-lg-none">Giỏ hàng</span>
                <img className="d-none d-lg-inline" style={{ width: "30px", height: "30px" }} src={cart_icon} alt="" />
                <span className="nav-cart-count">{totalCartItem}</span>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            {authToken ? (
              <Dropdown overlay={authMenu} className="nav-link" trigger={["click"]}>
                <span style={{ cursor: "pointer" }} className="dropdown-trigger">{userName}</span>
              </Dropdown>
            ) : (
              <Link to="/login" className="nav-link" onClick={() => setIsNavCollapsed(true)}>
                <span className="btn btn-primary">Login</span>
              </Link>
            )}
          </li>
        </ul>
      </div>
      <Modal
        title="Search"
        open={isModalVisible}
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
    </nav>
    // <div className="navbar">
    //   <div className="nav-logo">
    //     <img src={logo} alt="logo" />
    //     <p>Kuromi Store</p>
    //   </div>
    //   <ul className="nav-menu">
    //     <li className="nav-menu-item">
    //       <Link style={{ textDecoration: "none" }} to="/">
    //         Shop
    //       </Link>
    //     </li>
    //     <li className="nav-menu-item">
    //       <Link style={{ textDecoration: "none" }} to="/mens">
    //         Men
    //       </Link>
    //     </li>
    //     <li className="nav-menu-item">
    //       <Link style={{ textDecoration: "none" }} to="/womans">
    //         Woman
    //       </Link>
    //     </li>
    //     <li className="nav-menu-item">
    //       <Link style={{ textDecoration: "none" }} to="/kids">
    //         Kids
    //       </Link>
    //     </li>
    //     <li className="nav-menu-item">
    //       <Link style={{ textDecoration: "none" }} to="/checkorder">
    //         Order
    //       </Link>
    //     </li>
    //     <li className="nav-menu-item">
    //       <span style={{ cursor: "pointer" }} onClick={handleSearchClick}>
    //         Search
    //       </span>
    //     </li>
    //   </ul>
    //   <div className="nav-login-cart">
    //     {authToken ? (
    //       <Dropdown overlay={authMenu} trigger={["click"]}>
    //         <button className="dropdown-trigger">{userName}</button>
    //       </Dropdown>
    //     ) : (
    //       <Link to="/login">
    //         <button>Login</button>
    //       </Link>
    //     )}
    //     <Link to="/cart">
    //       <img src={cart_icon} alt="" />
    //     </Link>
    //     <div className="nav-cart-count">{totalCartItem}</div>
    //   </div>
    //   <Modal
    //     title="Search"
    //     visible={isModalVisible}
    //     onCancel={handleModalCancel}
    //     footer={null}
    //   >
    //     <Input
    //       placeholder="Search"
    //       value={searchTerm}
    //       onChange={handleSearchInputChange}
    //     />
    //     {showSearchResults && (
    //       <List
    //         itemLayout="horizontal"
    //         dataSource={filteredProducts}
    //         renderItem={(product) => (
    //           <List.Item>
    //             <List.Item.Meta
    //               avatar={
    //                 <img
    //                   src={product.image}
    //                   alt={product.name}
    //                   style={{ width: "50px", height: "50px" }}
    //                 />
    //               }
    //               title={
    //                 <Link
    //                   to={`/product/${product.id}`}
    //                   style={{ display: "block", marginBottom: "5px" }}
    //                 >
    //                   {product.name}
    //                 </Link>
    //               }
    //               description={
    //                 <span style={{ display: "block" }}>
    //                   Price: {product.new_price.toLocaleString("en-US")} VND
    //                 </span>
    //               }
    //             />
    //           </List.Item>
    //         )}
    //       />
    //     )}
    //   </Modal>
    // </div>
  );
};

export default Navbar;
