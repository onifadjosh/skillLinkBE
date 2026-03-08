const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model("reviews", ReviewSchema);

module.exports = ReviewModel;
