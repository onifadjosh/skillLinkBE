const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
  status: { 
    type: String, 
    enum: ["pending", "ongoing", "completed", "cancelled"], 
    default: "pending" 
  },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const OrderModel = mongoose.model("orders", OrderSchema);

module.exports = OrderModel;
