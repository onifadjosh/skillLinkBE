const ReviewModel = require("../models/Review.model");
const ProductModel = require("../models/Product.model");

const addReview = async (req, res) => {
  const { serviceId, rating, comment } = req.body;
  try {
    const newReview = await ReviewModel.create({
      serviceId,
      reviewerId: req.userId,
      rating,
      comment,
    });

    // Update Product average rating
    const reviews = await ReviewModel.find({ serviceId });
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    await ProductModel.findByIdAndUpdate(serviceId, {
      ratings: averageRating,
      reviewsCount: reviews.length,
    });

    res.send({ status: true, message: "Review added successfully", review: newReview });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error adding review" });
  }
};

const getReviewsByService = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({ serviceId: req.params.serviceId }).populate("reviewerId", "fullname username profilePicture");
    res.send({ status: true, reviews });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching reviews" });
  }
};

module.exports = {
  addReview,
  getReviewsByService,
};
