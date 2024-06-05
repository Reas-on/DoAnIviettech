import React, { useEffect, useState, useCallback } from "react";
import { Card, Button, message } from "antd";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems } from "../../../Redux/ShopSlice";
import { fetchCartItems } from "../../../Redux/Thunk/fetchCartItems";

const PaymentResultStepMoMo = ({ transactionInfo }) => {
  const [order, setOrder] = useState(null);
  const [orderSent, setOrderSent] = useState(false);
  const cartItems = useSelector(selectCartItems);
  const allProducts = useSelector((state) => state.shop.allProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    setOrderSent(true);
  }, []);
  
  const handleOrder = useCallback(async (  ) => {
    try {
      if (orderSent) {
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/orderData?mathanhtoan=${transactionInfo.transactionId}`
      );
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
                productId: product.id,
                quantity: cartItem.quantity,
                total: product.new_price * cartItem.quantity,
              }
            : null;
        }).filter(product => product !== null);

        const localStorageData = JSON.parse(localStorage.getItem("OrderData"));
        const formData = {
          receiverName: localStorageData.fullName,
          deliveryAddress: localStorageData.address,
          phoneNumber: localStorageData.phoneNumber,
          email: localStorageData.email,
          Voucher: localStorageData.voucher,
          note: "",
          orderedProducts,
          PaymentMethodChangeEvent: "MOMO",
          totalBill: transactionInfo.amount,
          mathanhtoan: transactionInfo.transactionId,
          status: "pending",
        };

        const postResponse = await axios.post(
          "http://localhost:4000/orderData",
          formData
        );
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
  }, [
    transactionInfo,
    cartItems,
    allProducts,
    orderSent,
    dispatch,
  ]);

  useEffect(() => {
    handleOrder();
  }, [handleOrder]);

  const resetCart = async () => {
    try {
      const authToken = localStorage.getItem("auth-token");
      if (authToken) {
        const headers = { "auth-token": authToken };
        await axios.patch("http://localhost:4000/api/cartreset", null, { headers });
        console.log("Cart reset successful");
      } else {
        localStorage.removeItem("cartItems");
        console.log("Cart in localStorage reset successful");
      }
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
        {order ? (
          <>
            <p>
              <strong>Mã đơn hàng:</strong> {order.orderNumber}
            </p>
            <p>
              <strong>Tên người nhận:</strong> {order.receiverName}
            </p>
            <p>
              <strong>Địa chỉ giao hàng:</strong> {order.deliveryAddress}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {order.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Trạng thái:</strong> {order.status}
            </p>
            <p>
              <strong>Voucher:</strong>{" "}
              {order.Voucher ? order.Voucher : "Không có"}
            </p>
            <p>
              <strong>Sản phẩm đã đặt:</strong>
            </p>
            <ul>
              {order.orderedProducts.map((product) => (
                <li key={product._id}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                    }}
                  />
                  {product.name} - Số lượng: {product.quantity} - Tổng:{" "}
                  {product.total} VND
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>
            <strong>Thanh toán thành công!</strong>
          </p>
        )}
        <Button type="primary" style={{ marginTop: 20, width: "100%" }}>
          Trang Chủ
        </Button>
      </Card>
    </div>
  );
};

export default PaymentResultStepMoMo;