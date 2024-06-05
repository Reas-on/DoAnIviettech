import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm, Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';
import VouchersApi from './../../../Api/admin/VouchersApi'; 

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const data = await VouchersApi.getAllVouchers();
      setVouchers(data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const deleteVoucher = async (id) => {
    try {
      await VouchersApi.deleteVoucher(id);
      setVouchers(vouchers.filter(voucher => voucher._id !== id));
      message.success('Voucher deleted successfully');
    } catch (error) {
      message.error(error.message);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const newVoucher = {
        ...values,
        voucherExpiry: values.voucherExpiry.toISOString()
      };
      const data = await VouchersApi.createVoucher(newVoucher);
      setVouchers([...vouchers, data.voucher]);
      message.success('Voucher created successfully');
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'Voucher Name',
      dataIndex: 'voucherName',
      key: 'voucherName',
    },
    {
      title: 'Voucher Code',
      dataIndex: 'voucherCode',
      key: 'voucherCode',
    },
    {
      title: 'Minimum Order Value',
      dataIndex: 'minimumOrderValue',
      key: 'minimumOrderValue',
    },
    {
      title: 'Discount Percentage',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
    },
    {
      title: 'Maximum Discount',
      dataIndex: 'maximumDiscount',
      key: 'maximumDiscount',
    },
    {
      title: 'Voucher Expiry',
      dataIndex: 'voucherExpiry',
      key: 'voucherExpiry',
      render: text => moment(text).format('YYYY-MM-DD')
    },
    {
      title: 'Usage Limit',
      dataIndex: 'usageLimit',
      key: 'usageLimit',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this voucher?"
          onConfirm={() => deleteVoucher(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h1>Vouchers</h1>
      <Button type="primary" onClick={showModal}>
        Create Voucher
      </Button>
      <Table columns={columns} dataSource={vouchers} rowKey="_id" />
      <Modal
        title="Create Voucher"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleCreate}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="voucherName"
            label="Voucher Name"
            rules={[{ required: true, message: 'Please input the voucher name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="voucherCode"
            label="Voucher Code"
            rules={[{ required: true, message: 'Please input the voucher code!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="minimumOrderValue"
            label="Minimum Order Value"
            rules={[{ required: true, message: 'Please input the minimum order value!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="discountPercentage"
            label="Discount Percentage"
            rules={[{ required: false, message: 'Please input the discount percentage!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="maximumDiscount"
            label="Maximum Discount"
            rules={[{ required: true, message: 'Please input the maximum discount!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="voucherExpiry"
            label="Voucher Expiry"
            rules={[{ required: true, message: 'Please input the voucher expiry date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="usageLimit"
            label="Usage Limit"
            rules={[{ required: true, message: 'Please input the usage limit!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vouchers;
