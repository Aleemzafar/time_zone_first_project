const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Import models
const UserModel = require('./model/User');
const ItemModel = require('./model/item');
const OrderModel = require('./model/order');
 
// Initialize Express app
const app = express();

// Enhanced security middleware
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Connection event listeners
mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Connection function
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
}

// Call connectDB when starting your server
connectDB();

// Cloudinary configuration - updated with simpler setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Cloudinary storage configurations
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: folder,
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
      };
    }
  });
};

const userStorage = createCloudinaryStorage('Time_Zone/users');
const itemStorage = createCloudinaryStorage('Time_Zone/items');

// Multer upload configurations
const upload = multer({
  storage: userStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single("image");

const uploadItemImages = multer({
  storage: itemStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
}).fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]);

// Authentication Middlewares
const verifyUser = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    req.user = decoded;
    next();
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// User Routes
app.post("/createuser", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large (max 5MB)' });
      }
      return res.status(400).json({ error: err.message });
    }

    try {
      const { username, email, age, password } = req.body;
      const image = req.file ? req.file.path : null;

      if (!username || !email || !password || !age) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      const count = await UserModel.countDocuments();
      const role = count === 0 ? "admin" : "user";
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        username,
        email,
        image,
        age,
        password: hashedPassword,
        role,
      });

      res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
      console.error("User creation error:", err);
      res.status(500).json({ error: "An error occurred during user creation" });
    }
  });
});

app.get("/allusers", async (req, res) => {
  try {
    const users = await UserModel.find({ role: { $ne: "admin" } });
    if (!users || users.length === 0) { 
      return res.status(404).json({ error: "No User Found" });
    }
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000
    }).json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

app.get("/dashboard", verifyAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard" });
});

app.get("/userprofile", verifyUser, async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "An error occurred while fetching user profile" });
  }
});

app.get("/search", verifyAdmin, async (req, res) => {
  try {
    const query = req.query.username || "";
    const users = await UserModel.find({ username: { $regex: query, $options: "i" } });
    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/updateUser/:id", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const id = req.params.id;
      const { username, email, age, password } = req.body;
      const updateData = { username, email, age };

      if (req.file) {
        updateData.image = req.file.path;
      }

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error("Update user error:", err);
      res.status(500).json({ message: "Error updating user" });
    }
  });
});

app.get("/getUser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "An error occurred while fetching the user" });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByIdAndDelete({ _id: id });
    res.json(user);
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json(err);
  }
});

// Item Routes
app.post("/addnewitem", (req, res) => {
  uploadItemImages(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large (max 5MB per file)' });
      }
      return res.status(400).json({ error: err.message });
    }

    try {
      const { itemname, itemprice, category, detail } = req.body;
      
      // Get file paths if they exist
      const images = {
        image1: req.files?.image1?.[0]?.path || null,
        image2: req.files?.image2?.[0]?.path || null,
        image3: req.files?.image3?.[0]?.path || null
      };

      if (!itemname || !itemprice || !category || !detail || !images.image1) {
        return res.status(400).json({ error: "All fields are required, and at least one image must be uploaded" });
      }

      const existingItem = await ItemModel.findOne({ itemname });
      if (existingItem) {
        return res.status(400).json({ error: "Item already exists" });
      }

      const newItem = await ItemModel.create({
        itemname,
        detail,
        itemprice: parseFloat(itemprice),
        images,
        category,
      });

      res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (err) {
      console.error("Item creation error:", err);
      res.status(500).json({ error: "Database error while saving item" });
    }
  });
});

app.get("/allitems", async (req, res) => {
  try {
    const items = await ItemModel.find();
    if (!items || items.length === 0) {
      return res.status(404).json({ error: "No items found" });
    }
    res.json(items);
  } catch (err) {
    console.error("Fetch items error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/itemdetail/:id", async (req, res) => {
  try {
    const item = await ItemModel.findOne({ _id: req.params.id });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("Item detail error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Order Routes
app.post("/orders", async (req, res) => {
  try {
    const { email, contactNumber, items, total } = req.body;
    const newOrder = new OrderModel({ email, contactNumber, items, total });
    const order = await newOrder.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.get("/allorders", async (req, res) => {
  try {
    const orders = await OrderModel.find();
    if (orders.length === 0 || !orders) {
      return res.status(200).json({ message: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.delete("/deleteorder/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await OrderModel.findOneAndDelete({ _id: id });
    res.json(order);
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json(err);
  }
});

// Statistics Routes
app.get("/countorder", async (req, res) => {
  try {
    const count = await OrderModel.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Count order error:", err);
    res.status(500).json("Something went wrong with order counting");
  }
});

app.get("/countitem", async (req, res) => {
  try {
    const count = await ItemModel.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Count item error:", err);
    res.status(500).json("Something went wrong with item counting");
  }
});

// Category Routes
app.get("/newarrival", async (req, res) => {
  try {
    const item = await ItemModel.find({ category: { $eq: "newarrival" } });
    if (!item || item.length === 0) {
      return res.status(404).json("No items found for newarrival");
    }
    res.json(item);
  } catch (err) {
    console.error("New arrival error:", err);
    res.status(500).json(err);
  }
});

app.get("/lowprice", async (req, res) => {
  try {
    const item = await ItemModel.find({ category: { $eq: "lowprice" } });
    if (!item || item.length === 0) {
      return res.status(404).json("Something went wrong with lowprice item fetching");
    }
    res.json(item);
  } catch (err) {
    console.error("Low price error:", err);
    res.status(500).json(err);
  }
});

app.get("/mostpopular", async (req, res) => {
  try {
    const item = await ItemModel.find({ category: { $eq: "mostpopular" } });
    if (!item || item.length === 0) {
      return res.status(404).json("Something went wrong with mostpopular item fetching");
    }
    res.json(item);
  } catch (err) {
    console.error("Most popular error:", err);
    res.status(500).json(err);
  }
});

// Product Management Routes
app.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const item = await ItemModel.findByIdAndDelete({ _id: id });
    if (!item) {
      return res.status(404).json("Product not found");
    }
    res.json(item);
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json(err);
  }
});

app.put("/updateproduct/:id", (req, res) => {
  uploadItemImages(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const id = req.params.id;
      const { itemname, itemprice, category, detail } = req.body;
      const updateData = { itemname, itemprice, category, detail };

      // Update images if they were uploaded
      if (req.files) {
        if (req.files.image1) updateData['images.image1'] = req.files.image1[0].path;
        if (req.files.image2) updateData['images.image2'] = req.files.image2[0].path;
        if (req.files.image3) updateData['images.image3'] = req.files.image3[0].path;
      }

      const item = await ItemModel.findByIdAndUpdate(
        id, 
        { $set: updateData },
        { new: true }
      );
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (err) {
      console.error("Update product error:", err);
      res.status(500).json({ message: "Error updating item" });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 4001; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;