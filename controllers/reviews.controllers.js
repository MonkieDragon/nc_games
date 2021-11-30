const { selectReview, updateReview } = require("../models/reviews.models");

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
