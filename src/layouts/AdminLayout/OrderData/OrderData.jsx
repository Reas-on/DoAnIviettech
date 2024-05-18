import React, { useEffect, useRef } from "react";
import { Table, Tag, Input, Button, Space } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import moment from "moment";
import { useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderData } from "../../../Redux/admin/adminorderdata";

const OrderData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderData, isLoading } = useSelector((state) => {
    // Lọc ra các đơn hàng không ở trạng thái 'completed' hoặc 'cancelled'
    const filteredOrders = state.admin.orderData.filter(order => !['completed', 'cancelled'].includes(order.status));
    return {
      orderData: filteredOrders,
      isLoading: state.admin.isLoading
    };
  });
  const searchInput = useRef(null);

  useEffect(() => {
    dispatch(fetchOrderData());
  }, [dispatch]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = clearFilters => {
    clearFilters();
  };

  const columns = [
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD-MM-YYYY"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
      sorter: (a, b) => a.orderNumber - b.orderNumber,
      ...getColumnSearchProps('orderNumber'),
    },
    {
      title: "Receiver Name",
      dataIndex: "receiverName",
      key: "receiverName",
      sorter: (a, b) => a.receiverName.localeCompare(b.receiverName),
      ...getColumnSearchProps('receiverName'),
    },
    {
      title: "Payment Method",
      dataIndex: "PaymentMethodChangeEvent",
      key: "PaymentMethodChangeEvent",
      sorter: (a, b) => a.PaymentMethodChangeEvent.localeCompare(b.PaymentMethodChangeEvent),
      ...getColumnSearchProps('PaymentMethodChangeEvent'),
    },
    {
      title: "Delivery Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      sorter: (a, b) => a.deliveryAddress.localeCompare(b.deliveryAddress),
      ...getColumnSearchProps('deliveryAddress'),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
      ...getColumnSearchProps('phoneNumber'),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps('email'),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Total Products",
      dataIndex: "orderedProducts",
      key: "totalProducts",
      render: (orderedProducts) => orderedProducts.length,
      sorter: (a, b) => a.orderedProducts.length - b.orderedProducts.length,
    },
    {
      title: "Total Bill",
      dataIndex: "totalBill",
      key: "totalBill",
      render: (totalBill) => (
        <span>{new Intl.NumberFormat("en-US").format(totalBill)} VND</span>
      ),
      sorter: (a, b) => a.totalBill - b.totalBill,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag
          color={
            status === "pending"
              ? "blue"
              : status === "processing"
              ? "gold"
              : status === "completed"
              ? "green"
              : status === "delivered"
              ? "cyan"
              : status === "shipped"
              ? "magenta"
              : status === "cancelled"
              ? "red"
              : ""
          }
        >
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Processing', value: 'processing' },
        { text: 'Completed', value: 'completed' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Shipped', value: 'shipped' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status.includes(value),
    },
  ];

  return (
    <div>
      <h2>Order Data</h2>
      <Table
        dataSource={orderData}
        columns={columns}
        loading={isLoading}
        rowKey="_id"
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/admin/AllOrders/${record.orderNumber}`);
            },
          };
        }}
      />
    </div>
  );
};

export default OrderData;
