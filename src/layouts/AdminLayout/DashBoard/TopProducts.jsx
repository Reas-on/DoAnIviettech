import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'antd';

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const ordersResponse = await fetch('https://kiemhieptinhduyen.one/orderData');
      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch order data');
      }

      const orders = await ordersResponse.json();
      const completedOrders = orders.filter(order => order.status === 'completed');

      const productCount = {};
      completedOrders.forEach(order => {
        order.orderedProducts.forEach(product => {
          const productId = product.productId;
          if (!productCount[productId]) {
            productCount[productId] = {
              name: product.name.replace(/\[.*?\]\s*/, ''), 
              image: product.image, 
              quantity: 0,
              totalRevenue: 0
            };
          }
          productCount[productId].quantity += product.quantity;
          productCount[productId].totalRevenue += product.total;
        });
      });

      const sortedProducts = Object.entries(productCount)
        .sort(([, a], [, b]) => b.quantity - a.quantity)
        .slice(0, 5)
        .map(([id, { name, image, quantity, totalRevenue }]) => ({ id, name, image, quantity, totalRevenue }));

      setTopProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  return (
    <div className="top-products-container">
      <h3>Top Products</h3>
      {topProducts.map(product => (
        <Card key={product.id} className="product-card" title={product.name}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            </Col>
            <Col span={16}>
              <Row>
                <Col span={24}>
                  <p>Total Revenue: {product.totalRevenue} VND</p>
                </Col>
                <Col span={24}>
                  <p>Quantity Sold: {product.quantity}</p>
                </Col>
              </Row>
              <Row justify="end">
                <Col>
                  <Button type="primary" style={{ marginRight: '8px', marginBottom: '8px' }}>Edit</Button>
                </Col>
                <Col>
                  <Button type="default" style={{ marginBottom: '8px' }}>View</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default TopProducts;
