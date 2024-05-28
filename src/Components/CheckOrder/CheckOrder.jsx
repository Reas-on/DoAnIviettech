import React, { useState } from 'react';
import { Input, Button, Card, message } from 'antd';
import moment from 'moment';
import { fetchOrderData } from '../../Api/CheckOrderApi';

const CheckOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const handleCheckOrder = async () => {
    try {
      const data = await fetchOrderData(orderNumber);
      setOrderData(data);
      setIsPhoneVerified(false);
    } catch (error) {
      message.error('Order not found');
      setOrderData(null);
    }
  };

  const handleVerifyPhone = () => {
    if (orderData && orderData.phoneNumber === phoneNumber) {
      setIsPhoneVerified(true);
    } else {
      message.error('Incorrect phone number');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title='Check Your Order'>
        <Input
          placeholder='Enter your order number'
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Button type='primary' onClick={handleCheckOrder}>
          Check Order
        </Button>
      </Card>
      {orderData && (
        <Card title={`Order Details: ${orderNumber}`} style={{ marginTop: '20px' }}>
          <p>
            <strong>Order Number:</strong> {orderData.orderNumber}
          </p>
          <p>
            <strong>Total Bill:</strong> {new Intl.NumberFormat('en-US').format(orderData.totalBill)} VND
          </p>
          <p>
            <strong>Status:</strong> {orderData.status}
          </p>
          <p>
            <strong>Payment Method:</strong> {orderData.PaymentMethodChangeEvent}
          </p>
          <p>
            <strong>Ordered Products:</strong>
          </p>
          <ul>
            {orderData.orderedProducts.map((product) => (
              <li key={product._id}>
                {product.name} - {product.quantity} pcs
              </li>
            ))}
          </ul>
          <p>
            <strong>Log:</strong>
          </p>
          <ul>
            {orderData.logs.map((log, index) => (
              <li key={index}>
                {moment(log.timestamp).format('DD-MM | HH:mm')} - {log.message}
              </li>
            ))}
          </ul>
          {!isPhoneVerified && (
            <div style={{ marginTop: '20px' }}>
              <Input
                placeholder='Enter your phone number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <Button type='primary' onClick={handleVerifyPhone}>
                Verify Phone Number
              </Button>
            </div>
          )}
          {isPhoneVerified && (
            <>
              <p>
                <strong>Receiver Name:</strong> {orderData.receiverName}
              </p>
              <p>
                <strong>Delivery Address:</strong> {orderData.deliveryAddress}
              </p>
              <p>
                <strong>Phone Number:</strong> {orderData.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {orderData.email}
              </p>
              <p>
                <strong>Note:</strong> {orderData.note}
              </p>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default CheckOrder;
