import React, { useEffect, useState } from 'react';
import { Button, Result, Card, Typography, Spin } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [isValid, setIsValid] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const orderId = queryParams.get('orderId');

    // Gọi API để kiểm tra thông tin đơn hàng
    axios.post('http://localhost:4000/momo/checkmomopayment', { orderId })
      .then(response => {
        if (response.data.resultCode === 0) {
          setIsValid(true);
          setOrderDetails(response.data);
        } else {
          setIsValid(false);
        }
      })
      .catch(error => {
        console.error('There was an error verifying the payment!', error);
        setIsValid(false);
      });
  }, [queryParams]);

  if (isValid === null) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isValid) {
    return (
      <Result
        status="error"
        title="Payment Verification Failed"
        subTitle="The order ID or payment details are invalid."
        extra={[
          <Button type="primary" key="console">
            Go to Console
          </Button>,
          <Button key="buy">Try Again</Button>,
        ]}
      />
    );
  }

  const formatResponseTime = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleString();
  };

  return (
    <Result
      status="success"
      title="Payment Successful"
      subTitle="Thank you for your purchase. Your order has been successfully processed."
      extra={[
        <Button type="primary" key="console">
          Go to Console
        </Button>,
        <Card key="params" style={{ marginTop: '20px', textAlign: 'left' }}>
          <Title level={4}>Payment Details:</Title>
          <div style={{ marginBottom: '10px' }}>
            <Text strong>Response Time:</Text> {formatResponseTime(queryParams.get('responseTime'))}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Text strong>Order Info:</Text> {queryParams.get('orderInfo')}
          </div>
          <Title level={4} style={{ marginTop: '20px' }}>Order Details from Server:</Title>
          <div style={{ marginBottom: '10px' }}>
            <Text strong>Transaction ID:</Text> {orderDetails.transId}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Text strong>Amount:</Text> {orderDetails.amount}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Text strong>Payment Type:</Text> {orderDetails.payType}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Text strong>Message:</Text> {orderDetails.message}
          </div>
        </Card>
      ]}
    />
  );
}

export default PaymentSuccess;
