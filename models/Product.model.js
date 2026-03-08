const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  images: { type: Array, required: true },
  ratings: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model("products", ProductSchema);

module.exports = ProductModel;
