import React, { useState } from "react";
import { Button, Input, Modal, message } from "antd";

const FindUser = () => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSearch = async () => {
    try {
      // Gửi yêu cầu tìm kiếm lên máy chủ
      const response = await fetch(
        `http://localhost:4000/users?query=${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setSearchResult(data);
          setVisible(true);
        } else {
          message.info("No user found.");
        }
      } else {
        throw new Error("Failed to search user");
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      message.error(
        "An error occurred while searching, please try again later!"
      );
    }
  };

  return (
    <>
      <span>Find: </span>
      <Input
        style={{ width: "200px", marginRight: "10px" }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onPressEnter={handleSearch} // Thực hiện tìm kiếm khi nhấn Enter
      />
      <Button type="primary" onClick={handleSearch}>
        Find
      </Button>
      <Modal
        title="Find User"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <ul>
          {searchResult.map((user, index) => (
            <li key={index}>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              {user.phone && <p>Phone: {user.phone}</p>}
              {user.address && <p>Address: {user.address}</p>}
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

export default FindUser;