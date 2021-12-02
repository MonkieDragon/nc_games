const { selectUsers, selectUserByUsername } = require("../models/users.models");
const { userExists } = require("../models/utils.models");

exports.getUsers = (req, res, next) => {
	selectUsers()
		.then((users) => {
			res.status(200).send({ users: users });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getUserByUsername = (req, res, next) => {
	const { username } = req.params;
	Promise.all([userExists(username), selectUserByUsername(username)])
		.then(([, user]) => {
			res.status(200).send({ user: user });
		})
		.catch((err) => {
			next(err);
		});
};
