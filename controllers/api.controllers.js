var path = require("path");

exports.getAPIS = (req, res, next) => {
	res.sendFile("apis.json", {
		root: path.join(__dirname + "/../"),
	});
};
