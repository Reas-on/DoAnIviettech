import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Input, message, Popconfirm } from "antd";
import listProductApi from "../../../Api/admin/listProductApi";

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInfo = useCallback(async () => {
    try {
      const data = await listProductApi.getAllProducts(currentPage);
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      messageApi.error("Failed to fetch data");
    }
  }, [currentPage, messageApi]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo, currentPage]);

  const removeProduct = async (productId) => {
    try {
      await listProductApi.removeProduct(productId);
      await fetchInfo();
      messageApi.success("Product removed successfully.");
    } catch (error) {
      console.error("Error removing product:", error.message);
      messageApi.error("Failed to remove product.");
    }
  };

  const handleViewProduct = (product) => {
    window.open(`http://localhost:3000/product/${product.id}`, "_blank");
  };

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Product",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt="" style={{ width: "50px" }} />,
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/admin/listProduct/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Old Price",
      dataIndex: "old_price",
      key: "old_price",
      render: (text) => `${text.toLocaleString("en-US")} VND`,
    },
    {
      title: "New Price",
      dataIndex: "new_price",
      key: "new_price",
      render: (text) => `${text.toLocaleString("en-US")} VND`,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button
            type="link"
            onClick={() => handleViewProduct(record)}
            style={{ marginRight: 8 }}
          >
            View Product
          </Button>
          <Popconfirm
            title="Are you sure you want to remove this product?"
            onConfirm={() => removeProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Remove
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <h1>List Product</h1>
      <Input
        placeholder="Enter product name to filter"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      <Table
        columns={columns}
        dataSource={filteredProducts}
        pagination={{
          current: currentPage,
          pageSize: 9,
          total: allProducts.length,
          onChange: (page) => setCurrentPage(page),
        }}
        rowKey="id"
      />
    </div>
  );
};

export default ListProduct;
