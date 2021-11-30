const express = require("express");
const { getCategories } = require("../controllers/categories.controllers");
const categoriesRouter = express.Router();

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
