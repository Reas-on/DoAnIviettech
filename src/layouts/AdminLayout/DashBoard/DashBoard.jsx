import React from 'react';
import { Row, Col } from 'antd';
import TotalProducts from './TotalProducts';
import TotalRevenue from './TotalRevenue';
import TotalOrders from './TotalOrders';
import TotalUsers from './TotalUsers';
import TopProducts from './TopProducts';
import RevenueChart from './RevenueChart';

const Dashboard = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}><TotalProducts /></Col>
        <Col span={6}><TotalRevenue /></Col>
        <Col span={6}><TotalOrders /></Col>
        <Col span={6}><TotalUsers /></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}><TopProducts /></Col>
        <Col span={12}><RevenueChart /></Col>
      </Row>
    </div>
  );
};

export default Dashboard;
