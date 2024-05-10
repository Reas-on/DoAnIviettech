import React, { useState, useEffect } from "react";
import { Form, Input, Button, Steps } from "antd";
import { useSelector } from "react-redux";
import { selectCartItems, selectTotalCartAmount } from "../../Redux/ShopSlice";

const { Step } = Steps;

const OrderCart = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    receiverName: "",
    deliveryAddress: "",
    phoneNumber: "",
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const cartItems = useSelector(selectCartItems);
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const allProducts = useSelector((state) => state.shop.allProducts);

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
        const { name, address, phone, _id } = data;
        setFormValues({
          receiverName: name,
          deliveryAddress: address,
          phoneNumber: phone,
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

  const onFinish = () => {
    const { receiverName, deliveryAddress, phoneNumber, note } = formValues;
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
    console.log("ID người dùng:", userId);
    console.log("Tên:", receiverName);
    console.log("Địa chỉ giao hàng:", deliveryAddress);
    console.log("Số Điện Thoại:", phoneNumber);
    console.log("Ghi chú:", note);
    console.log("Sản phẩm đã đặt:", orderedProducts);
    console.log("Tổng hóa đơn:", totalBill);
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
                    {item.name} - {quantity}
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
    </div>
  );
};

export default OrderCart;
