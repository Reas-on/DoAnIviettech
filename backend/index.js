const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
// Import schema from the new directory
const Product = require("./Schema/ProductSchema");
const User = require("./Schema/UsersSchema");
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
      return res.status(200).json({
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

// Route để lấy thông tin của một người dùng dựa trên tên
app.get("/users/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Thêm một endpoint để lấy thông tin người dùng từ token
app.get("/user", async (req, res) => {
  try {
    // Lấy token từ header của yêu cầu
    const token = req.headers.authorization.split(" ")[1];
    
    // Giải mã token để lấy thông tin người dùng
    const decoded = jwt.verify(token, YOUR_JWT_SECRET);
    
    // Lấy thông tin người dùng từ decoded token
    const user = await User.findById(decoded.user.id);
    
    // Trả về thông tin người dùng
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/signup", async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user found with same email",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});
// creating endpoint login
app.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, "secret_ecom");
      res.json({ success: true, authToken });
    } else {
      res.status(400).json({ success: false, errors: "Incorrect password" });
    }
  } else {
    res.json({ success: false, errors: "Invalid Email" });
  }
});

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
