const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require('cors');
const UserModel = require("./model/User");
const ItemModel = require("./model/item");
const Order = require('./model/order');
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: ["https://time-zone-first-project-api.vercel.app.vercel.app"],
  method: ["POST", "GET"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error('❌ Error: MONGODB_URI is undefined. Check your .env file.');
    process.exit(1); // Stop execution if URI is missing
}

mongoose.connect(mongoURI)
    .then(() => console.log('✅==-=Connected to MongoDB'))
    .catch(err => {
        console.error('❌ Connection error:', err.message);
        process.exit(1); // Stop execution on connection failure
    });







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

  UserModel.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      UserModel.countDocuments()
        .then(count => {
          const role = count === 0 ? "admin" : "user";

          bcrypt.hash(password, 10)
            .then(hashedPassword => {
              UserModel.create({
                username,
                email,
                image,
                age,
                password: hashedPassword,
                role,
              })
                .then(user => {
                  res.status(201).json({ message: "User created successfully", user });
                })
                .catch(err => {
                  res.status(500).json({ error: "An error occurred during user creation" });
                });
            })
            .catch(err => {
              res.status(500).json({ error: "Error hashing password" });
            });
        })
        .catch(err => {
          res.status(500).json({ error: "Error checking user count" });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Database error" });
    });
});

app.get("/allusers", (req, res) => {
  UserModel.find({ role: { $ne: "admin" } })
    .then(users => {
      if (!users || users.length === 0) {
        return res.status(404).json({ error: "No User Found" });
      }
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
    });
});

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

          res
            .cookie("token", token, {
              httpOnly: true,
              sameSite: "Strict",
            })
            .json({ message: "Login successful", token, user });
        })
        .catch(err => {
          res.status(500).json({ message: "Error comparing passwords" });
        });
    })
    .catch(err => {
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
      res.status(500).json({ message: "An error occurred while fetching user profile" });
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
          .catch(err => res.status(500).json({ message: "Error updating user" }));
      })
      .catch(err => {
        res.status(500).json({ message: "Password hashing not successful" });
      });
  } else {
    UserModel.findByIdAndUpdate(id, updateData, { new: true })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      })
      .catch(err => res.status(500).json({ message: "Error updating user" }));
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
      res.status(500).json({ message: "An error occurred while fetching the user" });
    });
});

app.delete("/deleteUser/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndDelete({ _id: id })
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

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
]);

app.post("/addnewitem", Itemupload, (req, res) => {
  const { itemname, itemprice, category, detail } = req.body;
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

      const newItem = new ItemModel({
        itemname,
        detail,
        itemprice: parseFloat(itemprice),
        images: { image1, image2, image3 },
        category,
      });

      newItem.save()
        .then(item => {
          res.status(201).json({ message: "Item added successfully", item });
        })
        .catch(err => {
          res.status(500).json({ error: "Database error while saving item" });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Database error while checking existing item" });
    });
});

app.get("/allitems", (req, res) => {
  ItemModel.find()
    .then(items => {
      if (!items || items.length === 0) {
        return res.status(404).json({ error: "No items found" });
      }
      res.json(items);
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
    });
});

app.get("/itemdetail/:id", (req, res) => {
  ItemModel.findOne({ _id: req.params.id })
    .then(item => {
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    })
    .catch(err => {
      res.status(500).json({ error: "Server error" });
    });
});

app.post('/orders', (req, res) => {
  const { email, contactNumber, items, total } = req.body;
  const newOrder = new Order({ email, contactNumber, items, total });

  newOrder.save()
    .then(order => {
      res.status(201).json(order);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to create order' });
    });
});

app.get("/allorders", (req, res) => {
  Order.find()
    .then(orders => {
      if (orders.length === 0 || !orders) {
        return res.status(200).json({ message: "No orders found" });
      }
      res.status(200).json(orders);
    })
    .catch(err => {
      res.status(500).json({ error: "Failed to fetch orders" });
    });
});

app.delete("/deleteorder/:id", (req, res) => {
  const id = req.params.id;
  Order.findOneAndDelete({ _id: id })
    .then(order => res.json(order))
    .catch(err => res.status(201).json(err));
});

app.get("/countorder", (req, res) => {
  Order.countDocuments()
    .then(count => res.json({ count }))
    .catch(err => res.status(201).json("Something went wrong with order counting"));
});

app.get("/countitem", (req, res) => {
  ItemModel.countDocuments()
    .then(count => res.json({ count }))
    .catch(err => res.status(201).json("Something went wrong with item counting"));
});

app.get("/newarrival", (req, res) => {
  ItemModel.find({ category: { $eq: "newarrival" } })
    .then(item => {
      if (!item || item.length === 0) {
        return res.status(404).json("No items found for newarrival");
      }
      res.json(item);
    })
    .catch(err => res.status(500).json(err));
});

app.get("/lowprice", (req, res) => {
  ItemModel.find({ category: { $eq: "lowprice" } })
    .then(item => {
      if (!item || item.length === 0) {
        return res.status(404).json("Something went wrong with lowprice item fetching");
      }
      res.json(item);
    })
    .catch(err => res.status(500).json(err));
});

app.get("/mostpopular", (req, res) => {
  ItemModel.find({ category: { $eq: "mostpopular" } })
    .then(item => {
      if (!item || item.length === 0) {
        return res.status(404).json("Something went wrong with mostpopular item fetching");
      }
      res.json(item);
    })
    .catch(err => res.status(500).json(err));
});

app.delete("/deleteproduct/:id", (req, res) => {
  const id = req.params.id;
  ItemModel.findByIdAndDelete({ _id: id })
    .then(item => {
      if (!item || item.length === 0) {
        return res.status(500).json("Product not found"); 
      }
      res.json(item);
    })
    .catch(err => res.status(201).json(err));
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
    .then(item => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    })
    .catch(err => {
      res.status(500).json({ message: "Error updating item" });
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}); 
