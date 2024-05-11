import React, { useState, useEffect } from "react";
import { Form, Input, Button, Steps } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectTotalCartAmount } from "../../Redux/ShopSlice";
import { fetchCartItems } from "../../Redux/Thunk/fetchCartItems"; // Import fetchCartItems action

const { Step } = Steps;

const OrderCart = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    receiverName: "",
    deliveryAddress: "",
    phoneNumber: "",
    email: "", // Add email key
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const cartItems = useSelector(selectCartItems);
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const allProducts = useSelector((state) => state.shop.allProducts);
  const dispatch = useDispatch(); // Initialize useDispatch hook

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:4000/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        const { name, address, phone, email, _id } = data;
        setFormValues({
          receiverName: name,
          deliveryAddress: address,
          phoneNumber: phone,
          email: email,
        });
        setUserId(_id);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async () => {
    setLoading(true);
    const { receiverName, deliveryAddress, phoneNumber, email, note } =
      formValues;
    const orderedProducts = Object.keys(cartItems)
      .map((itemId) => {
        const item = allProducts.find(
          (product) => product.id === parseInt(itemId)
        );
        const quantity = cartItems[itemId];
        if (item && quantity > 0) {
          return {
            name: item.name,
            image: item.image,
            quantity: quantity,
            total: item.new_price * quantity,
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
    };

    try {
      const response = await fetch("http://localhost:4000/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        console.error("Error submitting order:", response.statusText);
        setLoading(false);
        return;
      }
      console.log("Order submitted successfully!", formData);
      const data = await response.json();
      setTimeout(() => {
        setLoading(false);
        setOrderData(data);
        setOrderPlaced(true);
        dispatch(fetchCartItems());
      }, 3000);
    } catch (error) {
      console.error("Error submitting order:", error.message);
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
          <h2>Sản Phẩm Đã Đặt</h2>
          {Object.keys(cartItems).map((itemId) => {
            const item = allProducts.find(
              (product) => product.id === parseInt(itemId)
            );
            const quantity = cartItems[itemId];
            if (item && quantity > 0) {
              return (
                <div key={item.id}>
                  <p>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 50 }}
                    />
                    {item.name} - Số lượng : {quantity}
                  </p>
                  <p>
                    {(item.new_price * quantity).toLocaleString("en-US")} VND
                  </p>
                </div>
              );
            } else {
              return null;
            }
          })}
          <p>Tổng tiền: {totalCartAmount.toLocaleString("en-US")} VND</p>
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
            <Input name="receiverName" onChange={handleInputChange} />
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
            <Input name="deliveryAddress" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item
            label="Số Điện Thoại"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input name="phoneNumber" onChange={handleInputChange} />
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
            <Input name="email" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Ghi Chú" name="note">
            <Input.TextArea name="note" onChange={handleInputChange} />
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
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={nextStep}>
            Tiếp theo
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={onFinish}>
            Đặt Hàng
          </Button>
        )}
        {currentStep > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={prevStep}>
            Quay lại
          </Button>
        )}
      </div>
      {orderPlaced && orderData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Thông Tin Đơn Hàng Đã Đặt</h2>
          <p>Order Number: {orderData.orderNumber}</p>
          <p>Người nhận: {orderData.receiverName}</p>
          <p>Địa chỉ giao hàng: {orderData.deliveryAddress}</p>
          <p>Số điện thoại: {orderData.phoneNumber}</p>
          <p>Email: {orderData.email}</p>
          <p>Ghi chú: {orderData.note}</p>
          <p>Trạng Thái : {orderData.status}</p>
          <h3>Sản phẩm đã đặt:</h3>
          <ul>
            {orderData.orderedProducts.map((product) => (
              <li key={product._id.$oid}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 50 }}
                />
                {product.name} - Số lượng: {product.quantity} - Tổng giá:{" "}
                {product.total.toLocaleString("en-US")} VND
              </li>
            ))}
          </ul>
          <p>Tổng hóa đơn: {orderData.totalBill.toLocaleString("en-US")} VND</p>
        </div>
      )}
    </div>
  );
};

export default OrderCart;
