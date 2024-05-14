import React, { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom"; 

const OrderData = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await fetch("http://localhost:4000/orderData");
      if (!response.ok) {
        throw new Error("Failed to fetch order data");
      }
      const data = await response.json();
      setOrderData(data);
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Receiver Name",
      dataIndex: "receiverName",
      key: "receiverName",
    },
    {
      title: "Payment Method",
      dataIndex: "PaymentMethodChangeEvent",
      key: "PaymentMethodChangeEvent",
    },
    {
      title: "Delivery Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
    },
    {
      title: "Total Bill",
      dataIndex: "totalBill",
      key: "totalBill",
      render: (totalBill) => (
        <span>{new Intl.NumberFormat("en-US").format(totalBill)} VND</span>
      ),
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
    },
  ];

  return (
    <div>
      <h2>Order Data</h2>
      <Table
        dataSource={orderData}
        columns={columns}
        loading={loading}
        rowKey="_id"
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              navigate(`/admin/AllOrders/${record.orderNumber}`); // Chuyển hướng đến trang chi tiết đơn hàng khi click
            },
          };
        }}
      />
    </div>
  );
};

export default OrderData;
