const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /invalidRoute", () => {
	test("status 404: responds with an error message if invalid route", () => {
		return request(app).get("/invalidRoute").expect(404);
	});
});

describe("GET /api/categories", () => {
	test("status 200: responds with an array of categories", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then((response) => {
				expect(response.body.categories).toBeInstanceOf(Array);
				expect(response.body.categories).toHaveLength(4);
				response.body.categories.forEach((category) => {
					expect(category).toEqual(
						expect.objectContaining({
							slug: expect.any(String),
							description: expect.any(String),
						})
					);
				});
			});
	});
});

describe("GET /api/reviews/:review_id", () => {
	test("status 200: responds with a review object, including comment count", () => {
		return request(app)
			.get("/api/reviews/5")
			.expect(200)
			.then((response) => {
				expect(response.body.review).toEqual(
					expect.objectContaining({
						owner: expect.any(String),
						title: expect.any(String),
						review_id: expect.any(Number),
						review_body: expect.any(String),
						designer: expect.any(String),
						review_img_url: expect.any(String),
						category: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(Number),
					})
				);
			});
	});

	test("status 400: responds with an error message if invalid review id data type", () => {
		return request(app)
			.get("/api/reviews/dog")
			.expect(400)
			.then((response) => {
				expect(response.body).toEqual({
					msg: "Bad request",
				});
			});
	});

	test("status 404: responds with an error message if review id not found", () => {
		return request(app)
			.get("/api/reviews/9999999")
			.expect(404)
			.then((response) => {
				expect(response.body).toEqual({
					msg: "review not found",
				});
			});
	});
});

describe("PATCH /api/reviews/:review_id", () => {
	test("status: 200, responds with status 200 and updated review", () => {
		const newVotes = {
			inc_votes: 5,
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(newVotes)
			.expect(200)
			.then((response) => {
				expect(response.body.review).toEqual(
					expect.objectContaining({
						owner: "mallionaire",
						title: "Agricola",
						review_id: 1,
						review_body: "Farmyard fun!",
						designer: "Uwe Rosenberg",
						review_img_url: expect.any(String),
						category: "euro game",
						created_at: expect.any(String),
						votes: 6,
					})
				);
			});
	});

	test("status: 400, responds with bad request message if no inc_votes on body", () => {
		const newVotes = {
			pinc_votes: 0,
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(newVotes)
			.expect(400)
			.then((response) => {
				expect(response.body).toEqual({
					msg: "Bad request",
				});
			});
	});

	test("status: 400, responds with bad request message if inc_votes is invalid", () => {
		const newVotes = {
			inc_votes: "cat",
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(newVotes)
			.expect(400)
			.then((response) => {
				expect(response.body).toEqual({
					msg: "Bad request",
				});
			});
	});

	test("status: 400, responds with bad request message if properies in addition to inc_votes on request", () => {
		const newVotes = {
			inc_votes: "1",
			name: "Mitch",
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(newVotes)
			.expect(400)
			.then((response) => {
				expect(response.body).toEqual({
					msg: "Too many request properties",
				});
			});
	});
});

describe("GET /api/reviews", () => {
	test("status 200: responds with an array of reviews", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeInstanceOf(Array);
				expect(response.body.reviews).toHaveLength(13);
				response.body.reviews.forEach((review) => {
					expect(review).toEqual(
						expect.objectContaining({
							owner: expect.any(String),
							title: expect.any(String),
							review_id: expect.any(Number),
							review_body: expect.any(String),
							designer: expect.any(String),
							review_img_url: expect.any(String),
							category: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number),
						})
					);
				});
			});
	});

	test("status 200: reviews are sorted by date in descending order by default", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});

	test("status 200: reviews are sorted by client query in descending order by default", () => {
		return request(app)
			.get("/api/reviews?sort_by=designer")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeSortedBy("designer", {
					descending: true,
				});
			});
	});

	test("status 200: reviews are ordered by client query", () => {
		return request(app)
			.get("/api/reviews?order=asc")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeSortedBy("created_at", {
					descending: false,
				});
			});
	});

	test("status 200: reviews are ordered AND sorted by client queries", () => {
		return request(app)
			.get("/api/reviews?sort_by=votes&order=asc")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeSortedBy("votes");
			});
	});

	test("status 200: reviews are filtered by client query", () => {
		return request(app)
			.get("/api/reviews?category=dexterity")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeInstanceOf(Array);
				expect(response.body.reviews).toHaveLength(1);
				expect(response.body.reviews[0].category).toBe("dexterity");
			});
	});

	test("status 200: client queries can include spaces", () => {
		return request(app)
			.get("/api/reviews?category=social deduction") ///how to deal with spaces??
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeInstanceOf(Array);
				expect(response.body.reviews).toHaveLength(11);
				response.body.reviews.forEach((review) => {
					expect(review).toEqual(
						expect.objectContaining({
							owner: expect.any(String),
							title: expect.any(String),
							review_id: expect.any(Number),
							review_body: expect.any(String),
							designer: expect.any(String),
							review_img_url: expect.any(String),
							category: "social deduction",
							created_at: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number),
						})
					);
				});
			});
	});

	test("status 200: reviews are ordered AND sorted by AND filtered by client queries", () => {
		return request(app)
			.get("/api/reviews?sort_by=votes&order=asc&category=social deduction")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeSortedBy("votes");
				expect(response.body.reviews).toHaveLength(11);
				response.body.reviews.forEach((review) => {
					expect(review.category).toBe("social deduction");
				});
			});
	});

	//unhappy path
	test("status 400: if invalid sort_by query, returns error message", () => {
		return request(app)
			.get("/api/reviews?sort_by=cost_at_action")
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("Invalid query");
			});
	});

	test("status 400: if invalid order query, returns error message", () => {
		return request(app)
			.get("/api/reviews?order=des")
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("Invalid query");
			});
	});

	test("status 404: if invalid category, returns error message", () => {
		return request(app)
			.get("/api/reviews?category=badger")
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe("category not found");
			});
	});

	test("status 200: if valid category but no reviews associated with it, returns empty array", () => {
		return request(app)
			.get("/api/reviews?category=children's games")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeInstanceOf(Array);
				expect(response.body.reviews).toHaveLength(0);
			});
	});
});

describe("GET /api/reviews/:review_id/comments", () => {
	test("status 200: responds with array of comments", () => {
		return request(app)
			.get("/api/reviews/2/comments")
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toBeInstanceOf(Array);
				expect(comments).toHaveLength(3);
				comments.forEach((comment) => {
					expect(comment).toEqual(
						expect.objectContaining({
							comment_id: expect.any(Number),
							votes: expect.any(Number),
							created_at: expect.any(String),
							author: expect.any(String),
							body: expect.any(String),
						})
					);
				});
			});
	});

	test("status 200: responds with an empty array for reviews with no comments", () => {
		return request(app)
			.get("/api/reviews/1/comments")
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toBeInstanceOf(Array);
				expect(comments).toHaveLength(0);
			});
	});

	test("status 404: if review_id doesnt exist, returns error message", () => {
		return request(app)
			.get("/api/reviews/9999/comments")
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("review not found");
			});
	});

	test("status 400: if review_id is invalid data type, returns error message", () => {
		return request(app)
			.get("/api/reviews/badger/comments")
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Bad request"); //correct message?
			});
	});
});

describe("POST /api/reviews/:review_id/comments", () => {
	test("status 200: if given a valid request object, responds newly posted comment", () => {
		const newComment = { username: "mallionaire", body: "this game is dope" };
		return request(app)
			.post("/api/reviews/2/comments")
			.send(newComment)
			.expect(201)
			.then((response) => {
				expect(response.body.comment).toEqual(
					expect.objectContaining({
						comment_id: 7,
						votes: 0,
						created_at: expect.any(String),
						author: "mallionaire",
						body: "this game is dope",
					})
				);
			});
	});

	test("status 404: if review_id doesnt exist, returns error message", () => {
		const newComment = { username: "mallionaire", body: "this game is dope" };
		return request(app)
			.post("/api/reviews/9999/comments")
			.send(newComment)
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("review not found");
			});
	});

	test("status 400: if review_id is invalid data type, returns error message", () => {
		const newComment = { username: "mallionaire", body: "this game is dope" };
		return request(app)
			.post("/api/reviews/badger/comments")
			.send(newComment)
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Bad Request"); //correct message?
			});
	});

	test("status 400: returns error if malformed body", () => {
		const newComment = { user: "mallionaire", body: "this game is dope" };
		return request(app)
			.post("/api/reviews/2/comments")
			.send(newComment)
			.expect(400)
			.then((response) => {
				expect(response.body).toEqual({
					msg: "Bad Request",
				});
			});
	});

	test("status 400: returns error if body missing field", () => {
		const newComment = { user: "mallionaire" };
		return request(app)
			.post("/api/reviews/2/comments")
			.send(newComment)
			.expect(400)
			.then((response) => {
				expect(response.body).toEqual({
					msg: "Bad Request",
				});
			});
	});

	test("status 400: returns error if username is wrong data type", () => {
		const newComment = { username: 999, body: "this game is dope" };
		return request(app)
			.post("/api/reviews/2/comments")
			.send(newComment)
			.expect(400)
			.then((response) => {
				expect(response.body).toEqual({
					msg: "Bad Request",
				});
			});
	});

	test("status 400: returns error if username is doesnt exist", () => {
		const newComment = { user: "badger", body: 999 };
		return request(app)
			.post("/api/reviews/2/comments")
			.send(newComment)
			.expect(400)
			.then((response) => {
				expect(response.body).toEqual({
					msg: "Bad Request",
				});
			});
	});
});

describe.only("DELETE /api/comments/:comment_id", () => {
	test("status 204: if given a valid comment_id, responds with status code", () => {
		return request(app).delete("/api/comments/1").expect(204);
	});

	test("status 200: if successfully deleted, table will be one row shorter", () => {
		return request(app)
			.delete("/api/comments/1")
			.then(() => {
				return request(app)
					.get("/api/reviews/2/comments")
					.expect(200)
					.then(({ body: { comments } }) => {
						expect(comments).toBeInstanceOf(Array);
						expect(comments).toHaveLength(2);
					});
			});
	});

	test("status 404: if comment_id doesnt exist, returns error message", () => {
		return request(app)
			.delete("/api/comments/99999")
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("comment not found");
			});
	});

	test("status 400: if comment_id is invalid data type, returns error message", () => {
		return request(app)
			.delete("/api/comments/badger")
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Bad request"); //correct message?
			});
	});
});
