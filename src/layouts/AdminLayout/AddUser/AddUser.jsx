import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { addUser } from "../../../Redux/admin/adduser";

const { Option } = Select;

const AddUser = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provinceNames, setProvinceNames] = useState({});
  const [districtNames, setDistrictNames] = useState({});
  const [wardNames, setWardNames] = useState({});

  useEffect(() => {
    fetchProvinces();
  }, []);

  // Tạo cartData theo mẫu
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i.toString()] = 0;
  }

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://vapi.vnappmob.com/api/province/");
      if (!response.ok) {
        throw new Error("Failed to fetch provinces");
      }
      const data = await response.json();
      setProvinces(data.results);
      const names = {};
      data.results.forEach((province) => {
        names[province.province_id] = province.province_name;
      });
      setProvinceNames(names);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(
        `https://vapi.vnappmob.com/api/province/district/${provinceId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch districts");
      }
      const data = await response.json();
      setDistricts(data.results);
      const names = {};
      data.results.forEach((district) => {
        names[district.district_id] = district.district_name;
      });
      setDistrictNames(names);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await fetch(
        `https://vapi.vnappmob.com/api/province/ward/${districtId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch wards");
      }
      const data = await response.json();
      setWards(data.results);
      const names = {};
      data.results.forEach((ward) => {
        names[ward.ward_id] = ward.ward_name;
      });
      setWardNames(names);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const onFinish = async () => {
    try {
      const formData = await form.validateFields();
      const address = `${formData.address},${wardNames[formData.ward]},${districtNames[formData.district]},${provinceNames[formData.province]}`;
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address,
        isAdmin: formData.isAdmin === "true" ? true : false,
        cartData: cart,
      };
      dispatch(addUser(userData));
      message.success("Registration successful!");
      form.resetFields();
    } catch (error) {
      console.error("Error when submitting registration data:", error);
      message.error("An error occurred, please try again later!");
    }
  };

  return (
    <div className="add-user">
      <h2>Add User</h2>
      <Form
        form={form}
        name="addUserForm"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Customer Name"
          name="name"
          rules={[{ required: true, message: "Please enter customer name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Role"
          name="isAdmin"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select>
            <Select.Option value="true">Admin</Select.Option>
            <Select.Option value="false">User</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", message: "Invalid email" },
            { required: true, message: "Please enter email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Province"
          name="province"
          rules={[{ required: true, message: "Please select a province" }]}
        >
          <Select onChange={(value) => fetchDistricts(value)}>
            {provinces.map((province) => (
              <Option key={province.province_id} value={province.province_id}>
                {province.province_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="District"
          name="district"
          rules={[{ required: true, message: "Please select a district" }]}
        >
          <Select onChange={(value) => fetchWards(value)}>
            {districts.map((district) => (
              <Option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Ward"
          name="ward"
          rules={[{ required: true, message: "Please select a ward" }]}
        >
          <Select>
            {wards.map((ward) => (
              <Option key={ward.ward_id} value={ward.ward_id}>
                {ward.ward_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUser;
