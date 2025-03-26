const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
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
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Import models
const UserModel = require('./model/User');
const ItemModel = require('./model/item');
const OrderModel = require('./model/order');

const requiredEnvVars = [
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'JWT_SECRET'
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`ERROR: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}
// Initialize Express app
const app = express();

// Enhanced security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://time-zone-frontend.vercel.app',
  'https://time-zone-first-project-api.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database connection with improved settings
const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      console.log(`Attempting MongoDB connection (attempt ${retryCount + 1})...`);

      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority'
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retryCount++;
      console.error(`MongoDB Connection Error (attempt ${retryCount}): ${error.message}`);

      if (retryCount === maxRetries) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }

      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};
connectDB();
 
// Cloudinary configuration with enhanced settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Multer storage configurations
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Time_Zone/users",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
  }
});

const itemStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Time_Zone/items",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    transformation: [{ width: 1200, height: 1200, crop: "limit" }]
  }
});

const upload = multer({
  storage: userStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image');

const Itemupload = multer({
  storage: itemStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
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
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// User Routes
app.post("/createuser", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
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
  Itemupload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { itemname, itemprice, category, detail } = req.body;
      const image1 = req.files?.image1?.[0]?.path || null;
      const image2 = req.files?.image2?.[0]?.path || null;
      const image3 = req.files?.image3?.[0]?.path || null;

      if (!itemname || !itemprice || !category || !detail || !image1) {
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
        images: { image1, image2, image3 },
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
    if (!item || item.length === 0) {
      return res.status(500).json("Product not found");
    }
    res.json(item);
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json(err);
  }
});

app.put("/updateproduct/:id", (req, res) => {
  Itemupload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const id = req.params.id;
      const { itemname, itemprice, category, detail } = req.body;
      const updateProduct = { itemname, itemprice, detail, category };

      if (req.files) {
        if (req.files.image1) updateProduct.image1 = req.files.image1[0].path;
        if (req.files.image2) updateProduct.image2 = req.files.image2[0].path;
        if (req.files.image3) updateProduct.image3 = req.files.image3[0].path;
      }

      const item = await ItemModel.findByIdAndUpdate(id, updateProduct, { new: true });
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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Export for Vercel
module.exports = app;

// Start server if not in Vercel environment
if (require.main === module) {
  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Listening on port ${PORT}`);
  });
}