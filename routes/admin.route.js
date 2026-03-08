const express = require("express");
const { 
  getAllUsers, 
  deleteUser, 
  getAllProducts, 
  deleteProduct, 
  getStatistics 
} = require("../controllers/admin.controller");
const { verifyToken, verifyAdmin } = require("../controllers/user.controller");

const adminRouter = express.Router();

adminRouter.use(verifyToken, verifyAdmin);

adminRouter.get("/users", getAllUsers);
adminRouter.delete("/user/:id", deleteUser);
adminRouter.get("/products", getAllProducts);
adminRouter.delete("/product/:id", deleteProduct);
adminRouter.get("/stats", getStatistics);

module.exports = adminRouter;
