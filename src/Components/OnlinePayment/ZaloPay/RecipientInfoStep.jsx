// src/Components/OnlinePayment/ZaloPay/RecipientInfoStep.jsx
import React from "react";
import { Form, Input, Button, message } from "antd"; 

const RecipientInfoStep = ({ onPrev, onNext, createZaloPayment, orderInfo }) => {
  const saveRecipientInfo = async (values) => {
    try {
      const paymentData = await createZaloPayment(orderInfo);

      if (paymentData.return_code === 1) {
        message.success("Thanh toán thành công!");
        window.location.href = paymentData.order_url;
        onNext();
      } else {
        message.error("Thanh toán không thành công!");
        message.error("Thanh toán không thành công!");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Có lỗi xảy ra trong quá trình thanh toán!");
    }
  };

  return (
    <div>
      <h2>Step 2: Thông Tin Người Nhận và Thanh Toán</h2>
      <Form layout="vertical" onFinish={saveRecipientInfo}>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button onClick={onPrev}>Quay lại</Button>
          <Button type="primary" htmlType="submit">
            Thanh toán
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RecipientInfoStep;
