import React, { useEffect } from 'react';
import { Table, Tag } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../../../Redux/admin/adminorderdata';

const CompletedOrders = () => {
  const dispatch = useDispatch();
  const { orderData, isLoading } = useSelector((state) => {
    // Lọc ra các đơn hàng ở trạng thái 'completed'
    const completedOrders = state.admin.orderData.filter(order => order.status === 'completed');
    return {
      orderData: completedOrders,
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
      render: (status) => (
        <Tag
          color={
            status === 'completed'
              ? 'green'
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
      <h2>Completed Orders</h2>
      <Table
        dataSource={orderData}
        columns={columns}
        loading={isLoading}
        rowKey="_id"
      />
    </div>
  );
};

export default CompletedOrders;
