import React, { useState, useEffect } from 'react';
import { Table, Select, message } from 'antd';
import moment from 'moment';

const { Option } = Select;

const ConfirmOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await fetch('http://localhost:4000/orderData');
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      const data = await response.json();
      // Lọc ra chỉ các đơn hàng có trạng thái là pending
      const pendingOrdersData = data.filter(order => order.status === 'pending');
      setPendingOrders(pendingOrdersData);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (value, orderId) => {
    try {
      const response = await fetch(`http://localhost:4000/orderData/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: value })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      const updatedOrder = await response.json();
      message.success(`Đơn hàng ${updatedOrder.orderNumber} đã chuyển từ ${updatedOrder.status} sang ${value}`);
      setTimeout(() => {
        message.success(null);
      }, 5000);
      fetchOrderData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  const columns = [
    {
      title: 'Ngày Đặt Hàng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format("DD-MM-YYYY"),
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Receiver Name',
      dataIndex: 'receiverName',
      key: 'receiverName',
    },
    {
      title: 'Payment Method',
      dataIndex: 'PaymentMethodChangeEvent',
      key: 'PaymentMethodChangeEvent',
    },
    {
      title: 'Delivery Address',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Total Products',
      dataIndex: 'orderedProducts',
      key: 'totalProducts',
      render: (orderedProducts) => orderedProducts.length,
    },
    {
      title: 'Total Bill',
      dataIndex: 'totalBill',
      key: 'totalBill',
      render: (totalBill) => (
        <span>{new Intl.NumberFormat('en-US').format(totalBill)} VND</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select defaultValue={status} onChange={(value) => handleStatusChange(value, record._id)}>
          <Option value="pending">Pending</Option>
          <Option value="processing">Processing</Option>
          <Option value="delivered">Delivered</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <h2>Order Data</h2>
      <Table
        dataSource={pendingOrders}
        columns={columns}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
};

export default ConfirmOrders;