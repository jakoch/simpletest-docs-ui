"use strict";

const vfs = require("vinyl-fs");
const concat = require("gulp-concat");
const fs = require("fs-extra");
const path = require("path");

module.exports = (srcDir, destDir) => () => {
	const srcPattern = path.join(srcDir, "js", "+([0-9])-*.js");
	const destPath = destDir;
	try {
		fs.removeSync(path.join(destPath, "js", "font"));
	} catch (e) {}
	return vfs
		.src(srcPattern, { read: true })
		.pipe(concat("js/site.js"))
		.pipe(vfs.dest(destPath));
};
