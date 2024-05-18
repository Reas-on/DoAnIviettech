import React, { useState, useEffect, useCallback } from 'react';
import { Card, Col, Row, Typography, Upload, Button, Select, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [topProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [viewMode, setViewMode] = useState('30days');
  const [dateRange, setDateRange] = useState([moment().subtract(30, 'days'), moment()]);

  useEffect(() => {
    fetchTotalProducts();
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

  const fetchTotalRevenue = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/orderData');
      if (!response.ok) {
        throw new Error('Failed to fetch total revenue');
      }
      const data = await response.json();
      const completedOrders = data.filter(order => order.status === 'completed');
      const revenue = completedOrders.reduce((total, order) => total + order.totalBill, 0);
      setTotalRevenue(revenue);
      setRevenueData(transformData(completedOrders, viewMode, dateRange));
    } catch (error) {
      console.error('Error fetching total revenue:', error);
    }
  }, [viewMode, dateRange]);

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
    // Implement fetching top products logic
  };

  const transformData = (orders, mode, range) => {
    const groupedData = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      if (mode === 'custom') {
        if (date < range[0].toDate() || date > range[1].toDate()) {
          return;
        }
      }
      let key;
      if (mode === '30days' || mode === '7days' || mode === 'custom') {
        key = date.toISOString().slice(0, 10); // yyyy-mm-dd
      } else if (mode === 'yearly') {
        key = date.getFullYear().toString(); // yyyy
      } else if (mode === 'monthly') {
        key = date.toISOString().slice(0, 7); // yyyy-mm
      }
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += order.totalBill;
    });

    return Object.entries(groupedData).map(([key, value]) => ({
      date: key,
      revenue: value,
    }));
  };

  const handleViewModeChange = (value) => {
    setViewMode(value);
    if (value === '30days') {
      setDateRange([moment().subtract(30, 'days'), moment()]);
    } else if (value === '7days') {
      setDateRange([moment().subtract(7, 'days'), moment()]);
    } else if (value === 'monthly') {
      setDateRange([moment().startOf('year'), moment()]);
    } else if (value === 'yearly') {
      setDateRange([moment().startOf('year'), moment()]);
    } else {
      setDateRange([moment().subtract(30, 'days'), moment()]);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setViewMode('custom');
  };

  useEffect(() => {
    fetchTotalRevenue();
  }, [fetchTotalRevenue]);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Dashboard</Title>
      <Row gutter={[16, 16]} className="dashboard-row">
        <Col xs={24} sm={12} md={6}>
          <Card title="Tổng Sản Phẩm" style={{ backgroundColor: '#FFCC80' }}>
            {totalProducts}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card title="Tổng Doanh Thu" style={{ backgroundColor: '#81C784' }}>
            {new Intl.NumberFormat('en-US').format(totalRevenue)} VND
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
      <Row gutter={[16, 16]} className="dashboard-row">
        <Col xs={24} md={12}>
          <Card title="Biểu Đồ Doanh Thu" style={{ backgroundColor: '#B39DDB' }}>
            <Select defaultValue="30days" onChange={handleViewModeChange} style={{ marginBottom: 20 }}>
              <Option value="30days">Last 30 Days</Option>
              <Option value="7days">Last 7 Days</Option>
              <Option value="monthly">Year to Date (Monthly)</Option>
              <Option value="yearly">Yearly</Option>
              <Option value="custom">Custom</Option>
            </Select>
            {viewMode === 'custom' && (
              <RangePicker onChange={handleDateRangeChange} style={{ marginBottom: 20 }} />
            )}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
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
