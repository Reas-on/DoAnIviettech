import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import './PaymentForm.scss';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
    required: 'Name is required!',
    types: {
      email: 'Your input is not a valid email!',
      number: 'Your input is not a valid number!',
    },
    number: {
      range: '{Your input must be between {min} and {max}',
    },
  };
  

const PaymentForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await fetch('https://vnexpress.net/microservice/location/static/province');
      if (!response.ok) {
        throw new Error('Failed to fetch provinces');
      }
      const data = await response.json();
      setProvinces(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <div className='form-container'>
      <div className='form-wrapper'>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'age']} label="Age" rules={[{ type: 'number', min: 0, max: 99 }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={['user', 'province']} label="Province">
            <Select loading={loading}>
              {provinces.map(province => (
                <Option key={province.id} value={province.name}>{province.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={['user', 'Note']} label="Note">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PaymentForm;
