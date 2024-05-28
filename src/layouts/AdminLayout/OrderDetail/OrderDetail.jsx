import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Col,
  Row,
  Typography,
  List,
  Form,
  Input,
  Button,
  Select,
  message as antdMessage,
} from "antd";
import OrderDetailApi from "../../../Api/OrderDetailApi";

const { Title } = Typography;
const { Option } = Select;

const OrderDetail = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const fetchOrderDetail = useCallback(async () => {
    try {
      const data = await OrderDetailApi.getOrderDetail(orderNumber);
      setOrder(data);
      setStatus(data.status);
    } catch (error) {
      console.error("Error fetching order detail:", error);
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const updateOrder = async (newStatus, newMessage) => {
    setLoading(true);
    try {
      await OrderDetailApi.updateOrder(order._id, newStatus, newMessage);
      const updatedOrder = await OrderDetailApi.getOrderDetail(orderNumber);
      setOrder(updatedOrder);
      setStatus(updatedOrder.status);
      antdMessage.success("Order updated successfully");
      // Add new log
      await OrderDetailApi.addLog(order._id, newMessage);
    } catch (error) {
      console.error("Error updating order:", error);
      antdMessage.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (value) => {
    const oldStatus = status;
    const newStatus = value;
    const newMessage = `Status changed from ${oldStatus} to ${newStatus}`;
    setStatus(newStatus);
    await updateOrder(newStatus, newMessage);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleUpdateMessage = async () => {
    await updateOrder(status, message);
  };
  const logsForCurrentPage = order
    ? order.logs.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    const totalPages = order ? Math.ceil(order.logs.length / pageSize) : 0;
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Order Detail</Title>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <p>
              <strong>Order Number:</strong> {order.orderNumber}
            </p>
            <p>
              <strong>Receiver Name:</strong> {order.receiverName}
            </p>
            <p>
              <strong>Delivery Address:</strong> {order.deliveryAddress}
            </p>
            <p>
              <strong>Phone Number:</strong> {order.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.PaymentMethodChangeEvent}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <strong>Total Bill:</strong>{" "}
              {new Intl.NumberFormat("en-US").format(order.totalBill)} VND
            </p>
            <p>
              <strong>Note:</strong> {order.note}
            </p>
          </Col>
        </Row>
        <Title level={4}>Ordered Products</Title>
        <List
          itemLayout="horizontal"
          dataSource={order.orderedProducts}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "50px" }}
                  />
                }
                title={item.name}
                description={`Quantity: ${
                  item.quantity
                } | Total: ${new Intl.NumberFormat("en-US").format(
                  item.total
                )} VND`}
              />
            </List.Item>
          )}
        />
        <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button
          onClick={goToNextPage}
          style={{ marginLeft: "10px" }}
          disabled={currentPage * pageSize >= order.logs.length}
        >
          Next
        </Button>

        <Title level={4}>Logs</Title>
        <List
          itemLayout="vertical"
          dataSource={logsForCurrentPage}
          style={{ maxHeight: "400px", overflowY: "auto", fontSize: "14px" , fontWeight: "500"}}
          renderItem={(log) => (
            <List.Item>
              <List.Item.Meta
                description={`[${new Date(log.timestamp).toLocaleString()}] ${
                  log.message
                }`}
              />
            </List.Item>
          )}
        />
        <Title level={4}>Update Status</Title>
        <Form layout="vertical">
          <Form.Item label="Status" initialValue={status}>
            <Select value={status} onChange={handleStatusChange}>
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Message">
            <Input
              value={message}
              onChange={handleMessageChange}
              placeholder="Enter a message for the log"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleUpdateMessage}
              loading={loading}
            >
              Update Message
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OrderDetail;
