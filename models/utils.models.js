const db = require("../db/connection");

exports.categoryExists = (category) => {
	if (!category) {
		return;
	}

	return db
		.query(`SELECT * FROM categories WHERE slug = $1;`, [category])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: `category not found`,
				});
			}
		});
};

exports.reviewExists = (review_id) => {
	return db
		.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: `Not found`,
				});
			}
		});
};

exports.commentExists = (comment_id) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: `comment not found`,
				});
			}
		});
};

exports.userExists = (username) => {
	if (!username) {
		return;
	}
	return db
		.query(`SELECT * FROM users WHERE username = $1;`, [username])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: `Not found`,
				});
			}
		});
};
