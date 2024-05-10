import React from 'react';
import { Card, Col, Row, Typography, Upload, message, Button, Timeline, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons'; // Import UploadOutlined icon

const { Title } = Typography;

const Dashboard = () => {
  // Mock data
  const totalProducts = 100;
  const totalRevenue = 5000;
  const totalOrders = 50;
  const totalUsers = 200;
  const topProducts = [
    { id: 1, name: 'Product A', quantity: 100 },
    { id: 2, name: 'Product B', quantity: 90 },
    { id: 3, name: 'Product C', quantity: 80 },
    { id: 4, name: 'Product D', quantity: 70 },
    { id: 5, name: 'Product E', quantity: 60 }
  ];

  // Demo functions
  const handleUpload = () => {
    message.success('Upload successful');
  };

  const handleClickButton = () => {
    message.info('Button clicked');
  };

  const handleChangeRadio = (e) => {
    message.info(`Radio selected: ${e.target.value}`);
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
              <Timeline.Item color="green">Create a CV</Timeline.Item>
              <Timeline.Item color="green">Sign the contract</Timeline.Item>
              <Timeline.Item color="red">
                Support the project
                <p>Currently in review</p>
              </Timeline.Item>
              <Timeline.Item color="gray">
                Refund
                <p>Successful completion</p>
              </Timeline.Item>
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
          <Upload beforeUpload={handleUpload}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={handleClickButton}>Click me</Button>
        </Col>
        <Col span={24}>
          <Radio.Group onChange={handleChangeRadio}>
            <Radio value={1}>Option 1</Radio>
            <Radio value={2}>Option 2</Radio>
            <Radio value={3}>Option 3</Radio>
          </Radio.Group>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
