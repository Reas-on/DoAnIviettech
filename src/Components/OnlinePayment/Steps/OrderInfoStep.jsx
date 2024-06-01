// OrderInfoStep.js
import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "../../../Redux/Thunk/fetchUserInfo";

const OrderInfoStep = ({ onNext, setRecipientInfo }) => {
  const [formValues, setFormValues] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.shop.user?.name);
  const userAddress = useSelector((state) => state.shop.user?.address);
  const userPhone = useSelector((state) => state.shop.user?.phone);
  const userEmail = useSelector((state) => state.shop.user?.email);
  const userId = useSelector((state) => state.shop.user?.userId);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("auth-token");
      if (token) {
        await dispatch(fetchUserInfo(token));
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setFormValues({
      fullName: userName || "",
      address: userAddress || "",
      phoneNumber: userPhone || "",
      email: userEmail || "",
      userId: userId || "",
    });
  }, [userName, userAddress, userPhone, userEmail, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleNext = () => {
    setRecipientInfo(formValues);
    onNext();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Form
        layout="vertical"
        initialValues={formValues}
        style={{
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        <h2>Thông tin người nhận</h2>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input
            name="fullName"
            onChange={handleInputChange}
            value={formValues.fullName}
          />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input
            name="address"
            onChange={handleInputChange}
            value={formValues.address}
          />
        </Form.Item>
        <Form.Item
          label="Số Điện Thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
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
              message: "Vui lòng nhập địa chỉ email hợp lệ!",
            },
          ]}
        >
          <Input
            name="email"
            onChange={handleInputChange}
            value={formValues.email}
          />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={handleNext}
            type="primary"
            style={{ width: "60%", margin: "auto", display: "block" }}
          >
            Tiếp Tục
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderInfoStep;
