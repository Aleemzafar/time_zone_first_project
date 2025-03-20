const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const UserModel = require("./model/User");
const ItemModel = require("./model/item");
const Order = require('./model/order');
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const cookieParser = require("cookie-parser");
const _dirname = path.resolve();
const app = express();
const allowedOrigins = [
  "http://localhost:4001",
  "https://timezone.com",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman) and those from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: Origin ${origin} is not allowed.`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials like cookies, authorization headers, etc.
}));


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

const verifyUser = (req, res, next) => {
  const token =
    req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // Attach decoded payload to the request
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



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Time_Zone_data",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});

const upload = multer({ storage: storage });

app.post("/createuser", upload.single("image"), (req, res) => {
  const { username, email, age, password } = req.body;
  const image = req.file ? req.file.path : null;

  if (!username || !email || !password || !age) {
    return res.status(400).json({ error: "All fields are required" });
  }

  UserModel.findOne({ email }).then(existingUser => {
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    UserModel.countDocuments().then(count => {
      const role = count === 0 ? "admin" : "user";

      bcrypt.hash(password, 10).then(hashedPassword => {
        UserModel.create({
          username,
          email,
          image,
          age,
          password: hashedPassword,
          role,
        }).then(user => {
          res.status(201).json({
            message: "User created successfully",
            user,
          });
        }).catch(err => {
          console.error(err);
          res.status(500).json({ error: "An error occurred during user creation" });
        });
      }).catch(err => {
        console.error(err);
        res.status(500).json({ error: "Error hashing password" });
      });
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: "Error checking user count" });
    });
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  });
});

app.get("/allusers", (req, res) => {
  UserModel.find({ role: { $ne: "admin" } }) // Exclude admin users
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).json({ error: "No User Found" });
      }
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
    });
});

/* 
Operator	Meaning
$eq	Equal to ({ role: { $eq: "user" } })
$ne	Not equal to ({ role: { $ne: "admin" } })
$gt	Greater than ({ age: { $gt: 18 } })
$gte	Greater than or equal to ({ age: { $gte: 18 } })
$lt	Less than ({ age: { $lt: 60 } })
$lte	Less than or equal to ({ age: { $lte: 60 } })*/


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  UserModel.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
          }

          const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          // Send token in a cookie and in the response body
          res
            .cookie("token", token, {
              httpOnly: true, // Prevents JavaScript access for security
              secure: process.env.NODE_ENV === "production", // Use secure cookies in production
              sameSite: "Strict", // Prevents CSRF attacks
            })
            .json({ message: "Login successful", token, user });
        })
        .catch(err => {
          console.error("Password comparison error:", err);
          res.status(500).json({ message: "Error comparing passwords" });
        });
    })
    .catch(err => {
      console.error("Database error:", err);
      res.status(500).json({ message: "Database error" });
    });
});

app.get("/dashboard", verifyAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard" });
});


app.get("/userprofile/", verifyUser, (req, res) => {
  UserModel.findOne({ email: req.user.email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch(err => {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "An error occurred while fetching user profile", error: err });
    });
});


app.get("/search", verifyAdmin, (req, res) => {
  const query = req.query.username || "";
  UserModel.find({ username: { $regex: query, $options: "i" } })
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: "An error occurred" }));
});


app.put("/updateUser/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const { username, email, age, password } = req.body;
  const updateData = { username, email, age };

  if (req.file) {
    updateData.image = req.file.path;
  }

  if (password) {
    bcrypt.hash(password, 10)
      .then(hashpassword => {
        updateData.password = hashpassword;
        UserModel.findByIdAndUpdate(id, updateData, { new: true })
          .then(user => {
            if (!user) {
              return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
          })
          .catch(err => res.status(500).json({ message: "Error updating user", error: err }));
      })
      .catch(err => {
        res.status(500).json({ message: "Password hashing not successful", error: err });
      });
  } else {
    UserModel.findByIdAndUpdate(id, updateData, { new: true })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      })
      .catch(err => res.status(500).json({ message: "Error updating user", error: err }));
  }
});

app.get("/getUser/:id", (req, res) => {
  const id = req.params.id;

  UserModel.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch(err => {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "An error occurred while fetching the user", error: err });
    });
});



app.delete("/deleteUser/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndDelete({ _id: id })
    .then((user) => res.json(user))
    .catch(err => res.json(err))
});



//items API's
const itemstorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Item_images",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});

const Itemupload = multer({ storage: itemstorage }).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
]); // Handle 3 distinct file fields

app.post("/addnewitem", Itemupload, (req, res) => {
  ("Request Body:", req.body);
  ("Uploaded Files:", req.files);

  const { itemname, itemprice, category, detail } = req.body;

  // Extract file paths from req.files
  const image1 = req.files?.image1?.[0]?.path || null;
  const image2 = req.files?.image2?.[0]?.path || null;
  const image3 = req.files?.image3?.[0]?.path || null;


  if (!itemname || !itemprice || !category || !detail || !image1) {
    return res.status(400).json({ error: "All fields are required, and at least one image must be uploaded" });
  }

  ItemModel.findOne({ itemname })
    .then(existingItem => {
      if (existingItem) {
        return res.status(400).json({ error: "Item already exists" });
      }

      // Create a new item
      const newItem = new ItemModel({
        itemname,
        detail,
        itemprice: parseFloat(itemprice), // Ensure price is a number
        images: {
          image1,
          image2,
          image3,
        }, // Store images in an object
        category,
      });

      // Save item to database
      newItem
        .save()
        .then(item => {
          res.status(201).json({
            message: "Item added successfully",
            item,
          });
        })
        .catch(err => {
          console.error("Error saving item:", err);
          res.status(500).json({ error: "Database error while saving item" });
        });
    })
    .catch(err => {
      console.error("Error finding item:", err);
      res.status(500).json({ error: "Database error while checking existing item" });
    });
});
app.get("/allitems", (req, res) => {
  ItemModel.find()
    .then((items) => {
      if (!items || items.length === 0) {
        return res.status(404).json({ error: "No items found" });
      }
      res.json(items);
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
    });

});
app.get("/itemdetail/:id", (req, res) => {
  ItemModel.findOne({ _id: req.params.id })
    .then((item) => {
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error", details: err });
    });
});

//Order API
app.post('/orders', async (req, res) => {
  try {
    const { email, contactNumber, items, total } = req.body;
    const newOrder = new Order({
      email,
      contactNumber,
      items,
      total,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});


// Fetch all orders
app.get("/allorders", (req, res) => {
  Order.find()
    .then((orders) => {
      if (orders.length === 0 || !orders) {
        return res.status(200).json({ message: "No orders found" });
      }
      res.status(200).json(orders);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch orders", details: err });
    });
});


app.delete("/deleteorder/:id", (req, res) => {
  const id = req.params.id;
  Order.findOneAndDelete({ _id: id })
    .then((order) => {
      res.json(order);
    })
    .catch((err) => {
      res.status(201).json(err);
    });
});

app.get("/countorder", (req, res) => {
  Order.countDocuments()
    .then((count) => {
      res.json({ count });
    })
    .catch((err) => {
      res.status(201).json("Something went wrong with order counting ");
    })
});
app.get("/countitem", (req, res) => {
  ItemModel.countDocuments()
    .then((count) => {
      res.json({ count });
    })
    .catch((err) => {
      res.status(201).json("Something went wrong with item counting ");
    })
});


app.get("/newarrival", (req, res) => {
  ItemModel.find({ category: { $eq: "newarrival" } })
    .then((item) => {
      if (!item || item.length === 0) {
        // Send an error response and stop further execution
        return res.status(404).json("No items found for newarrival");
      }
      // Send the successful response
      return res.json(item); // Add return here
    })
    .catch((err) => {
      // Handle any errors
      return res.status(500).json(err); // Add return here
    });
});

app.get("/lowprice", (req, res) => {
  ItemModel.find({ category: { $eq: "lowprice" } })
    .then((item) => {
      if (!item || item.length === 0) {
        // Send an error response and stop further execution
        return res.status(404).json("Something went wrong with lowprice item fetching");
      }
      // Send the successful response
      return res.json(item); // Add return here
    })
    .catch((err) => {
      // Handle any errors
      return res.status(500).json(err); // Add return here
    });
});

app.get("/mostpopular", (req, res) => {
  ItemModel.find({ category: { $eq: "mostpopular" } })
    .then((item) => {
      if (!item || item.length === 0) {
        // Send an error response and stop further execution
        return res.status(404).json("Something went wrong with mostpopular item fetching");
      }
      // Send the successful response
      return res.json(item); // Add return here
    })
    .catch((err) => {
      // Handle any errors
      return res.status(500).json(err); // Add return here
    });
});



app.delete(`/deleteproduct/:id`, (req, res) => {
  const id = req.params.id;
  ItemModel.findByIdAndDelete({ _id: id })
    .then((item) => {
      if (!item || item.length === 0) {
        res.status(500).json("Product not found");
      }
      res.json(item)
    }).catch((err) => {
      res.status(201).json(err);
    })
});



app.put("/updateproduct/:id", Itemupload, (req, res) => {
  const id = req.params.id;
  const { itemname, itemprice, category, detail } = req.body;
  const updateProduct = { itemname, itemprice, detail, category };

  if (req.files) {
    if (req.files.image1) updateProduct.image1 = req.files.image1[0].path;
    if (req.files.image2) updateProduct.image2 = req.files.image2[0].path;
    if (req.files.image3) updateProduct.image3 = req.files.image3[0].path;
  }

  ItemModel.findByIdAndUpdate(id, updateProduct, { new: true })
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating item", error: err });
    });
});

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*" ,(req,res)=>{
  res.sendFile(path.resolve(_dirname,"client","dist","index.html"));
})
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
