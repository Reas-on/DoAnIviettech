import React, { useEffect, useState, useCallback } from 'react';
import { Select, DatePicker, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Option } = Select;
const { RangePicker } = DatePicker;

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [viewMode, setViewMode] = useState('30days');
  const [dateRange, setDateRange] = useState([moment().subtract(30, 'days'), moment()]);

  const fetchRevenueData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/orderData');
      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }
      const data = await response.json();
      const completedOrders = data.filter(order => order.status === 'completed');
      setRevenueData(transformData(completedOrders, viewMode, dateRange));
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  }, [viewMode, dateRange]);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData, viewMode, dateRange]);

  const transformData = (orders, mode, range) => {
    const groupedData = {};
    orders.forEach(order => {
      const date = moment(order.createdAt);
      if (mode === 'custom' || mode === '7days' || mode === '30days') {
        if (!date.isBetween(range[0], range[1], null, '[]')) {
          return;
        }
      }
      let key;
      if (mode === '30days' || mode === '7days' || mode === 'custom') {
        key = date.format('YYYY-MM-DD');
      } else if (mode === 'yearly') {
        key = date.format('YYYY');
      } else if (mode === 'monthly') {
        key = date.format('YYYY-MM');
      }
      if (!groupedData[key]) {
        groupedData[key] = { total: 0, productsSold: 0 };
      }
      groupedData[key].total += order.totalBill;
      groupedData[key].productsSold += order.orderedProducts.reduce((acc, product) => acc + product.quantity, 0);
    });
    return Object.entries(groupedData)
      .map(([date, { total, productsSold }]) => ({ date, total, productsSold }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure data is sorted by date
  };

  const handleViewModeChange = value => {
    setViewMode(value);
    if (value !== 'custom') {
      const now = moment();
      let newRange;
      if (value === '30days') {
        newRange = [now.clone().subtract(30, 'days'), now];
      } else if (value === '7days') {
        newRange = [now.clone().subtract(7, 'days'), now];
      } else if (value === 'monthly') {
        newRange = [now.clone().subtract(1, 'year'), now];
      } else if (value === 'yearly') {
        newRange = [now.clone().subtract(5, 'years'), now];
      }
      setDateRange(newRange);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(revenueData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RevenueData');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'revenue_data.xlsx');
  };

  return (
    <div>
      <h3>Revenue Chart</h3>
      <Select value={viewMode} onChange={handleViewModeChange}>
        <Option value="7days">Last 7 days</Option>
        <Option value="30days">Last 30 days</Option>
        <Option value="monthly">Monthly</Option>
        <Option value="yearly">Yearly</Option>
        <Option value="custom">Custom</Option>
      </Select>
      {viewMode === 'custom' && (
        <RangePicker value={dateRange} onChange={setDateRange} />
      )}
      <Button onClick={exportToExcel} style={{ margin: '10px 0' }}>Export to Excel</Button>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Total Revenue">
            <LabelList dataKey="total" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="productsSold" fill="#ff0000" name="Products Sold">
            <LabelList dataKey="productsSold" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
