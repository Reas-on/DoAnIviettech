import React, { useEffect, useState, useCallback } from "react";
import { Card, Button, message } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems } from "../../../Redux/ShopSlice";
import { fetchCartItems } from "../../../Redux/Thunk/fetchCartItems";

const PaymentResultStep = ({ transactionInfo }) => {
  const [order, setOrder] = useState(null);
  const [orderSent, setOrderSent] = useState(false);
  const cartItems = useSelector(selectCartItems);
  const allProducts = useSelector((state) => state.shop.allProducts);
  const receiverName = useSelector((state) => state.shop.user?.name);
  const deliveryAddress = useSelector((state) => state.shop.user?.address);
  const phoneNumber = useSelector((state) => state.shop.user?.phone);
  const email = useSelector((state) => state.shop.user?.email);
  const dispatch = useDispatch();

  useEffect(() => {
    setOrderSent(true);
  }, []);

  const handleOrder = useCallback(async () => {
    try {
      if (orderSent) {
        return;
      }

      const response = await axios.get(`http://localhost:4000/orderData?mathanhtoan=${transactionInfo.transactionId}`);
      if (response.data.length > 0) {
        setOrder(response.data[0]);
        message.info("Đơn hàng đã được xử lí");
      } else {
        const orderedProducts = cartItems.map((cartItem) => {
          const product = allProducts.find((p) => p.id === cartItem.productId);
          return product
            ? {
                name: `[ Size : ${cartItem.size} ] ${product.name}`,
                image: product.image,
                quantity: cartItem.quantity,
                total: product.new_price * cartItem.quantity,
              }
            : null;
        }).filter(product => product !== null);

        const formData = {
          receiverName,
          deliveryAddress,
          phoneNumber,
          email,
          note: "",
          orderedProducts,
          PaymentMethodChangeEvent: "ZALOPAY",
          totalBill: transactionInfo.amount,
          mathanhtoan: transactionInfo.transactionId,
          status: "pending",
        };

        const postResponse = await axios.post("http://localhost:4000/orderData", formData);
        console.log("OrderData:", postResponse.data);
        message.success("Đơn hàng đã được xử lý thành công");
        setOrder(postResponse.data);
        setOrderSent(true);
        await resetCart();
        dispatch(fetchCartItems());
      }
    } catch (error) {
      console.error("Error checking or posting order data:", error);
      message.error("Có lỗi xảy ra khi xử lý đơn hàng");
    }
  }, [transactionInfo, cartItems, allProducts, receiverName, deliveryAddress, phoneNumber, email, orderSent , dispatch]);

  useEffect(() => {
    handleOrder();
  }, [handleOrder]);

  const resetCart = async () => {
    try {
      const authToken = localStorage.getItem("auth-token");
      const headers = authToken ? { "auth-token": authToken } : {};
      await axios.patch("http://localhost:4000/api/cartreset", null, { headers });
      console.log("Cart reset successful");
    } catch (error) {
      console.error("Error resetting cart:", error);
    }
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
          backgroundColor: "#f7f7f7",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <strong>Mã giao dịch:</strong> {transactionInfo.transactionId}
        </div>
        <div style={{ marginBottom: "20px" }}>
          <strong>Số tiền đã thanh toán:</strong> {transactionInfo.amount}
        </div>
        <div style={{ marginBottom: "20px" }}>
          <strong>Thời gian:</strong> {transactionInfo.timestamp}
        </div>
        {order ? (
          <>
            <div style={{ marginBottom: "20px" }}>
              <strong>Mã đơn hàng:</strong> {order.orderNumber}
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Tên người nhận:</strong> {order.receiverName}
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Địa chỉ giao hàng:</strong> {order.deliveryAddress}
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Số điện thoại:</strong> {order.phoneNumber}
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Email:</strong> {order.email}
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Trạng thái:</strong> {order.status}
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Voucher:</strong> {order.Voucher ? order.Voucher : 'Không có'}
            </div>
            <div><strong>Sản phẩm đã đặt:</strong></div>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {order.orderedProducts.map(product => (
                <li key={product._id} style={{ marginBottom: "10px" }}>
                  <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '5px' }} />
                  <span>{product.name}</span> - Số lượng: {product.quantity} - Tổng: {product.total} VND
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div><strong>Thanh toán thành công!</strong></div>
        )}
        <Button type="primary" style={{ marginTop: 20, width: "100%" }}>Trang Chủ</Button>
      </Card>
    </div>
  );
};

export default PaymentResultStep;
