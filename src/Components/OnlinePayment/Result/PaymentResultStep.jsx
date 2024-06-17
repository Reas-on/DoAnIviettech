import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Button, message } from "antd";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectTotalCartAmount } from "../../../Redux/ShopSlice";
import { fetchCartItems } from "../../../Redux/Thunk/fetchCartItems";

const PaymentResultStep = () => {
  const [order, setOrder] = useState(null);
  const cartItems = useSelector(selectCartItems);
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const allProducts = useSelector((state) => state.shop.allProducts);

  const dispatch = useDispatch();

  const orderSentRef = useRef(false);

  const formatAmount = (amount) => {
    return amount.toLocaleString('vi-VN');
  };

  const handleOrder = useCallback(async () => {
    try {
      if (orderSentRef.current) {
        return;
      }
      const localStorageData = JSON.parse(localStorage.getItem("OrderData"));
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

      const formData = {
        receiverName: localStorageData.fullName,
        deliveryAddress: localStorageData.address,
        phoneNumber: localStorageData.phoneNumber,
        email: localStorageData.email,
        note: "",
        orderedProducts,
        PaymentMethodChangeEvent: 'Thanh Toán Nhận Hàng',
        totalBill: totalCartAmount,
        mathanhtoan: null,
        status: "pending",
      };

      const postResponse = await axios.post("http://localhost:4000/orderData", formData);
      console.log("OrderData:", postResponse.data);
      setOrder(postResponse.data);
      orderSentRef.current = true;
      await resetCart();
      dispatch(fetchCartItems());
      message.success("Order successfully created");
    } catch (error) {
      console.error("Error posting order data:", error);
      message.error("Error posting order data");
    }
  }, [totalCartAmount, cartItems, allProducts,dispatch]);

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
        title="Order Details"
        bordered={true}
        style={{
          maxWidth: "500px",
          margin: "auto",
          marginTop: "20px",
        }}
      >
        <div className="ant-card-body">
          {order ? (
            <>
              <p><strong>Order Number: {order.orderNumber}</strong></p>
              <p><strong>Receiver Name: {order.receiverName}</strong></p>
              <p><strong>Delivery Address: {order.deliveryAddress}</strong></p>
              <p><strong>Phone Number: {order.phoneNumber}</strong></p>
              <p><strong>Email: {order.email}</strong></p>
              <p><strong>Total: {formatAmount(order.totalBill)} VND</strong></p>
              <p><strong>Status: {order.status}</strong></p>
              {order.orderedProducts && order.orderedProducts.length > 0 ? (
                <div>
                  <p><strong>Ordered Products:</strong></p>
                  <ul>
                    {order.orderedProducts.map((product) => (
                      <li key={product._id}>
                        <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                        {product.name} - Quantity: {product.quantity} - Total: {formatAmount(product.total)} VND
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No ordered products.</p>
              )}
            </>
          ) : (
            <p><strong>Loading !</strong></p>
          )}
          <Button type="primary" style={{ marginTop: 20, width: "100%" }}>Trang Chủ</Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentResultStep;
