import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './css/TotalUsers.css';

const TotalUsers = () => {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  const fetchTotalUsers = async () => {
    try {
      const response = await fetch('https://kiemhieptinhduyen.one/users');
      if (!response.ok) {
        throw new Error('Failed to fetch total users');
      }
      const data = await response.json();
      setTotalUsers(data.length);
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
  };

  return (
    <Card className="total-users-card">
      <Row align="middle">
        <Col span={6}>
          <UserOutlined className="total-users-icon" />
        </Col>
        <Col span={18}>
          <h3 className="total-users-title">Total Users</h3>
          <p className="total-users-number">{totalUsers}</p>
        </Col>
      </Row>
    </Card>
  );
};

export default TotalUsers;
