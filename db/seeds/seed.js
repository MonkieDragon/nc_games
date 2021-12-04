const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
	const { categoryData, commentData, reviewData, userData } = data;
	// 1. create tables
	return (
		db
			.query("DROP TABLE IF EXISTS comments;")
			.then(() => {
				return db.query(`DROP TABLE IF EXISTS reviews;`);
			})
			.then(() => {
				return db.query(`DROP TABLE IF EXISTS users;`);
			})
			.then(() => {
				return db.query(`DROP TABLE IF EXISTS categories;`);
			})
			.then(() => {
				return db.query(`
    CREATE TABLE categories (
      slug VARCHAR PRIMARY KEY UNIQUE NOT NULL,
      description VARCHAR NOT NULL
    );`);
			})
			.then(() => {
				return db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY UNIQUE NOT NULL,
      avatar_url VARCHAR NOT NULL,
      name VARCHAR NOT NULL
    );`);
			})
			.then(() => {
				return db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      review_body VARCHAR NOT NULL,
      designer VARCHAR NOT NULL,
      review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT 0,
      category VARCHAR REFERENCES categories(slug) NOT NULL,
      owner VARCHAR REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );`);
			})
			.then(() => {
				return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR REFERENCES users(username) NOT NULL,
        review_id INT REFERENCES reviews(review_id) NOT NULL,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        body VARCHAR NOT NULL
        );`);
			})

			// 2. insert data
			.then(() => {
				//INSERT CATEGORY DATA
				const categoryArray = categoryData.map((category) => {
					return [category.slug, category.description];
				});

				const categoryInsertStr = format(
					`INSERT INTO categories
          (slug, description)
          VALUES
          %L
          RETURNING *;`,
					categoryArray
				);

				return db.query(categoryInsertStr);
			})
			.then(() => {
				//INSERT USER DATA
				const userArray = userData.map((user) => {
					return [user.username, user.avatar_url, user.name];
				});

				const userInsertStr = format(
					`INSERT INTO users
          (username, avatar_url, name)
          VALUES
          %L
          RETURNING *;`,
					userArray
				);

				return db.query(userInsertStr);
			})
			.then(() => {
				//INSERT REVIEW DATA
				const reviewArray = reviewData.map((review) => {
					return [
						review.title,
						review.review_body,
						review.designer,
						review.review_img_url,
						review.votes,
						review.category,
						review.owner,
						review.created_at,
					];
				});

				const reviewInsertStr = format(
					`INSERT INTO reviews
          (title, review_body, designer,review_img_url,
          votes, category, owner, created_at)
          VALUES
          %L
          RETURNING *;`,
					reviewArray
				);

				return db.query(reviewInsertStr);
			})
			.then(() => {
				//INSERT COMMENT DATA
				const commentArray = commentData.map((comment) => {
					return [
						comment.author,
						comment.review_id,
						comment.votes,
						comment.created_at,
						comment.body,
					];
				});

				const commentInsertStr = format(
					`INSERT INTO comments
          (author, review_id, votes, created_at, body)
          VALUES
          %L
          RETURNING *;`,
					commentArray
				);

				return db.query(commentInsertStr);
			})
	);
};

module.exports = seed;
