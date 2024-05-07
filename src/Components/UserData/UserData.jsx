import React, { useState, useEffect } from 'react';
import md5 from 'md5';
import { Table, Button, Modal, message } from 'antd';

const UserData = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setEditingUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:4000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      // Mã hóa mật khẩu thành MD5
      const newData = data.map(user => ({
        ...user,
        password: md5(user.password)
      }));
      setUserData(newData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditingUserId(id);
  };

  const handleDelete = (id) => {
    setDeleteUserId(id);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/users/${deleteUserId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      message.success('User deleted successfully');
      fetchUserData();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    } finally {
      setDeleteUserId(null);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Tên Khách Hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mật khẩu',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => text || '-',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || '-',
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      key: 'actions',
      render: (id) => (
        <div>
          <Button type="primary" onClick={() => handleEdit(id)}>Sửa</Button>
          <Button type="danger" onClick={() => handleDelete(id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="user-data">
      <h2>User Data</h2>
      <Table
        dataSource={userData}
        columns={columns}
        loading={loading}
        rowKey="_id"
      />
      <Modal
        title="Confirm Delete"
        visible={!!deleteUserId}
        onOk={confirmDelete}
        onCancel={() => setDeleteUserId(null)}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
};

export default UserData;
