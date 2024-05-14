import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDetail = ({ orderNumber }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/orderData/${orderNumber}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <h2>Order Detail</h2>
      <p>Order Number: {order.orderNumber}</p>
      <p>Receiver Name: {order.receiverName}</p>
      <p>Delivery Address: {order.deliveryAddress}</p>
      <p>Phone Number: {order.phoneNumber}</p>
      <p>Email: {order.email}</p>
      <h3>Ordered Products:</h3>
      <ul>
        {order.orderedProducts.map(product => (
          <li key={product._id}>
            <p>Name: {product.name}</p>
            <p>Image: <img src={product.image} alt={product.name} style={{ width: '100px' }} /></p>
            <p>Quantity: {product.quantity}</p>
            <p>Total: {product.total}</p>
          </li>
        ))}
      </ul>
      <p>Total Bill: {order.totalBill}</p>
      <p>Status: {order.status}</p>
      <p>Payment Method: {order.PaymentMethodChangeEvent}</p>
      <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
      <h3>Logs:</h3>
      <ul>
        {order.logs.map(log => (
          <li key={log._id}>
            <p>Timestamp: {new Date(log.timestamp).toLocaleString()}</p>
            <p>Message: {log.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetail;
