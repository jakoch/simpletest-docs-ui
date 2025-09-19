"use strict";

const fs = require("fs-extra");
const postcss = require("postcss");
const tailwindPostCss = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");

module.exports = (srcDir, destDir) => () => {
	const inputPath = "./src/css/vendor/tailwind.css";
	const outputPath = `${destDir}/css/tailwind.css`;
	return fs.readFile(inputPath, "utf8").then((css) =>
		postcss([tailwindPostCss(), autoprefixer()])
			.process(css, { from: inputPath, to: outputPath })
			.then((result) => fs.outputFile(outputPath, result.css)),
	);
};
