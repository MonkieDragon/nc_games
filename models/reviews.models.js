const db = require("../db/connection");

exports.selectReview = (review_id) => {
	if (review_id === undefined) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	}

	return db
		.query(
			`SELECT owner, title, reviews.review_id, review_body,
             designer, review_img_url, category,
              reviews.created_at, reviews.votes,
               COUNT(comment_id)::int AS comment_count
                FROM reviews
                 LEFT JOIN comments
                  ON reviews.review_id = comments.review_id
                   WHERE reviews.review_id = $1
                    GROUP BY reviews.review_id;`,
			[review_id]
		)
		.then((result) => {
			const reviewArr = result.rows[0];

			if (!reviewArr) {
				return Promise.reject({
					status: 404,
					msg: "review not found",
				});
			} else {
				return reviewArr;
			}
		});
};

exports.updateReview = (review_id, request) => {
	const { inc_votes } = request;
	if (!inc_votes) {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}
	if (Object.keys(request).length > 1) {
		return Promise.reject({ status: 400, msg: "Too many request properties" });
	}
	return db
		.query(
			`
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;`,
			[inc_votes, review_id]
		)
		.then((result) => {
			const updated_review = result.rows[0];
			return updated_review;
		});
};
