const OrderModel = require("../models/Order.model");
const ProductModel = require("../models/Product.model");
const { createNotification } = require("./notification.controller");

const createOrder = async (req, res) => {
  const { serviceId } = req.body;
  try {
    const product = await ProductModel.findById(serviceId);
    if (!product) {
      return res.send({ status: false, message: "Service not found" });
    }

    const newOrder = await OrderModel.create({
      buyerId: req.userId,
      sellerId: product.sellerId,
      serviceId,
      price: product.price,
    });

    await createNotification(product.sellerId, `New order for your service: ${product.title}`, "order");

    res.send({ status: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error placing order" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({
      $or: [{ buyerId: req.userId }, { sellerId: req.userId }],
    })
      .populate("serviceId", "title images")
      .populate("buyerId", "fullname username")
      .populate("sellerId", "fullname username");
    res.send({ status: true, orders });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.send({ status: false, message: "Order not found" });
    }

    // Only buyer or seller can update status in certain ways
    // For now, let's allow anyone involved to update (can be refined later)
    if (order.buyerId.toString() !== req.userId && order.sellerId.toString() !== req.userId) {
      return res.send({ status: false, message: "Unauthorized" });
    }

    order.status = status;
    await order.save();

    await createNotification(order.buyerId, `Your order status has been updated to ${status}`, "order");

    res.send({ status: true, message: "Order status updated", order });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error updating order status" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
