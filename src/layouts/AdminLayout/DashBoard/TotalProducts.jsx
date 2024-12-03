import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './css/TotalProducts.css';

const TotalProducts = () => {
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchTotalProducts();
  }, []);

  const fetchTotalProducts = async () => {
    try {
      const response = await fetch('https://kiemhieptinhduyen.one/product/allproducts');
      if (!response.ok) {
        throw new Error('Failed to fetch total products');
      }
      const data = await response.json();
      setTotalProducts(data.length);
    } catch (error) {
      console.error('Error fetching total products:', error);
    }
  };

  return (
    <Card className="total-products-card">
      <Row align="middle">
        <Col span={6}>
          <MenuOutlined className="total-products-icon" style={{ fontSize: '24px', color: 'white' }} />
        </Col>
        <Col span={18}>
          <h3 className="total-products-title">Total Products</h3>
          <p className="total-products-number">{totalProducts}</p>
        </Col>
      </Row>
    </Card>
  );
};

export default TotalProducts;
