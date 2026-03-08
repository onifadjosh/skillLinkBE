const ProductModel = require("../models/Product.model");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const createProduct = async (req, res) => {
  const { title, description, price, category, images } = req.body;
  try {
    let uploadedImages = [];
    for (let image of images) {
      if (image.startsWith("data:image")) {
        let result = await cloudinary.uploader.upload(image, {
          resource_type: "image",
        });
        uploadedImages.push(result.secure_url);
      } else {
        uploadedImages.push(image);
      }
    }

    const newProduct = await ProductModel.create({
      title,
      description,
      price,
      category,
      sellerId: req.userId,
      images: uploadedImages,
    });

    res.send({ status: true, message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error creating product" });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, keyword } = req.query;
    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const products = await ProductModel.find(query).populate("sellerId", "fullname username profilePicture");
    res.send({ status: true, products });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate("sellerId", "fullname username profilePicture bio location");
    if (!product) {
      return res.send({ status: false, message: "Product not found" });
    }
    res.send({ status: true, product });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching product details" });
  }
};

const updateProduct = async (req, res) => {
  const { title, description, price, category, images } = req.body;
  try {
    let uploadedImages = [];
    if (images && images.length > 0) {
      for (let image of images) {
        if (image.startsWith("data:image")) {
          let result = await cloudinary.uploader.upload(image, {
            resource_type: "image",
          });
          uploadedImages.push(result.secure_url);
        } else {
          uploadedImages.push(image);
        }
      }
    }

    let updateData = { title, description, price, category };
    if (uploadedImages.length > 0) updateData.images = uploadedImages;

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.userId },
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.send({ status: false, message: "Product not found or unauthorized" });
    }

    res.send({ status: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findOneAndDelete({ _id: req.params.id, sellerId: req.userId });
    if (!deletedProduct) {
      return res.send({ status: false, message: "Product not found or unauthorized" });
    }
    res.send({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error deleting product" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
