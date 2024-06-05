import React, { useState, useEffect, useMemo } from "react";
import { Form, Button, Descriptions, List, Select } from "antd";
import fetchVouchers from "../../../Api/Vouchers";
const { Option } = Select;

const RecipientInfoStepMoMo = ({
  onPrev,
  createMomoPayment,
  totalCartAmount,
  cartItems,
  allProducts,
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedVoucherInfo, setSelectedVoucherInfo] = useState(null);
  const [totalAmountDiscount, setTotalAmountDiscount] = useState(0);

  useEffect(() => {
    fetchVoucherData();
  }, []);

  const fetchVoucherData = async () => {
    const data = await fetchVouchers();
    setVouchers(data);
  };

  const handleVoucherChange = (value) => {
    setSelectedVoucher(value);
    const voucherInfo = vouchers.find((voucher) => voucher._id === value);
    setSelectedVoucherInfo(voucherInfo);
    if (voucherInfo) {
      const discountAmount =
        (totalCartAmount * voucherInfo.discountPercentage) / 100;
      setTotalAmountDiscount(
        Math.min(discountAmount, voucherInfo.maximumDiscount)
      );
    } else {
      setTotalAmountDiscount(0);
    }
    localStorage.setItem(
      "OrderData",
      JSON.stringify({
        ...getOrderData(),
        voucher: voucherInfo ? voucherInfo.voucherCode : null,
      })
    );
  };

  const getOrderData = () => {
    const orderData = localStorage.getItem("OrderData");
    return orderData ? JSON.parse(orderData) : {};
  };

  const getProductDetails = (productId) => {
    return allProducts.find((product) => product.id === productId);
  };

  const handlePayment = async (values) => {
    try {
      const response = await fetch("http://localhost:4000/momo/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedVoucher
            ? totalCartAmount - totalAmountDiscount
            : totalCartAmount,
        }),
      });
      const data = await response.json();
      const { payUrl } = data;
      window.location.href = payUrl;
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const renderedVouchers = useMemo(() => {
    return vouchers
      .filter((voucher) => voucher.minimumOrderValue <= totalCartAmount)
      .map((voucher) => (
        <Option key={voucher._id} value={voucher._id}>
          {voucher.voucherName}
        </Option>
      ));
  }, [vouchers, totalCartAmount]);

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
        onFinish={handlePayment}
      >
        <Descriptions title="Thông Tin Đơn Hàng" bordered>
          <Descriptions.Item label="Tổng tiền" span={3}>
            {(selectedVoucher
              ? totalCartAmount - totalAmountDiscount
              : totalCartAmount || 0
            ).toLocaleString("en-US")}{" "}
            VND
          </Descriptions.Item>
          {selectedVoucherInfo && (
            <Descriptions.Item label="Giảm giá từ voucher" span={3}>
              {totalAmountDiscount.toLocaleString("en-US")} VND
            </Descriptions.Item>
          )}
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
              {renderedVouchers}
            </Select>
          </Descriptions.Item>
          {selectedVoucherInfo && (
            <Descriptions.Item label="Thông tin Voucher" span={3}>
              <div>
                <p>
                  <strong>Tên Voucher:</strong>{" "}
                  {selectedVoucherInfo.voucherName}
                </p>
                <p>
                  <strong>Mã Voucher:</strong> {selectedVoucherInfo.voucherCode}
                </p>
                <p>
                  <strong>Đơn hàng tối thiểu:</strong>{" "}
                  {(selectedVoucherInfo.minimumOrderValue || 0).toLocaleString(
                    "en-US"
                  )}{" "}
                  VND
                </p>
                <p>
                  <strong>Giảm tối đa:</strong>{" "}
                  {(selectedVoucherInfo.maximumDiscount || 0).toLocaleString(
                    "en-US"
                  )}{" "}
                  VND
                </p>
                <p>
                  <strong>Hạn sử dụng:</strong>{" "}
                  {selectedVoucherInfo.voucherExpiry}
                </p>
              </div>
            </Descriptions.Item>
          )}
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
                      src={product?.image || ""}
                      alt={product?.name || "Unknown"}
                      style={{ width: 50 }}
                    />
                  }
                  title={product?.name || "Unknown"}
                  description={`Số lượng: ${item.quantity} Size: ${
                    item.size
                  } - Giá: ${(product?.new_price || 0).toLocaleString(
                    "en-US"
                  )} VND  Tổng giá: ${(
                    (product?.new_price || 0) * item.quantity
                  ).toLocaleString("en-US")} VND`}
                />
              </List.Item>
            );
          }}
        />
        <Form.Item>
          <Button onClick={onPrev} style={{ marginRight: "10px" }}>
            Quay Lại
          </Button>
          <Button type="primary" htmlType="submit">
            Thanh Toán
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RecipientInfoStepMoMo;
