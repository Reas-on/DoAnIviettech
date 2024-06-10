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
        message.info("Order already exists, please check your order history");
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
        message.success("Order created successfully");
        setOrder(postResponse.data);
        setOrderSent(true);
        await resetCart();
        dispatch(fetchCartItems());
      }
    } catch (error) {
      console.error("Error checking or posting order data:", error);
      message.error("Error checking or posting order data");
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

  const formatAmount = (amount) => {
    return amount.toLocaleString('vi-VN');
  };
  
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
        title="Payment Result"
        bordered={true}
        style={{
          maxWidth: "500px",
          margin: "auto",
          marginTop: "20px",
        }}
      >
        <p>
          <strong>Transaction ID:</strong> {transactionInfo.transactionId}
        </p>
        <p>
          <strong>Total amount:</strong> {formatAmount(transactionInfo.amount)} VND
        </p>
        <p>
          <strong>Timestamp:</strong> {transactionInfo.timestamp}
        </p>
        {order ? (
          <>
            <p>
              <strong>Order Number:</strong> {order.orderNumber}
            </p>
            <p>
              <strong>Recever Name:</strong> {order.receiverName}
            </p>
            <p>
              <strong>Delivery Address:</strong> {order.deliveryAddress}
            </p>
            <p>
              <strong>Phone Number:</strong> {order.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Voucher:</strong>{" "}
              {order.Voucher ? order.Voucher : "None"}
            </p>
            <p>
              <strong>Ordered Products:</strong>
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
                  {product.name} - Quantity: {product.quantity} - Total:{" "}
                  {formatAmount(product.total)} VND
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>
            <strong>Loading !</strong>
          </p>
        )}
        <Button type="primary" style={{ marginTop: 20, width: "100%" }}>
          Home
        </Button>
      </Card>
    </div>
  );
};

export default PaymentResultStepMoMo;