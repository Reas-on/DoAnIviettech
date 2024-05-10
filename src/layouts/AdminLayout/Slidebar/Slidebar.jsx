import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Switch } from "antd";
import { MailOutlined, AppstoreOutlined } from "@ant-design/icons"; // Removed unused icon

const { SubMenu } = Menu;

const Sidebar = () => {
  const [theme, setTheme] = useState("dark");
  const [current, setCurrent] = useState("1");

  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };

  const handleClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Menu
      theme={theme}
      onClick={handleClick}
      style={{ width: 300 , height: '100vh' , borderRight: 0 , padding: 0 , fontSize: 18 , fontWeight: 'bold'}}
      defaultOpenKeys={["sub1"]}
      selectedKeys={[current]}
      mode="inline"
    >
      <Menu.Item key="0" icon={<Switch checked={theme === "dark"} onChange={changeTheme} />}>
        Set Theme
      </Menu.Item>
      <Menu.Item key="1" icon={<MailOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<AppstoreOutlined />}>
        <Link to="/admin/DashBoard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<AppstoreOutlined />}>
        <Link to="/admin/Addproduct">Add Product</Link>
      </Menu.Item>
      <SubMenu key="4" icon={<AppstoreOutlined />} title="List Product">
        <Menu.Item key="4.1">
          <Link to="/admin/listproduct">Tìm Sản Phẩm</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="5" icon={<AppstoreOutlined />} title="User Data">
        <Menu.Item key="5.1">
          <Link to="/admin/AddUser">Add User</Link>
        </Menu.Item>
        <Menu.Item key="5.2">
          <Link to="/admin/FindUser">Find User</Link>
        </Menu.Item>
        <Menu.Item key="5.3">
          <Link to="/admin/UserData">List User</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="6" icon={<AppstoreOutlined />} title="Order Data">
        <Menu.Item key="6.1">
          <Link to="/admin/AllOrders">Tất Cả</Link>
        </Menu.Item>
        <Menu.Item key="6.2">
          <Link to="/admin/ConfirmOrders">Chờ Xác Nhận</Link>
        </Menu.Item>
        <Menu.Item key="6.3">
          <Link to="/admin/DeliveringOrders">Đang Giao Hàng</Link>
        </Menu.Item>
        <Menu.Item key="6.4">
          <Link to="/admin/CompletedOrders">Đã Hoàn Thành</Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item key="7" icon={<AppstoreOutlined />}>
        <Link to="/admin/Logout">Logout</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;
