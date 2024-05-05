const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// Import schema from the new directory
const Product = require("./Schema/ProductSchema");
app.use(express.json());
app.use(cors());

// Mongoose connect
mongoose.connect(
  ""
);

// Image Store
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Upload endpoint
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
    message: "File uploaded successfully",
  });
});

// Add product endpoint
app.post("/addproduct", async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      avilable: req.body.avilable,
    });

    await product.save();
    console.log("Product Added:", product);
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove Product
app.post("/removeproduct", async (req, res) => {
  try {
    const productId = req.body.id;
    const product = await Product.findOneAndDelete({ id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        name: req.body.name, // Thêm trường "name" vào phản hồi
      });
    } else {
      return res
        .status(200)
        .json({
          success: true,
          message: "Product removed successfully",
          productid: productId,
          name: req.body.name, // Thêm trường "name" vào phản hồi
        });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get Product
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Edit Product
app.put("/editproduct", async (req, res) => {
  try {
    const productId = req.body.id;
    const product = await Product.findOneAndUpdate(
      { id: productId },
      req.body,
      { new: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Product updated successfully" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
