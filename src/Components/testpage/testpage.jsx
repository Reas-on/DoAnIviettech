import React, { useState } from 'react';
import { Layout, Steps, Button, Form, Input, notification } from 'antd';

const { Header, Content } = Layout;
const { Step } = Steps;

const TestPage = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    receiverName: '',
    address: '',
    phone: '',
  });

  const [form] = Form.useForm();

  const steps = [
    {
      title: 'Thông Tin Đơn Hàng',
      content: (
        <Form form={form} layout="vertical" onFinish={values => {
          setFormData({ ...formData, ...values });
          next();
        }}>
          <Form.Item label="Tên sản phẩm" name="productName" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Tiếp</Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Thông Tin Người Nhận',
      content: (
        <Form form={form} layout="vertical" onFinish={values => {
          setFormData({ ...formData, ...values });
          next();
        }}>
          <Form.Item label="Tên người nhận" name="receiverName" rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Tiếp</Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Xác Nhận Đơn Hàng',
      content: (
        <div>
          <p><strong>Tên sản phẩm:</strong> {formData.productName}</p>
          <p><strong>Số lượng:</strong> {formData.quantity}</p>
          <p><strong>Tên người nhận:</strong> {formData.receiverName}</p>
          <p><strong>Địa chỉ:</strong> {formData.address}</p>
          <p><strong>Số điện thoại:</strong> {formData.phone}</p>
          <Button type="primary" onClick={() => handleFinish()}>Gửi</Button>
        </div>
      ),
    },
    {
      title: 'Thông Báo Đơn Hàng',
      content: (
        <div>
          <p>Đơn hàng của bạn đã được gửi thành công!</p>
        </div>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleFinish = () => {
    notification.success({
      message: 'Thành công',
      description: 'Đơn hàng của bạn đã được gửi thành công!',
    });
    setCurrent(current + 1);
  };

  return (
    <Layout>
      <Header style={{ color: 'white', textAlign: 'center', fontSize: '24px' }}>
        Đơn Đặt Hàng
      </Header>
      <Content style={{ padding: '70px 70px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Steps current={current}>
            {steps.map((item, index) => (
              <Step key={index} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content" style={{ marginTop: 24 }}>
            {steps[current].content}
          </div>
          <div className="steps-action" style={{ marginTop: 24 }}>
            {current > 0 && current < steps.length - 1 && (
              <Button style={{ marginRight: 8 }} onClick={() => prev()}>
                Quay lại
              </Button>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default TestPage;
