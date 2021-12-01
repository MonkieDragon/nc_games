const {
	selectCommentsbyReviewId,
	insertCommentsbyReviewId,
} = require("../models/comments.models");
const { reviewExists } = require("../models/utils.models");

exports.getCommentsbyReviewId = (req, res, next) => {
	const { review_id } = req.params;

	Promise.all([reviewExists(review_id), selectCommentsbyReviewId(review_id)])

		.then(([, comments]) => {
			res.status(200).send({ comments: comments });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postCommentsbyReviewId = (req, res, next) => {
	const { review_id } = req.params;

	Promise.all([
		reviewExists(review_id),
		insertCommentsbyReviewId(review_id, req.body),
	])

		.then(([, comment]) => {
			res.status(201).send({ comment: comment });
		})
		.catch((err) => {
			next(err);
		});
};
