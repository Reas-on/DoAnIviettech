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
    });
  }, [userName, userAddress, userPhone, userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleNext = () => {
    setRecipientInfo(formValues);
    localStorage.setItem("OrderData", JSON.stringify(formValues));
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
        <h2>Recipient details</h2>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name!" }]}
        >
          <Input
            name="fullName"
            onChange={handleInputChange}
            value={formValues.fullName}
            required
          />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter your address!" }]}
        >
          <Input
            name="address"
            onChange={handleInputChange}
            value={formValues.address}
          />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: "Please enter your phone number!" }]}
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
              message: "Please enter a valid email!",
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
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderInfoStep;
