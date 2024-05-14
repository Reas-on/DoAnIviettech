import React from 'react';
import { Button, Form, Input, Select, message } from 'antd';

const AddUser = () => {
  const [form] = Form.useForm();
  const onFinish = async () => {
    try {
      // Thu thập dữ liệu từ form
      const formData = await form.validateFields();

      // Tạo cartData theo mẫu
      let cart = {};
      for (let i = 0; i < 300; i++) {
        cart[i.toString()] = 0;
      }

      // Chuyển đổi dữ liệu formData để phù hợp với schema
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        isAdmin: formData.isAdmin === 'true' ? true : false, // Chuyển đổi từ string sang boolean
        cartData: cart // Thêm cartData vào dữ liệu người dùng
      };

      // Gửi dữ liệu lên máy chủ
      const response = await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        message.success('Registration successful!');
        form.resetFields();
      } else {
        throw new Error('Failed to register user');
      }
    } catch (error) {
      console.error('Error when submitting registration data:', error);
      message.error('An error occurred, please try again later!');
    }
  };



  return (
    <div className="add-user">
      <h2>Add User</h2>
      <Form
        form={form}
        name="addUserForm"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Customer Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter customer name' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Role"
          name="isAdmin"
          rules={[
            { required: true, message: 'Please select a role' }
          ]}
        >
          <Select>
            <Select.Option value="true">Admin</Select.Option>
            <Select.Option value="false">User</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: 'email', message: 'Invalid email' },
            { required: true, message: 'Please enter email' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter password' }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            { required: true, message: 'Please enter address' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: 'Please enter phone number' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUser;