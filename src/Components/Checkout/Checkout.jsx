import React from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/payment');
  };

  return (
        
    <button className="cartitems-checkout-button" onClick={handleCheckout}>Checkout</button>
  );
}

export default Checkout;

