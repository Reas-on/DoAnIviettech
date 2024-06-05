import React, { useState } from "react";
import { Button, Form, Input, InputNumber, Select, Upload, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import addProductApi from "../../../Api/admin/AddproductApi";

const { TextArea } = Input;
const { Option } = Select;

const AddProduct = () => {
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const imageHandler = (file) => {
    setImage(file);
    setFileName(file.name);
    return false;
  };

  const onFinish = async (values) => {
    try {
      const uploadResponse = await addProductApi.uploadProductImage(image);
      if (uploadResponse.success) {
        values.image = uploadResponse.image_url;
        const addProductResponse = await addProductApi.addProduct(values);
        if (addProductResponse.success) {
          message.success("Product Added Successfully");
          form.resetFields();
          setImage(null);
          setFileName("");
        } else {
          message.error("Product Not Added");
        }
      } else {
        message.error("Image Upload Failed");
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
      message.error("Error adding product: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h1>Add Product</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Product Title"
          rules={[{ required: true, message: 'Please enter the product title' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="old_price"
          label="Price"
          rules={[{ required: true, message: 'Please enter the product price' }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter product price"
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="new_price"
          label="Offer Price"
          rules={[{ required: true, message: 'Please enter the offer price' }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter offer price"
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Product Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select a category">
            <Option value="women">Women</Option>
            <Option value="men">Men</Option>
            <Option value="kid">Kid</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="shortDescription"
          label="Short Description"
          rules={[{ required: true, message: 'Please enter a short description' }]}
        >
          <TextArea placeholder="Enter short description" />
        </Form.Item>

        <Form.Item
          name="longDescription"
          label="Long Description"
          rules={[{ required: true, message: 'Please enter a long description' }]}
        >
          <TextArea placeholder="Enter long description" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Upload Product Image"
          rules={[{ required: true, message: 'Please upload a product image' }]}
        >
          <Upload
            beforeUpload={imageHandler}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {image && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={URL.createObjectURL(image)}
                alt="product"
                style={{ maxWidth: "15%", height: "auto" }}
              />
              <Typography.Text> {fileName}</Typography.Text>
            </div>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
