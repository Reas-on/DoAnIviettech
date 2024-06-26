import React, { useEffect } from 'react';
import { Table, Select, message } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingOrders, updateOrderStatus } from '../../../Redux/admin/confirmOrders';

const { Option } = Select;

const ConfirmOrders = () => {
  const dispatch = useDispatch();
  const { pendingOrders, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPendingOrders());
  }, [dispatch]);

  const handleStatusChange = (value, orderId) => {
    dispatch(updateOrderStatus({ orderId, status: value }))
      .then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          message.success(`Đơn hàng ${action.payload.orderNumber} đã chuyển từ ${action.payload.status} sang ${value}`);
          dispatch(fetchPendingOrders());
        } else {
          message.error('Failed to update order status');
        }
      });
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
        loading={isLoading}
        rowKey="_id"
      />
    </div>
  );
};

export default ConfirmOrders;
