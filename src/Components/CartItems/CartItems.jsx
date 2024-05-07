import React, { useContext } from "react";
import "./CartItems.scss";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((product) => {
        const quantity = cartItems[product.id];
        if (quantity > 0) {
          return (
            <div key={product.id}>
              <div className="cartitems-format cartitems-format-main">
                <img
                  src={product.image}
                  alt=""
                  className="carticon-product-icon"
                />
                <p>{product.name}</p>
                <p>{product.new_price.toLocaleString("en-US")} VND</p>
                <button className="cartitems-quantity">{quantity}</button>
                <p>{(product.new_price * quantity).toLocaleString("en-US")} VND</p>
                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(product.id)}
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
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{getTotalCartAmount().toLocaleString("en-US")} VND</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Total</p>
              <p>{getTotalCartAmount().toLocaleString("en-US")} VND</p>
            </div>
          </div>
          <button className="cartitems-checkout-button">Checkout</button>
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
