const express = require("express");
const { addReview, getReviewsByService } = require("../controllers/review.controller");
const { verifyToken } = require("../controllers/user.controller");

const reviewRouter = express.Router();

reviewRouter.post("/add", verifyToken, addReview);
reviewRouter.get("/service/:serviceId", getReviewsByService);

module.exports = reviewRouter;
