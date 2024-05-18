import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Typography, List, Form, Input, Button } from 'antd';

const { Title } = Typography;

const OrderDetail = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/orderData/${orderNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order detail');
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const updateOrderStatus = async (values) => {
    const { message } = values;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/orderData/${order._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Order Detail</Title>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <p><strong>Order Number:</strong> {order.orderNumber}</p>
            <p><strong>Receiver Name:</strong> {order.receiverName}</p>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
            <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          </Col>
          <Col span={12}>
            <p><strong>Total Bill:</strong> {new Intl.NumberFormat('en-US').format(order.totalBill)} VND</p>
            <p><strong>Note:</strong> {order.note}</p>
          </Col>
        </Row>
        <Title level={4}>Ordered Products</Title>
        <List
          itemLayout="horizontal"
          dataSource={order.orderedProducts}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<img src={item.image} alt={item.name} style={{ width: '50px' }} />}
                title={item.name}
                description={`Quantity: ${item.quantity} | Total: ${new Intl.NumberFormat('en-US').format(item.total)} VND`}
              />
            </List.Item>
          )}
        />
        <Title level={4}>Logs</Title>
        <List
          itemLayout="vertical"
          dataSource={order.logs}
          renderItem={log => (
            <List.Item>
              <List.Item.Meta
                description={`[${new Date(log.timestamp).toLocaleString()}] ${log.message}`}
              />
            </List.Item>
          )}
        />
        <Title level={4}>Update Status</Title>
        <Form onFinish={updateOrderStatus} layout="vertical">
          <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Please enter a message' }]}>
            <Input placeholder="Enter a message for the log" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Status
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OrderDetail;
