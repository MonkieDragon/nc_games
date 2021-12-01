const db = require("../db/connection");

exports.categoryExists = (category) => {
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
	console.log(review_id);
	return db
		.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: `review not found`,
				});
			}
		});
};
