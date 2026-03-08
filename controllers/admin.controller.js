const UserModel = require("../models/User.model");
const ProductModel = require("../models/Product.model");
const OrderModel = require("../models/Order.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.send({ status: true, users });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.send({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error deleting user" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("sellerId", "fullname username");
    res.send({ status: true, products });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching products" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.send({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error deleting product" });
  }
};

const getStatistics = async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments();
    const productCount = await ProductModel.countDocuments();
    const orderCount = await OrderModel.countDocuments();
    res.send({ status: true, stats: { userCount, productCount, orderCount } });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching statistics" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getStatistics,
};
