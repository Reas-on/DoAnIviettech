import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Switch } from "antd";
import { MailOutlined, AppstoreOutlined, MinusOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;

const Sidebar = () => {
  const [theme, setTheme] = useState("dark");
  const [current, setCurrent] = useState("1");

  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      theme={theme}
      onClick={handleClick}
      style={{
        width: 300,
        borderRight: 0,
        padding: 0,
        fontSize: 18,
        fontWeight: "bold",
        overflowY: "auto",
      }}
      defaultOpenKeys={["sub1"]}
      selectedKeys={[current]}
      mode="inline"
    >
      <Menu.Item
        key="0"
        icon={<Switch checked={theme === "dark"} onChange={changeTheme} />}
      >
        Set Theme
      </Menu.Item>
      <Menu.Item key="2" icon={<MailOutlined />}>
        <Link to="/admin/DashBoard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<AppstoreOutlined />}>
        <Link to="/admin/Addproduct">Add Product</Link>
      </Menu.Item>
      <SubMenu key="4" icon={<AppstoreOutlined />} title="List Product">
        <Menu.Item key="4.1">
          <Link to="/admin/listproduct">All Products</Link>
        </Menu.Item>
        <Menu.Item key="4.2">
          <Link to="/admin/Vouchers">Vouchers</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="5" icon={<AppstoreOutlined />} title="User Data">
        <Menu.Item key="5.1" icon={<MinusOutlined />}>
          <Link to="/admin/AddUser">Add User</Link>
        </Menu.Item>
        <Menu.Item key="5.3" icon={<MinusOutlined />}>
          <Link to="/admin/UserData">List User</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="6" icon={<AppstoreOutlined />} title="Order Data">
        <Menu.Item key="6.1">
          <Link to="/admin/AllOrders">All Orders</Link>
        </Menu.Item>
        <SubMenu key="6.2" icon={<AppstoreOutlined />} title="Order Status">
          <Menu.Item key="6.2.1" icon={<MinusOutlined />}>
            <Link to="/admin/ConfirmOrders">Pending Confirmation</Link>
          </Menu.Item>
          <Menu.Item key="6.2.2" icon={<MinusOutlined />}>
            <Link to="/admin/ProcessingOrders">Processing</Link>
          </Menu.Item>
          <Menu.Item key="6.2.3" icon={<MinusOutlined />}>
            <Link to="/admin/CancelOrders">Cancelled</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="6.3" icon={<AppstoreOutlined />} title="Delivery Status">
          <Menu.Item key="6.3.1" icon={<MinusOutlined />}>
            <Link to="/admin/DeliveringOrders">Delivering</Link>
          </Menu.Item>
          <Menu.Item key="6.3.2" icon={<MinusOutlined />}>
            <Link to="/admin/ShippedOrders">Shipped</Link>
          </Menu.Item>
          <Menu.Item key="6.3.3" icon={<MinusOutlined />}>
            <Link to="/admin/CompletedOrders">Completed</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="6.4" icon={<AppstoreOutlined />} title="Payment Status">
          <Menu.Item key="6.4.1" icon={<MinusOutlined />}>
            <Link to="/admin/PaidOrders">Cash on Delivery</Link>
          </Menu.Item>
          <Menu.Item key="6.4.2" icon={<MinusOutlined />}>
            <Link to="/admin/PaidVNPAYOrders">Zalo PAY</Link>
          </Menu.Item>
          <Menu.Item key="6.4.3" icon={<MinusOutlined />}>
            <Link to="/admin/PaidMoMoOrders">MoMo</Link>
          </Menu.Item>
        </SubMenu>
      </SubMenu>
    </Menu>
  );
};

export default Sidebar;
