import React, { useEffect } from 'react';
import { Table, Tag } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../../../Redux/admin/adminorderdata';

const DeliveringOrders = () => {
  const dispatch = useDispatch();
  const { orderData, isLoading } = useSelector((state) => {
    const cancelledOrders = state.admin.orderData.filter(order => order.status === 'delivered');
    return {
      orderData: cancelledOrders,
      isLoading: state.admin.isLoading
    };
  });

  useEffect(() => {
    dispatch(fetchOrderData());
  }, [dispatch]);

  const columns = [
    {
      title: 'Ngày Đặt Hàng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('DD-MM-YYYY'),
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
        <Tag
          color={
            status === 'pending'
              ? 'blue'
              : status === 'processing'
              ? 'gold'
              : status === 'completed'
              ? 'green'
              : status === 'delivered'
              ? 'cyan'
              : status === 'shipped'
              ? 'magenta'
              : status === 'cancelled'
              ? 'red'
              : ''
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h2>Cancelled Orders</h2>
      <Table
        dataSource={orderData}
        columns={columns}
        loading={isLoading}
      />
    </div>
  );
};

export default DeliveringOrders;
