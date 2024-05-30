import React from "react";
import { Card, List, Button } from "antd";
import { useSelector } from "react-redux";
import { selectCartItems, selectAllProducts } from "../../../Redux/ShopSlice";

const PaymentResultStep = ({ transactionInfo, recipientInfo, orderInfo }) => {
  const cartItems = useSelector(selectCartItems);
  const allProducts = useSelector(selectAllProducts);

  const getProductDetails = (productId) => {
    return allProducts.find(product => product.id === productId);
  };

  return (
    <div>
      <Card
        title="Thông tin thanh toán"
        bordered={true}
        style={{
          maxWidth: "500px",
          margin: "auto",
          marginTop: "20px",
        }}
      >
        <p>
          <strong>Mã giao dịch:</strong> {transactionInfo.transactionId}
        </p>
        <p>
          <strong>Số tiền đã thanh toán:</strong> {transactionInfo.amount}
        </p>
        <p>
          <strong>Thời gian:</strong> {transactionInfo.timestamp}
        </p>
        {recipientInfo && recipientInfo.email && (
          <>
            <p>
              <strong>Email:</strong> {recipientInfo.email}
            </p>
            <p>
              <strong>Mã đơn hàng:</strong> {orderInfo.orderNumber}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {recipientInfo.phoneNumber}
            </p>
            <p>
              <strong>Địa chỉ giao hàng:</strong> {recipientInfo.address}
            </p>
          </>
        )}
        <p>
          <strong>Thanh toán thành công!</strong>
        </p>
        <List
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={(item) => {
            const product = getProductDetails(item.productId);
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<img src={product?.image} alt={product?.name} style={{ width: 50 }} />}
                  title={product?.name}
                  description={`Số lượng: ${item.quantity} Size: ${item.size} - Giá: ${product?.new_price?.toLocaleString("en-US")} VND - Tổng giá: ${(product?.new_price * item.quantity).toLocaleString("en-US")} VND`}
                />
              </List.Item>
            );
          }}
          style={{ marginTop: 20 }}
        />
        <Button type="primary" style={{ marginTop: 20, width: "100%" }}>Trang Chủ</Button>
      </Card>
    </div>
  );
};

export default PaymentResultStep;
