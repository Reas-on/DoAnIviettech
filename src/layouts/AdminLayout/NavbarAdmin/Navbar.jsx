import React from 'react';
import { Select } from 'antd';

import './Navbar.css';
import navlogo from '../../../assets/nav-logo.svg';
import { useSelector } from 'react-redux';

const { Option } = Select;

const Navbar = () => {
  const userName = useSelector((state) => state.shop.user?.name);
  return (
    <div className='navbar'>
      <img src={navlogo} className='nav-logo' alt="" />
      <Select defaultValue={userName} className="options-select">
        <Option value="1">Home</Option>
        <Option value="2">Log Out</Option>
      </Select>
    </div>
  );
}

export default Navbar;
