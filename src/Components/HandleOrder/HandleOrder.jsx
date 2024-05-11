import React from "react";
import remove_icon from "../Assets/cart_cross_icon.png";
import './HandleOrder.scss'



const HandleOrder = ({onCheckout}) => {
  return (
    <div className="orderitems">
      <div className="orderitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {/* {all_product.map((product) => {
        const quantity = cartItems[product.id];
        if (quantity > 0) {
          return (
            <div key={product.id}>
              <div className="orderitems-format cartitems-format-main">
                <img
                  src={product.image}
                  alt=""
                  className="ordericon-product-icon"
                />
                <p>{product.name}</p>
                <p>{product.new_price.toLocaleString("en-US")} VND</p>
                <button className="orderitems-quantity">{quantity}</button>
                <p>{(product.new_price * quantity).toLocaleString("en-US")} VND</p>
                <img
                  className="orderitems-remove-icon"
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
      })} */}
        
      </div>

  );
};

export default HandleOrder;
