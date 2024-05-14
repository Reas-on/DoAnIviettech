import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Steps, Button, Input, message } from 'antd';
import { useLocation } from 'react-router-dom';

const { Step } = Steps;

const TestPayment = () => {
  const [current, setCurrent] = useState(0);
  const [amount, setAmount] = useState(300000);
  const [orderInfo, setOrderInfo] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resultCode = params.get('resultCode');
    if (resultCode) {
      setCurrent(2); // Chuyển đến bước hiển thị trạng thái thanh toán
      checkPaymentStatus(resultCode);
    }
  }, [location]);

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:4000/momo/payment', { amount });
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
        <div>
          <label>Order Information:</label>
          <Input 
            type="text" 
            value={orderInfo} 
            onChange={(e) => setOrderInfo(e.target.value)} 
          />
          <label>Total Amount:</label>
          <Input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
        </div>
      ),
    },
    {
      title: 'Confirm Order',
      content: (
        <div>
          <p>Order Information: {orderInfo}</p>
          <p>Total Amount: {amount}</p>
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
    <div>
      <Steps current={current}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
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
    </div>
  );
};

export default TestPayment;
