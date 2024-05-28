import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Steps, Button, message, Form, Input, List, Descriptions, Spin, Result, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalCartAmount } from '../../Redux/ShopSlice';
import { fetchUserInfo } from '../../Redux/Thunk/fetchUserInfo';
import { submitOrder } from '../../Redux/admin/adminorderdata';

const { Step } = Steps;
const { Title } = Typography;

const OnlineMoMo = () => {
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const cartItems = useSelector(selectCartItems);
  const allProducts = useSelector((state) => state.shop.allProducts);
  const userId = useSelector((state) => state.shop.user?.userId);
  const userName = useSelector((state) => state.shop.user?.name);
  const address = useSelector((state) => state.shop.user?.address);
  const phoneNumber = useSelector((state) => state.shop.user?.phone);
  const email = useSelector((state) => state.shop.user?.email);
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0);
  const [formValues, setFormValues] = useState({
    receiverName: userName || "",
    deliveryAddress: address || "",
    phoneNumber: phoneNumber || "",
    email: email || "",
    note: "",
    PaymentMethodChangeEvent: "MOMO PAYMENT",
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isValid, setIsValid] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (token) {
          await dispatch(fetchUserInfo(token));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setFormValues({
      receiverName: userName || "",
      deliveryAddress: address || "",
      phoneNumber: phoneNumber || "",
      email: email || "",
      note: "",
      PaymentMethodChangeEvent: "MOMO PAYMENT",
    });
  }, [userName, address, phoneNumber, email]);

  const checkPaymentStatus = useCallback((resultCode) => {
    switch (resultCode) {
      case "0":
        setPaymentStatus('Thanh toán thành công');
        break;
      default:
        setPaymentStatus(`Thanh toán thất bại với mã lỗi: ${resultCode}`);
        break;
    }
  }, []);

  useEffect(() => {
    const handleSubmit = async (orderData) => {
      try {
        const isValidOrderData = orderData.orderedProducts.every(item => item.name && item.image && item.total !== null);
        
        if (!isValidOrderData) {
          throw new Error("OrderData validation failed: orderedProducts fields are missing.");
        }
    
        await dispatch(submitOrder(orderData)).unwrap();
        const token = localStorage.getItem("auth-token");
        await fetch('http://localhost:4000/api/cartreset', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
          body: JSON.stringify({ userId: userId }),
        });
        console.log('Order and cart reset successfully');
        message.success('Order submitted and cart reset successfully.');
      } catch (error) {
        console.error('Failed to submit order:', error);
        message.error('Failed to submit order. Please try again.');
      }
    };
    

    const params = new URLSearchParams(location.search);
    const resultCode = params.get('resultCode');
    if (resultCode) {
      setCurrent(2);
      checkPaymentStatus(resultCode);
      setPaymentDetails({
        amount: params.get('amount'),
        orderInfo: params.get('orderInfo'),
        transId: params.get('transId'),
        responseTime: new Date(parseInt(params.get('responseTime'))).toLocaleString(),
      });

      const orderId = params.get('orderId');
      fetch('http://localhost:4000/momo/checkmomopayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.resultCode === 0) {
            setIsValid(true);
            const orderData = {
              userId,
              receiverName: formValues.receiverName,
              deliveryAddress: formValues.deliveryAddress,
              phoneNumber: formValues.phoneNumber,
              email: formValues.email,
              note: formValues.note,
              orderedProducts: cartItems.map(item => ({
                name: item.name,
                image: item.image,
                quantity: item.quantity,
                total: item.price * item.quantity
              })),
              PaymentMethodChangeEvent: formValues.PaymentMethodChangeEvent,
              totalBill: totalCartAmount,
              status: 'pending',
            };
            setOrderDetails(orderData);
            handleSubmit(orderData);
          } else {
            setIsValid(false);
          }
        })
        .catch(error => {
          console.error('There was an error verifying the payment!', error);
          setIsValid(false);
        });
    }
  }, [location, checkPaymentStatus, cartItems, dispatch, formValues, totalCartAmount, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:4000/momo/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalCartAmount,
          orderInfo: 'Kuromi Payment',
        }),
      });
      const data = await response.json();
      const { payUrl } = data;
      window.location.href = payUrl;
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Payment failed. Please try again.');
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
      title: 'Thông Tin Đơn Hàng',
      content: (
        <div>
          {Object.values(cartItems).map((item) => {
            const product = allProducts.find((p) => p.id === item.productId);
            if (product && item.quantity > 0) {
              return (
                <Descriptions.Item
                  key={item._id}
                  label="Sản phẩm đã đặt"
                  span={3}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={[product]}
                    renderItem={(product) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{ width: 50 }}
                            />
                          }
                          title={`${product.name} - Size: ${item.size}`}
                          description={`Số lượng: ${item.quantity} - Tổng giá: ${(product.new_price * item.quantity).toLocaleString("en-US")} VND`}
                        />
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
              );
            } else {
              return null;
            }
          })}
          <p style={{ marginTop: 20 }}>
            Tổng tiền: {totalCartAmount.toLocaleString("en-US")} VND
          </p>
        </div>
      ),
    },
    {
      title: 'Thông Tin Người Nhận',
      content: (
        <Form
          name="order-form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          initialValues={formValues}
          onFinish={handlePayment}
        >
          <Form.Item
            label="Tên Người Nhận"
            name="receiverName"
            rules={[
              { required: true, message: "Please input your receiver name!" },
            ]}
          >
            <Input
              name="receiverName"
              onChange={handleInputChange}
              value={formValues.receiverName}
            />
          </Form.Item>
          <Form.Item
            label="Địa Chỉ Giao Hàng"
            name="deliveryAddress"
            rules={[
              {
                required: true,
                message: "Please input your delivery address!",
              },
            ]}
          >
            <Input
              name="deliveryAddress"
              onChange={handleInputChange}
              value={formValues.deliveryAddress}
            />
          </Form.Item>
          <Form.Item
            label="Số Điện Thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input
              name="phoneNumber"
              onChange={handleInputChange}
              value={formValues.phoneNumber}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              { required: true, message: "Please input your E-mail!" },
            ]}
          >
            <Input
              name="email"
              onChange={handleInputChange}
              value={formValues.email}
            />
          </Form.Item>
          <Form.Item label="Ghi Chú" name="note">
            <Input.TextArea
              name="note"
              onChange={handleInputChange}
              value={formValues.note}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Thanh Toán
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Kết Quả Thanh Toán',
      content: (
        <div>
          {paymentStatus ? (
            <Result
              status={isValid ? 'success' : 'error'}
              title={paymentStatus}
              subTitle={`Mã giao dịch: ${paymentDetails.transId}`}
              extra={[
                <Descriptions title="Thông Tin Đơn Hàng" bordered key="orderDetails">
                  <Descriptions.Item label="Tên Người Nhận">{orderDetails?.receiverName}</Descriptions.Item>
                  <Descriptions.Item label="Số Điện Thoại">{orderDetails?.phoneNumber}</Descriptions.Item>
                  <Descriptions.Item label="Địa Chỉ Giao Hàng">{orderDetails?.deliveryAddress}</Descriptions.Item>
                  <Descriptions.Item label="Ghi Chú">{orderDetails?.note}</Descriptions.Item>
                  <Descriptions.Item label="Phương Thức Thanh Toán">{orderDetails?.PaymentMethodChangeEvent}</Descriptions.Item>
                  <Descriptions.Item label="Tổng Tiền">{orderDetails?.totalBill.toLocaleString("en-US")} VND</Descriptions.Item>
                  <Descriptions.Item label="Trạng Thái">{orderDetails?.status}</Descriptions.Item>
                  <Descriptions.Item label="Sản Phẩm Đã Đặt">
                    <List
                      itemLayout="horizontal"
                      dataSource={orderDetails?.orderedProducts}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: 50 }}
                              />
                            }
                            title={`${item.name} - Số lượng: ${item.quantity}`}
                            description={`Tổng giá: ${(item.total).toLocaleString("en-US")} VND`}
                          />
                        </List.Item>
                      )}
                    />
                  </Descriptions.Item>
                </Descriptions>,
              ]}
            />
          ) : (
            <Spin tip="Đang kiểm tra trạng thái thanh toán..." />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Thanh Toán Online qua MoMo</Title>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            {current === 0 ? "Next" : "Thanh Toán"}
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && current < steps.length - 1 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnlineMoMo;
