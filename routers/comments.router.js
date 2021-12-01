const express = require("express");
const { deleteComment } = require("../controllers/comments.controllers");
const commentsRouter = express.Router();

console.log("in comments router");
commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
