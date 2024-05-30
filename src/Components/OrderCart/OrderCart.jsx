import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Steps,
  Descriptions,
  List,
  Tag,
  message,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectTotalCartAmount } from "../../Redux/ShopSlice";
import { fetchCartItems } from "../../Redux/Thunk/fetchCartItems";
import { fetchUserInfo } from "../../Redux/Thunk/fetchUserInfo";
import { submitOrder } from "../../Redux/admin/adminorderdata";

const { Step } = Steps;

const OrderCart = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    receiverName: "",
    deliveryAddress: "",
    phoneNumber: "",
    email: "",
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const cartItems = useSelector(selectCartItems);
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const allProducts = useSelector((state) => state.shop.allProducts);
  const userId = useSelector((state) => state.shop.user?.userId);
  const userName = useSelector((state) => state.shop.user?.name);
  const address = useSelector((state) => state.shop.user?.address);
  const phoneNumber = useSelector((state) => state.shop.user?.phone);
  const email = useSelector((state) => state.shop.user?.email);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (token) {
          await dispatch(fetchUserInfo(token));
          setUserDataLoaded(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (userDataLoaded) {
      setFormValues({
        receiverName: userName || "",
        deliveryAddress: address || "",
        phoneNumber: phoneNumber || "",
        email: email || "",
        note: "",
      });
    }
  }, [userDataLoaded, userName, address, phoneNumber, email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const nextStep = () => {
    if (currentStep === 0 && Object.keys(cartItems).length === 0) {
      message.error("Không có sản phẩm trong giỏ hàng.");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const canProceedToNextStep = () => {
    if (currentStep === 0) {
      return Object.keys(cartItems).length > 0;
    } else {
      const { receiverName, deliveryAddress, phoneNumber, email } = formValues;
      return receiverName && deliveryAddress && phoneNumber && email;
    }
  };

  const onFinish = async () => {
    setLoading(true);
    const { receiverName, deliveryAddress, phoneNumber, email, note } =
      formValues;
  
    const orderedProducts = Object.values(cartItems)
      .map((cartItem) => {
        const product = allProducts.find((p) => p.id === cartItem.productId);
        if (product && cartItem.quantity > 0) {
          return {
            name: `[ Size : ${cartItem.size} ] ` + product.name,
            image: product.image,
            quantity: cartItem.quantity,
            total: product.new_price * cartItem.quantity,
          };
        }
        return null;
      })
      .filter((item) => item !== null);
  
    const totalBill = totalCartAmount;
    const formData = {
      userId: userId,
      receiverName: receiverName,
      deliveryAddress: deliveryAddress,
      phoneNumber: phoneNumber,
      email: email,
      note: note,
      orderedProducts: orderedProducts,
      totalBill: totalBill,
      PaymentMethodChangeEvent: "Thanh Toán Nhận Hàng",
      status: "pending",
    };
  
    try {
      const authToken = localStorage.getItem("auth-token");
      if (authToken) {
        await fetch("http://localhost:4000/api/cartreset", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
          body: JSON.stringify({ userId: userId }),
        });
      } else {
        localStorage.removeItem("cartItems");
      }
      const data = await dispatch(submitOrder(formData));
      setLoading(false);
      setOrderData(data.payload);
      setOrderPlaced(true);
      dispatch(fetchCartItems());
    } catch (error) {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  const steps = [
    {
      title: "Thông Tin Đơn Hàng",
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
                          description={`Số lượng: ${
                            item.quantity
                          } - Tổng giá: ${(
                            product.new_price * item.quantity
                          ).toLocaleString("en-US")} VND`}
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
      title: "Thông Tin Người Nhận",
      content: (
        <Form
          name="order-form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          initialValues={formValues}
          onFinish={onFinish}
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
                required: true,
                message: "Please input a valid email address!",
              },
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
        </Form>
      ),
    },
    {
      title: "Xác Nhận Đơn Hàng",
      content: (
        <div>
          <h2>Xác nhận đơn hàng</h2>
          <p>Bạn đã sẵn sàng để đặt hàng?</p>
        </div>
      ),
    },
    {
      title: "Đặt Hàng Thành Công",
    },
  ];

  return (
    <div style={{ padding: "50px" }}>
      <Steps current={currentStep}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>
      <div className="steps-action" style={{ marginTop: "20px" }}>
        {currentStep < steps.length - 2 && (
          <Button
            type="primary"
            onClick={nextStep}
            disabled={!canProceedToNextStep()}
          >
            Tiếp tục
          </Button>
        )}
        {currentStep === steps.length - 2 && (
          <Button
            type="primary"
            onClick={() => {
              onFinish();
              nextStep();
            }}
          >
            Đặt Hàng
          </Button>
        )}

        {currentStep === steps.length - 2 && (
          <Button style={{ margin: "0 8px" }} onClick={prevStep}>
            Quay lại
          </Button>
        )}
      </div>
      {orderPlaced && orderData && (
        <div style={{ marginTop: "20px" }}>
          <Descriptions title="Thông Tin Đơn Hàng Đã Đặt" bordered>
            <Descriptions.Item label="Order Number">
              {orderData.orderNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Người nhận">
              {orderData.receiverName}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ giao hàng">
              {orderData.deliveryAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {orderData.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {orderData.email}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {orderData.note}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng Thái">
              <Tag color={orderData.status === "Đã Giao" ? "green" : "blue"}>
                {orderData.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Sản phẩm đã đặt" span={3}>
              <List
                itemLayout="horizontal"
                dataSource={orderData.orderedProducts}
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
                      title={`${product.name}`}
                      description={`Số lượng: ${
                        product.quantity
                      } - Tổng giá: ${product.total.toLocaleString(
                        "en-US"
                      )} VND`}
                    />
                  </List.Item>
                )}
              />
            </Descriptions.Item>

            <Descriptions.Item label="Tổng hóa đơn" span={3}>
              {orderData.totalBill &&
                orderData.totalBill.toLocaleString("en-US")}{" "}
              VND
            </Descriptions.Item>
          </Descriptions>
          <Button type="primary" href="/" style={{ marginTop: "20px" }}>
            {" "}
            Back to Home{" "}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderCart;
