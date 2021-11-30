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
			.get("/api/reviews?sort_by=title")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeSortedBy("title", {
					descending: true,
				});
			});
	});

	test("status 200: reviews are ordered by client query", () => {
		return request(app)
			.get("/api/reviews?order=asc")
			.expect(200)
			.then((response) => {
				expect(response.body.reviews).toBeSortedBy("created_at");
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
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("Bad request");
			});
	});

	test("status 404: if valid category but no reviews associated with it, returns error message", () => {
		return request(app)
			.get("/api/reviews?category=children's games")
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe("No reviews found");
			});
	});
});
