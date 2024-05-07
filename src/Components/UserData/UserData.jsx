import React, { useState, useEffect } from 'react';
import md5 from 'md5'; // Import thư viện md5
import './UserData.css';

const UserData = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/users')
      .then(response => response.json())
      .then(data => {
        // Mã hóa mật khẩu thành MD5
        const newData = data.map(user => {
          return {
            ...user,
            password: md5(user.password)
          };
        });
        setUserData(newData);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleEdit = (id) => {
    console.log(`Editing user with ID ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Deleting user with ID ${id}`);
  };

  return (
    <div className="user-data">
      <h2>User Data</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Khách Hàng</th>
            <th>Email</th>
            <th>Mật khẩu</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.address || '-'}</td>
              <td>{user.phone || '-'}</td>
              <td>
                <button onClick={() => handleEdit(user._id)}>Sửa</button>
                <button onClick={() => handleDelete(user._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserData;
