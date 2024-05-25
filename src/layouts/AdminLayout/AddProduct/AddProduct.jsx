import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../../assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    old_price: "",
    new_price: "",
    category: "women",
    image: "",
    shortDescription: "",
    longDescription: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });
  };

  const Add_Product = async () => {
    try {
      console.log(productDetails);
      let responseData;
      let product = productDetails;

      let formData = new FormData();
      formData.append("product", image);

      const uploadResponse = await fetch("http://localhost:4000/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      responseData = await uploadResponse.json();

      if (responseData.success) {
        product.image = responseData.image_url;

        const addProductResponse = await fetch(
          "http://localhost:4000/product/addproduct",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );

        responseData = await addProductResponse.json();

        if (responseData.success) {
          alert(
            `Product Added Successfully:\nName: ${product.name}\nNew Price: ${product.new_price}\nOld Price: ${product.old_price}\nCategory: ${product.category}\nImage: ${product.image}`
          );
        } else {
          alert("Product Not Added");
        }
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
      alert("Error adding product: " + error.message);
    }
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Enter product name"
        />
      </div>
      <div className="addproduct-price">
        <p>Price</p>
        <input
          value={productDetails.old_price}
          onChange={changeHandler}
          type="text"
          name="old_price"
          placeholder="Enter product price"
        />
      </div>
      <div className="addproduct-price">
        <p>Offer Price</p>
        <input
          value={productDetails.new_price}
          onChange={changeHandler}
          type="text"
          name="new_price"
          placeholder="Enter product price"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">women</option>
          <option value="men">men</option>
          <option value="kid">kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Short Description</p>
        <textarea
          value={productDetails.shortDescription}
          onChange={changeHandler}
          name="shortDescription"
          placeholder="Enter short description"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Long Description</p>
        <textarea
          value={productDetails.longDescription}
          onChange={changeHandler}
          name="longDescription"
          placeholder="Enter long description"
        />
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} alt="" />
          <p>Upload product image</p>
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button
        onClick={() => {
          Add_Product();
        }}
        className="addproduct-btn"
      >
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
