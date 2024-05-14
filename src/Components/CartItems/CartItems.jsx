import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./CartItems.scss";
import remove_icon from "../Assets/cart_cross_icon.png";
import {
  selectCartItems,
  selectTotalCartItems,
  selectTotalCartAmount,
} from "../../Redux/ShopSlice";
import { removeFromCart } from "../../Redux/Thunk/removeFromCart";
import { fetchCartItems } from "../../Redux/Thunk/fetchCartItems";

const CartItems = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalCartAmount = useSelector(selectTotalCartAmount);
  const totalCartItem = useSelector(selectTotalCartItems);
  const allProducts = useSelector((state) => state.shop.allProducts);
  const [paymentMethod, setPaymentMethod] = useState("receive");

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCheckout = () => {
    if (paymentMethod === "receive") {
      // Redirect to OrderCart page if payment method is "Nhận Hàng Khi Thanh Toán"
      window.location.href = "/OrderCart"; 
    } else {
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
      {cartItems &&
        Object.keys(cartItems).length > 0 &&
        allProducts &&
        allProducts.length > 0 &&
        Object.keys(cartItems).map((itemId) => {
          const product = allProducts.find(
            (item) => item.id === parseInt(itemId)
          );
          const quantity = cartItems[itemId];
          if (product && quantity > 0) {
            return (
              <div key={product.id}>
                <div className="cartitems-format cartitems-format-main">
                  <img
                    src={product.image}
                    alt=""
                    className="carticon-product-icon"
                  />
                  <p>{product.name}</p>
                  <p>{product.size}</p>
                  <p>{product.new_price.toLocaleString("en-US")} VND</p>
                  <button className="cartitems-quantity">{quantity}</button>
                  <p>
                    {(product.new_price * quantity).toLocaleString("en-US")} VND
                  </p>
                  <img
                    className="cartitems-remove-icon"
                    src={remove_icon}
                    onClick={() => handleRemoveFromCart(product.id)}
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
            <select value={paymentMethod} onChange={handlePaymentMethodChange}>
              <option value="receive">Nhận Hàng Khi Thanh Toán</option>
              <option value="vnpay">Thanh Toán Qua VNPay</option>
            </select>
          </div>
          <button className="cartitems-checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
        <div className="cartitems-promocode">
          <p>Promo code</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="Enter code" />
            <button>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
