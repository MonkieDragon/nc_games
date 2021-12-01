const { categoryExists } = require("../models/categories.models");
const {
	selectReview,
	updateReview,
	selectReviews,
} = require("../models/reviews.models");

exports.getReview = (req, res, next) => {
	const { review_id } = req.params;
	selectReview(review_id)
		.then((review) => {
			res.status(200).send({ review: review });
		})
		.catch((err) => {
			next(err);
		});
};

exports.patchReview = (req, res, next) => {
	const { review_id } = req.params;
	updateReview(review_id, req.body)
		.then((review) => {
			res.status(200).send({ review: review });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getReviews = (req, res, next) => {
	const { sort_by, order, category } = req.query;
	//console.log("sort_by: " + sort_by, "order: " + order, "category " + category);

	Promise.all([
		categoryExists(category),
		selectReviews(sort_by, order, category, req.query),
	])
		.then(([, reviews]) => {
			res.status(200).send({ reviews });
		})
		.catch((err) => {
			next(err);
		});
};
