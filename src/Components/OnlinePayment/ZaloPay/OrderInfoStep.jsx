// src/Components/OnlinePayment/ZaloPay/OrderInfoStep.jsx
import React from "react";
import { Form, Input, Button } from "antd";

const OrderInfoStep = ({ totalCartAmount, onNext, setOrderInfo }) => {
  const saveOrderInfo = (values) => {
    setOrderInfo({ ...values, amount: totalCartAmount });
    onNext();
  };

  return (
    <div>
      <h2>Step 1: Thông Tin Đơn Hàng</h2>
      <Form layout="vertical" onFinish={saveOrderInfo}>
        <Form.Item
          label="Tên sản phẩm"
          name="productName"
          rules={[
            { required: true, message: "Vui lòng nhập tên sản phẩm!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả sản phẩm" name="productDescription">
          <Input.TextArea />
        </Form.Item>
        <p style={{ marginTop: 20 }}>
          Tổng tiền: {totalCartAmount.toLocaleString("en-US")} VND
        </p>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tiếp theo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderInfoStep;
