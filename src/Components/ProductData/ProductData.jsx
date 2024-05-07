import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductData = () => {
  const { id } = useParams(); // Trích xuất id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/allproducts/${id}`); 
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
  }, [id]); // Chạy useEffect mỗi khi id thay đổi

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/allproducts/${id}`, {
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
      // Fetch lại thông tin sản phẩm sau khi lưu thành công
      fetchProduct();
      setShowPopup(true); // Hiển thị popup khi lưu thành công
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  // Hàm fetch lại thông tin sản phẩm từ API
  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:4000/allproducts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const productData = await response.json();
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
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
          <div>
            <p>ID: {product.id}</p>
            <p>
              Name:{' '}
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleChange}
                />
              ) : (
                product.name
              )}
            </p>
            <p>
              Image:{' '}
              <img src={product.image} alt={product.name} style={{ maxWidth: '100px' }} />
            </p>
            <p>
              Category:{' '}
              {isEditing ? (
                <input
                  type="text"
                  name="category"
                  value={editedProduct.category}
                  onChange={handleChange}
                />
              ) : (
                product.category
              )}
            </p>
            <p>
              New Price:{' '}
              {isEditing ? (
                <input
                  type="text"
                  name="new_price"
                  value={editedProduct.new_price}
                  onChange={handleChange}
                />
              ) : (
                product.new_price
              )}
            </p>
            <p>
              Old Price:{' '}
              {isEditing ? (
                <input
                  type="text"
                  name="old_price"
                  value={editedProduct.old_price}
                  onChange={handleChange}
                />
              ) : (
                product.old_price
              )}
            </p>
            <p>
              Available:{' '}
              {isEditing ? (
                <input
                  type="checkbox"
                  name="available"
                  checked={editedProduct.available}
                  onChange={handleChange}
                />
              ) : (
                product.available ? 'Yes' : 'No'
              )}
            </p>
            <p>Date: {product.date}</p>
            {isEditing ? (
              <div>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleClose}>Close</button>
              </div>
            ) : (
              <button onClick={handleEdit}>Edit</button>
            )}
          </div>
        </div>
      ) : (
        <div>No product data available</div>
      )}
      {showPopup && (
        <div className="popup">
          <span className="popup-close" onClick={closePopup}>
            &times;
          </span>
          <p className="popup-message">Đã Thay Đổi Thông Tin</p>
          <p className="popup-message">Thông tin mới: {JSON.stringify(editedProduct)}</p>
          <p className="popup-message">Thông tin cũ: {JSON.stringify(product)}</p>
        </div>
      )}
    </div>
  );
};

export default ProductData;
