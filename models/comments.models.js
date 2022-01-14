const db = require("../db/connection");

exports.selectCommentsbyReviewId = (review_id, limit = 10, p = 0) => {
	return db
		.query(
			`SELECT 
    comment_id,
    votes,
    created_at,
    author, 
    body
    FROM comments
    WHERE review_id = $1
	ORDER BY created_at DESC
	LIMIT $2 OFFSET $3;`,
			[review_id, limit, p]
		)
		.then((result) => {
			return result.rows;
		});
};

exports.insertCommentsbyReviewId = (review_id, reqBody) => {
	const { username, body } = reqBody;

	//check for malformed body
	if ([username, body].includes(undefined)) {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}

	return db
		.query(
			`INSERT INTO comments
		(author, body, review_id)
		VALUES ($1, $2, $3)
		RETURNING *;`,
			[username, body, review_id]
		)
		.then(({ rows }) => rows[0]);
};

exports.removeComment = (comment_id) => {
	return db.query(
		`DELETE FROM comments
	WHERE comment_id = $1`,
		[comment_id]
	);
};

exports.updateComment = (comment_id, request) => {
	const { inc_votes = 0 } = request;
	if (Object.keys(request).length > 1) {
		return Promise.reject({ status: 400, msg: "Too many request properties" });
	}
	return db
		.query(
			`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`,
			[inc_votes, comment_id]
		)
		.then((result) => {
			return result.rows[0];
		});
};
