const db = require("../db/connection");

exports.selectCommentsbyReviewId = (review_id) => {
	return db
		.query(
			`SELECT 
    comment_id,
    votes,
    created_at,
    author, 
    body
    FROM comments
    WHERE review_id = $1;`,
			[review_id]
		)
		.then((result) => {
			return result.rows;
		});
};

exports.insertCommentsbyReviewId = (review_id, reqBody) => {
	const { username, body } = reqBody;

	//check for malformed body
	if ([username, body].includes(undefined)) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
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
