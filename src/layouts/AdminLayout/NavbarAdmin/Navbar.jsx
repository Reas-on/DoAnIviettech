import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.css';
import navlogo from '../../../assets/nav-logo.svg';

const Navbar = () => {
  const userName = useSelector((state) => state.shop.user?.name);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.location.replace("/");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <img src={navlogo} className="nav-logo" alt="Logo" />
      <Dropdown overlay={userMenu} trigger={['click']}>
        <Button shape="round" className="options-dropdown">
          {userName ? userName : 'Options'}
        </Button>
      </Dropdown>
    </div>
  );
}

export default Navbar;
