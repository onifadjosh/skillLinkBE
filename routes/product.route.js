const express = require("express");
const { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} = require("../controllers/product.controller");
const { verifyToken } = require("../controllers/user.controller");

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/create", verifyToken, createProduct);
productRouter.post("/update/:id", verifyToken, updateProduct);
productRouter.post("/delete/:id", verifyToken, deleteProduct);

module.exports = productRouter;
