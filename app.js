const express = require("express");
const apiRouter = require("./routers/api.router");
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
	console.log(err);
	if (err.code === "22P02" || err.code === "23503") {
		console.log("psql error");
		res.status(400).send({ msg: "Bad Request" });
	} else if (err.status && err.msg) {
		console.log("custom error");
		res.status(err.status).send({ msg: err.msg });
	} else {
		res.status(500).send({ msg: "Internal server error" });
	}
});

module.exports = app;
