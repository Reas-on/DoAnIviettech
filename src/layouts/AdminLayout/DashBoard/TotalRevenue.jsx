import React, { useEffect, useState, useCallback } from "react";
import { Card, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./css/TotalRevenue.css";

const TotalRevenue = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchTotalRevenue = useCallback(async () => {
    try {
      const response = await fetch("https://kiemhieptinhduyen.one/orderData");
      if (!response.ok) {
        throw new Error("Failed to fetch total revenue");
      }
      const data = await response.json();
      const completedOrders = data.filter(
        (order) => order.status === "completed"
      );
      const revenue = completedOrders.reduce(
        (total, order) => total + order.totalBill,
        0
      );
      setTotalRevenue(revenue);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }
  }, []);

  useEffect(() => {
    fetchTotalRevenue();
  }, [fetchTotalRevenue]);

  return (
    <Card className="total-revenue-card">
      <Row align="middle">
        <Col span={6}>
          <UserOutlined className="total-revenue-icon" style={{ fontSize: '24px', color: 'white' }} />
        </Col>
        <Col span={18}>
          <h3 className="total-revenue-title">Total Revenue</h3>
          <p className="total-revenue-number">{new Intl.NumberFormat("en-US").format(totalRevenue)} VND</p>
        </Col>
      </Row>
    </Card>
  );
};

export default TotalRevenue;
