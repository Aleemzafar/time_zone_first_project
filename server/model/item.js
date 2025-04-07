const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    itemname: {
      type: String,
      required: true,
      unique: true,
    },
    itemprice: {
      type: Number,
      required: true,
    },
    images: {
      image1: { type: String, required: true }, // Image 1 is required
      image2: { type: String, required: true }, // Image 2 is optional
      image3: { type: String,required : true}, // Image 3 is optional
    },
    category: {
      type: String,
      required: true,
      enum: ["newarrival", "lowprice", "mostpopular"],
    },
    detail: {
      type: String,
      required: true,
      minlength: 10,
    },
  }, {
    collection: "itemsdata",
    timestamps: true,
  });

const ItemModel = mongoose.model("itemsdata", ItemSchema);
module.exports = ItemModel;