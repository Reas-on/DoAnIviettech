import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Select, Input } from 'antd';

const UserData = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAdminChange = (value) => {
    setEditedUser({ ...editedUser, isAdmin: value });
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:4000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      const newData = data.map(user => ({
        ...user,
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
    const userToEdit = userData.find(user => user._id === id);
    setEditedUser(userToEdit);
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

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:4000/users/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
      message.success('Changes saved successfully');
      setEditingUserId(null);
      setEditedUser(null);
      fetchUserData();
    } catch (error) {
      console.error('Error saving changes:', error);
      message.error('Failed to save changes');
    }
  };

  const handleSearch = () => {
    if (!searchKeyword) {
      fetchUserData();
      return;
    }
    const filteredUsers = userData.filter(user =>
      user.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setUserData(filteredUsers);
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
      render: (text, record) => (
        editingUserId === record._id ? (
          <input
            value={editedUser ? editedUser.name : ''}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
          />
        ) : text
      )
    },
    {
      title: 'Vai Trò',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (text, record) => (
        editingUserId === record._id ? (
          <Select
            value={editedUser ? editedUser.isAdmin : ''}
            style={{ width: 120 }}
            onChange={handleAdminChange}
          >
            <Select.Option value={true}>Admin</Select.Option>
            <Select.Option value={false}>User</Select.Option>
          </Select>
        ) : (text ? 'Admin' : 'User')
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => (
        editingUserId === record._id ? (
          <input
            value={editedUser ? editedUser.email : ''}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
          />
        ) : text
      )
    },
    {
      title: 'Mật khẩu',
      dataIndex: 'password',
      key: 'password',
      render: (text, record) => (
        editingUserId === record._id ? (
          <input
            value={editedUser ? editedUser.password : ''}
            onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
          />
        ) : text
      )
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        editingUserId === record._id ? (
          <input
            value={editedUser ? editedUser.address : ''}
            onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
          />
        ) : text
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text, record) => (
        editingUserId === record._id ? (
          <input
            value={editedUser ? editedUser.phone : ''}
            onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
          />
        ) : text
      )
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      key: 'actions',
      render: (id, record) => (
        <div>
          {editingUserId === record._id ? (
            <>
              <Button type="primary" onClick={handleSaveEdit}>Lưu</Button>
              <Button onClick={() => setEditingUserId(null)}>Hủy</Button>
            </>
          ) : (
            <>
              <Button type="primary" onClick={() => handleEdit(id)}>Sửa</Button>
              <Button type="danger" onClick={() => handleDelete(id)}>Xóa</Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="user-data">
      <h2>User Data</h2>
      <Input.Search
        placeholder="Search users"
        allowClear
        enterButton="Search"
        onSearch={handleSearch}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ marginBottom: 16 }}
      />
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
