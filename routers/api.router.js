const express = require("express");
const categoriesRouter = require("./categories.router");
const reviewsRouter = require("./reviews.router");
const apiRouter = express.Router();

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
