import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './css/TotalOrders.css';

const TotalOrders = () => {
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchTotalOrders();
  }, []);

  const fetchTotalOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/orderData');
      if (!response.ok) {
        throw new Error('Failed to fetch total orders');
      }
      const data = await response.json();
      const completedOrders = data.filter(order => order.status === 'completed');
      setTotalOrders(completedOrders.length);
    } catch (error) {
      console.error('Error fetching total orders:', error);
    }
  };

  return (
    <Card className="total-orders-card">
      <Row align="middle">
        <Col span={6}>
          <ShoppingCartOutlined className="total-orders-icon" />
        </Col>
        <Col span={18}>
          <h3 className="total-orders-title">Total Orders</h3>
          <p className="total-orders-number">{totalOrders}</p>
        </Col>
      </Row>
    </Card>
  );
};

export default TotalOrders;
