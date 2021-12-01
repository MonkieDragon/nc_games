const db = require("../db/connection");

exports.selectCategories = () => {
	return db.query("SELECT * FROM categories;").then((result) => {
		return result.rows;
	});
};

exports.categoryExists = (category) => {
	console.log(category);
	if (!category) {
		return; //Promise.resolve();
	}

	const formattedCat = category.replace("'", "''"); //escapes any apostrophes
	console.log(formattedCat);
	return db
		.query(`SELECT * FROM categories WHERE slug = $1;`, [formattedCat])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: `category not found`,
				});
			} else {
				return rows;
			}
		});
};
