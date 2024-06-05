import React, { useState } from "react";
import { Button, Input, Modal, message } from "antd";
import findUserApi from "../../../Api/admin/findUserApi"; 
const FindUser = () => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSearch = async () => {
    try {
      const data = await findUserApi.searchUser(searchQuery);
      if (data.length > 0) {
        setSearchResult(data);
        setVisible(true);
      } else {
        message.info("No user found.");
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