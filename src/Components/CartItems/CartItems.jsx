import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CartItems.scss";
import remove_icon from "../Assets/cart_cross_icon.png";
import {
  selectCartItems,
  selectTotalCartItems,
  selectTotalCartAmount,
} from "../../Redux/ShopSlice";
import { removeFromCart } from "../../Redux/Thunk/removeFromCart";
import { fetchCartItems } from "../../Redux/Thunk/fetchCartItems";
import { Button, Select } from "antd";

const { Option } = Select;

const CartItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const totalCartItem = useSelector(selectTotalCartItems);
  const allProducts = useSelector((state) => state.shop.allProducts);
  const [paymentMethod, setPaymentMethod] = useState("receive");

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item));
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleCheckout = (method) => {
    if (method === "receive") {
      navigate("/OrderCart");
    } else {
      navigate(`/online-payment/${method || paymentMethod}`);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Size</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {Object.values(cartItems).map((item) => {
        const product = allProducts.find((p) => p.id === item.productId);
        if (product && item.quantity > 0) {
          return (
            <div key={item._id}>
              <div className="cartitems-format cartitems-format-main">
                <img
                  src={product.image}
                  alt=""
                  className="carticon-product-icon"
                />
                <p>{product.name}</p>
                <p>{item.size}</p>
                <p>{product.new_price.toLocaleString("en-US")} VND</p>
                <button className="cartitems-quantity">{item.quantity}</button>
                <p>
                  {(product.new_price * item.quantity).toLocaleString("en-US")}{" "}
                  VND
                </p>
                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => handleRemoveFromCart(item)}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        } else {
          return null;
        }
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total - {totalCartItem} items</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{totalCartAmount.toLocaleString("en-US")} VND</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Total</p>
              <p>{totalCartAmount.toLocaleString("en-US")} VND</p>
            </div>
          </div>
          <div className="cartitems-total-method">
            <p>Select payment method:</p>
            <Select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              style={{ width: "100%" }}
            >
              <Option value="receive">Thanh Toán Khi Nhận Hàng</Option>
              <Option value="online">Thanh Toán Online</Option>
            </Select>
          </div>

          {paymentMethod === "online" && (
            <div className="online-payment-options">
              <Button
                className="zalopay-button"
                onClick={() => handleCheckout("zalopay")}
              >
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                  alt="ZaloPay"
                  style={{
                    marginRight: "10px",
                    verticalAlign: "middle",
                    height: "30px",
                  }}
                />
                ZaloPay
              </Button>
              <Button
                className="momo-button"
                onClick={() => handleCheckout("momo")}
              >
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png"
                  alt="Momo"
                  style={{
                    marginRight: "10px",
                    verticalAlign: "middle",
                    height: "30px",
                  }}
                />
                MoMo
              </Button>
              <Button
                className="vnpay-button"
                onClick={() => handleCheckout("vnpay")}
                disabled
              >
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                  alt="VnPay"
                  style={{
                    marginRight: "10px",
                    verticalAlign: "middle",
                    height: "30px",
                  }}
                />
                VnPay
              </Button>
            </div>
          )}
          {paymentMethod !== "online" && (
            <Button
              type="primary"
              className="cartitems-checkout-button"
              onClick={() => handleCheckout("receive")}
            >
              Checkout
            </Button>
          )}
        </div>
        <div className="cartitems-promocode">
          <p>Promo code</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="Enter code" />
            <Button>Apply</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
