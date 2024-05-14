import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Upload, Button, Timeline } from 'antd';
import { UploadOutlined } from '@ant-design/icons'; // Import UploadOutlined icon

const { Title } = Typography;

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [topProducts] = useState([]);

  useEffect(() => {
    fetchTotalProducts();
    fetchTotalRevenue();
    fetchTotalOrders();
    fetchTotalUsers();
    fetchTopProducts();
  }, []);

  const fetchTotalProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/product/allproducts');
      if (!response.ok) {
        throw new Error('Failed to fetch total products');
      }
      const data = await response.json();
      setTotalProducts(data.length);
    } catch (error) {
      console.error('Error fetching total products:', error);
    }
  };

  const fetchTotalRevenue = async () => {
    // Implement fetching total revenue from API
  };

  const fetchTotalOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/orderData');
      if (!response.ok) {
        throw new Error('Failed to fetch total orders');
      }
      const data = await response.json();
      setTotalOrders(data.length);
    } catch (error) {
      console.error('Error fetching total orders:', error);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch total users');
      }
      const data = await response.json();
      setTotalUsers(data.length);
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
  };

  const fetchTopProducts = async () => {
    // Implement fetching top products from API
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Dashboard</Title>
      {/* First Row */}
      <Row gutter={[16, 16]} className="dashboard-row">
        <Col xs={24} sm={12} md={6}>
          <Card title="Tổng Sản Phẩm" style={{ backgroundColor: '#FFCC80' }}>
            {totalProducts}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card title="Tổng Doanh Thu" style={{ backgroundColor: '#81C784' }}>
            {totalRevenue}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card title="Tổng Đơn Hàng" style={{ backgroundColor: '#90CAF9' }}>
            {totalOrders}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card title="Tổng User" style={{ backgroundColor: '#FFD54F' }}>
            {totalUsers}
          </Card>
        </Col>
      </Row>
      {/* Second Row */}
      <Row gutter={[16, 16]} className="dashboard-row">
        <Col xs={24} md={12}>
          <Card title="Biểu Đồ Doanh Thu" style={{ backgroundColor: '#B39DDB' }}>
            <Timeline>
              {/* Implement timeline items */}
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Top 5 Sản Phẩm Bán Chạy Nhất" style={{ backgroundColor: '#FFAB91' }}>
            {topProducts.map(product => (
              <p key={product.id}>{product.name} - {product.quantity}</p>
            ))}
          </Card>
        </Col>
      </Row>
      {/* Demo components */}
      <Row gutter={[16, 16]} className="dashboard-row">
        <Col span={24}>
          <Upload>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Col>
        <Col span={24}>
          <Button type="primary">Click me</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;