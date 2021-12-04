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

reviewsRouter.route("/:review_id").get(getReview).patch(patchReview);
reviewsRouter
	.route("/:review_id/comments")
	.get(getCommentsbyReviewId)
	.post(postCommentsbyReviewId);

module.exports = reviewsRouter;
