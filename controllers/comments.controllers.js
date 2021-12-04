const {
	selectCommentsbyReviewId,
	insertCommentsbyReviewId,
	removeComment,
	updateComment,
} = require("../models/comments.models");
const {
	reviewExists,
	commentExists,
	userExists,
} = require("../models/utils.models");

exports.getCommentsbyReviewId = (req, res, next) => {
	const { review_id } = req.params;
	const { limit, p } = req.query;
	Promise.all([
		reviewExists(review_id),
		selectCommentsbyReviewId(review_id, limit, p),
	])

		.then(([, comments]) => {
			res.status(200).send({ comments: comments });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postCommentsbyReviewId = (req, res, next) => {
	const { review_id } = req.params;
	const { username } = req.body;

	Promise.all([
		reviewExists(review_id),
		userExists(username),
		insertCommentsbyReviewId(review_id, req.body),
	])

		.then(([, , comment]) => {
			res.status(201).send({ comment: comment });
		})
		.catch((err) => {
			next(err);
		});
};

exports.deleteComment = (req, res, next) => {
	const { comment_id } = req.params;
	Promise.all([commentExists(comment_id), removeComment(comment_id)])

		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};

exports.patchComment = (req, res, next) => {
	const { comment_id } = req.params;
	Promise.all([commentExists(comment_id), updateComment(comment_id, req.body)])
		.then(([, comment]) => {
			res.status(200).send({ comment: comment });
		})
		.catch((err) => {
			next(err);
		});
};
