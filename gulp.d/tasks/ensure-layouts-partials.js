"use strict";

const fs = require("fs-extra");
const path = require("path");

module.exports = (srcDir, destDir) => () => {
	const copyLayouts = fs.copy(
		path.join(process.cwd(), "src", "layouts"),
		path.join(process.cwd(), destDir, "layouts"),
		{ overwrite: true },
	);
	const copyPartials = fs.copy(
		path.join(process.cwd(), "src", "partials"),
		path.join(process.cwd(), destDir, "partials"),
		{ overwrite: true },
	);
	return Promise.all([copyLayouts, copyPartials]);
};
