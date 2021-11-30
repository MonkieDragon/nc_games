const express = require("express");
const {
	getReview,
	patchReview,
} = require("../controllers/reviews.controllers");
const reviewsRouter = express.Router();

console.log("in review router");
reviewsRouter.get("/:review_id", getReview);
reviewsRouter.patch("/:review_id", patchReview);

module.exports = reviewsRouter;
