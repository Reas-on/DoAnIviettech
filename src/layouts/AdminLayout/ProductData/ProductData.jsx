import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Button, Input, Checkbox, message } from 'antd';

const ProductData = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/product/allproducts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const productData = await response.json();
        setProduct(productData);
        setEditedProduct(productData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/product/allproducts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProduct),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      setIsEditing(false);
      setProduct(editedProduct); // Cập nhật dữ liệu sản phẩm mới
      setShowPopup(true);
      message.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Failed to update product');
    }
  };
  
  const handleClose = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const closePopup = () => {
    setShowPopup(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {product ? (
        <div>
          <h2>Product Detail</h2>
          <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="ID">{product.id}</Descriptions.Item>
            <Descriptions.Item label="Name">
              {isEditing ? (
                <Input name="name" value={editedProduct.name} onChange={handleChange} />
              ) : (
                product.name
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Image">
              <img src={product.image} alt={product.name} style={{ maxWidth: '100px' }} />
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {isEditing ? (
                <Input name="category" value={editedProduct.category} onChange={handleChange} />
              ) : (
                product.category
              )}
            </Descriptions.Item>
            <Descriptions.Item label="New Price">
              {isEditing ? (
                <Input name="new_price" value={editedProduct.new_price} onChange={handleChange} />
              ) : (
                product.new_price
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Old Price">
              {isEditing ? (
                <Input name="old_price" value={editedProduct.old_price} onChange={handleChange} />
              ) : (
                product.old_price
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Available">
              {isEditing ? (
                <Checkbox
                  name="available"
                  checked={editedProduct.available}
                  onChange={handleChange}
                />
              ) : (
                product.available ? 'Yes' : 'No'
              )}
            </Descriptions.Item>
          </Descriptions>
          {isEditing ? (
            <div>
              <Button type="primary" onClick={handleSave}>Save</Button>
              <Button onClick={handleClose}>Close</Button>
            </div>
          ) : (
            <Button onClick={handleEdit}>Edit</Button>
          )}
        </div>
      ) : (
        <div>No product data available</div>
      )}
      {showPopup && (
        <div className="popup">
          <span className="popup-close" onClick={closePopup}>
            &times;
          </span>
          <p className="popup-message">Thông tin sản phẩm đã được cập nhật!</p>
        </div>
      )}
    </div>
  );
};

export default ProductData;
