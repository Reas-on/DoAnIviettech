import React, { useState, useEffect } from "react";
import { Form, Button, Descriptions, List, Select } from "antd";
import axios from "axios";
const { Option } = Select;

const RecipientInfoStep = ({
  onPrev,
  createZaloPayment,
  recipientInfo,
  totalCartAmount,
  cartItems,
  allProducts,
  setOrderInfo,
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/vouchers");
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleVoucherChange = (value) => {
    setSelectedVoucher(value);
  };

  const getProductDetails = (productId) => {
    return allProducts.find((product) => product.id === productId);
  };

  const saveOrderInfo = () => {
    const orderDetails = {
      recipientInfo: {
        receiverName: recipientInfo.fullName,
        deliveryAddress: recipientInfo.address,
        phoneNumber: recipientInfo.phoneNumber,
        email: recipientInfo.email,
      },
      total: totalCartAmount,
      items: cartItems.map((item) => {
        const product = getProductDetails(item.productId);
        return {
          name: product?.name,
          price: product?.new_price,
          quantity: item.quantity,
          size: item.size,
          image: product?.image,
        };
      }),
      voucher: selectedVoucher,
    };
    localStorage.setItem("orderInfo", JSON.stringify(orderDetails));
    setOrderInfo(orderDetails);
    return orderDetails;
  };

  const handlePayment = async () => {
    const orderDetails = saveOrderInfo();
    try {
      const paymentResponse = await createZaloPayment({
        amount: totalCartAmount,
        productName: orderDetails.items.map((item) => item.name).join(", "),
        productDescription: `Order with ${orderDetails.items.length} items`,
        voucher: selectedVoucher,
      });
      if (paymentResponse.return_code === 1) {
        window.location.href = paymentResponse.order_url;
      } else {
        console.error("Payment creation failed: ", paymentResponse);
      }
    } catch (error) {
      console.error("Payment Error: ", error);
    }
  };

  return (
    <div>
      <Form
        layout="vertical"
        style={{
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        <Descriptions title="Thông Tin Đơn Hàng" bordered>
          <Descriptions.Item label="Tổng tiền" span={3}>
            {totalCartAmount.toLocaleString("en-US")} VND
          </Descriptions.Item>
          <Descriptions.Item label="Số Lượng" span={3}>
            {cartItems.length} Sản Phẩm
          </Descriptions.Item>
          <Descriptions.Item label="Voucher" span={3}>
            <Select
              placeholder="Chọn voucher"
              style={{ width: "100%" }}
              onChange={handleVoucherChange}
              value={selectedVoucher}
            >
              {vouchers.map((voucher) => (
                <Option key={voucher._id} value={voucher._id}>
                  {voucher.voucherName} - Giảm tối đa {voucher.minimumOrderValue.toLocaleString("en-US")} VND
                </Option>
              ))}
            </Select>
          </Descriptions.Item>
        </Descriptions>
        <List
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={(item) => {
            const product = getProductDetails(item.productId);
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <img
                      src={product?.image}
                      alt={product?.name}
                      style={{ width: 50 }}
                    />
                  }
                  title={product?.name}
                  description={`Số lượng: ${item.quantity} Size: ${item.size} - Giá: ${product?.new_price.toLocaleString(
                    "en-US"
                  )} VND  Tổng giá: ${(product?.new_price * item.quantity).toLocaleString(
                    "en-US"
                  )} VND`}
                />
              </List.Item>
            );
          }}
          style={{ marginTop: 20 }}
        />
        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
              margin: "0 auto",
            }}
          >
            <Button type="default" onClick={onPrev} style={{ width: "48%" }}>
              Quay Lại
            </Button>
            <Button
              type="primary"
              onClick={handlePayment}
              style={{ width: "48%" }}
            >
              Thanh Toán
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RecipientInfoStep;
