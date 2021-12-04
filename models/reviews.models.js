const db = require("../db/connection");

exports.selectReview = (review_id) => {
	if (review_id === undefined) {
		return Promise.reject({ status: 400, msg: "Bad request" });
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
	const { inc_votes = 0 } = request;
	// if (!inc_votes) {
	// 	return Promise.reject({ status: 400, msg: "Bad request" });
	// }
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
			return result.rows[0];
		});
};

exports.selectReviews = (
	sort_by = "created_at",
	order = "DESC",
	category,
	limit = 10,
	p = 0,
	queryObj
) => {
	//check all queries are spelt correctly
	const queryKeys = Object.keys(queryObj);
	const querySpellCheck = true;

	if (queryKeys.length > 0) {
		queryKeys.forEach((queryKey) => {
			if (!["sort_by", "order", "category", "limit", "p"].includes(queryKey)) {
				querySpellCheck = false;
			}
		});

		if (
			![
				"owner",
				"designer",
				"title",
				"review_id",
				"category",
				"review_img_url",
				"created_at",
				"votes",
				"comment_count",
			].includes(sort_by) ||
			!["ASC", "DESC"].includes(order.toUpperCase()) ||
			!querySpellCheck
		) {
			return Promise.reject({ status: 400, msg: "Invalid query" });
		}
	}

	let catQueryStr = "";
	const queryArr = [limit, p];
	if (category) {
		catQueryStr = ` WHERE reviews.category = $3`;
		queryArr.push(category);
	}

	return db
		.query(
			`SELECT owner, title, reviews.review_id, review_body,
	     designer, review_img_url, category,
	      reviews.created_at, reviews.votes,
	       COUNT(comment_id)::int AS comment_count,
		   COUNT(*) OVER()::int AS total_count
	        FROM reviews
	         LEFT JOIN comments
	          ON reviews.review_id = comments.review_id
			  ${catQueryStr}
			  GROUP BY reviews.review_id
	            ORDER BY ${sort_by} ${order}
				LIMIT $1 OFFSET $2;`,
			queryArr
		)
		.then((result) => {
			return result.rows;
		});
};
