const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Ensures email is always stored in lowercase
        trim: true      // Removes whitespace
    },
    username: {
        type: String,
        required: true, // Consider making username required
        unique: true,
        trim: true
    },
    age: {
        type: Number,  // Consider using Number instead of String for age
        min: 18       // Add validation if needed
    },
    password: {
        type: String,
        required: true,
        minlength: 6  // Add minimum length for password
    },
    image: {
        type: String,
        default: ""   // Optional: provide default value
    },
    role: {
        type: String,
        default: "user",
        enum: ["admin", "user"]
    }
}, { 
    collection: 'loginsdata',
    timestamps: true  // Adds createdAt and updatedAt fields
});

const UserModel = mongoose.model("loginsdata", UserSchema);
module.exports = UserModel;