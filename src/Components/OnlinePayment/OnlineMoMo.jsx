import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Steps, Button, message, Card } from 'antd';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectTotalCartAmount } from '../../Redux/ShopSlice';
const { Step } = Steps;

const OnlineMomoPayment  = () => {
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const [current, setCurrent] = useState(0);
  const [orderInfo] = useState('Kuromi Payment'); 
  const [paymentStatus, setPaymentStatus] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resultCode = params.get('resultCode');
    if (resultCode) {
      setCurrent(2); 
      checkPaymentStatus(resultCode);
    }
  }, [location]);

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:4000/momo/payment', {
        amount: totalCartAmount, 
        orderInfo: orderInfo,
      });
      const { payUrl } = response.data;
      window.location.href = payUrl;
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Payment failed. Please try again.');
    }
  };

  const checkPaymentStatus = (resultCode) => {
    switch (resultCode) {
      case "0":
        setPaymentStatus('Thanh toán thành công');
        break;
      case "5":
        setPaymentStatus('Người dùng đã hủy giao dịch');
        break;
      case "9":
        setPaymentStatus('Thông tin đơn hàng không hợp lệ');
        break;
      case "11":
        setPaymentStatus('Giao dịch bị từ chối bởi hệ thống ngân hàng');
        break;
      case "12":
        setPaymentStatus('Giao dịch bị từ chối do không đủ số dư');
        break;
      case "13":
        setPaymentStatus('Giao dịch bị từ chối bởi Momo');
        break;
      default:
        setPaymentStatus(`Thanh toán thất bại với mã lỗi: ${resultCode}`);
        break;
    }
  };
  const next = () => {
    if (current === 1) {
      handlePayment();
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Order Information',
      content: (
        <div className="mb-3">
          <label className="form-label">Order Information:</label>
          <p>{orderInfo}</p> 
          <label className="form-label mt-3">Total Amount:</label>
          <p>{totalCartAmount}</p>
        </div>
      ),
    },
    {
      title: 'Confirm Order',
      content: (
        <div>
          <p>Order Information: {orderInfo}</p>
          <p>Total Amount: {totalCartAmount}</p>
        </div>
      ),
    },
    {
      title: 'Payment Status',
      content: paymentStatus ? (
        <div>
          <h2>Payment Status</h2>
          <p>{paymentStatus}</p>
        </div>
      ) : (
        <div>
          <h2>Waiting for payment status...</h2>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Card className="w-50">
        <Steps current={current} className="mb-4">
          {steps.map((item, index) => (
            <Step key={index} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action text-center mt-4">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next} className="me-2">
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={prev}>
              Previous
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OnlineMomoPayment ;


