const express = require("express");
const {
	getReviews,
	getReview,
	patchReview,
} = require("../controllers/reviews.controllers");
const {
	getCommentsbyReviewId,
	postCommentsbyReviewId,
} = require("../controllers/comments.controllers");

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReview);
reviewsRouter.patch("/:review_id", patchReview);
reviewsRouter.get("/:review_id/comments", getCommentsbyReviewId);
reviewsRouter.post("/:review_id/comments", postCommentsbyReviewId);

module.exports = reviewsRouter;
