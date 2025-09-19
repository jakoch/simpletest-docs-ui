"use strict";

const fs = require("fs-extra");
const postcss = require("postcss");
const postcssImport = require("postcss-import");
const postcssUrl = require("postcss-url");
const postcssVar = require("postcss-custom-properties");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const path = require("path");

module.exports = (srcDir, destDir) => () => {
	const inputPath = path.join(srcDir, "css", "site.css");
	const outputPath = path.join(destDir, "css", "site.css");
	const tailwindIn = path.join(srcDir, "css", "vendor", "tailwind.css");
	const tailwindOut = path.join(destDir, "css", "tailwind.css");

	try {
		fs.removeSync(path.join(destDir, "css", "font"));
	} catch (e) {}

	return fs
		.readFile(inputPath, "utf8")
		.then((css) =>
			postcss([
				postcssImport,
				postcssUrl([
					{
						filter: (asset) =>
							/^[~][^/]*(?:font|typeface)[^/]*\/.*\/files\/.+\.(?:ttf|woff2?)$/.test(
								asset.url,
							),
						url: (asset) => {
							const relpath = asset.pathname.slice(1);
							const abspath = require.resolve(relpath);
							const basename = require("path").basename(abspath);
							const destpath = require("path").join(
								`${destDir}`,
								"font",
								basename,
							);
							if (!fs.pathExistsSync(destpath)) fs.copySync(abspath, destpath);
							return path.join("..", "font", basename);
						},
					},
				]),
				postcssVar({ preserve: false }),
				autoprefixer(),
				cssnano({ preset: "default" }),
			])
				.process(css, { from: inputPath, to: outputPath })
				.then((result) => fs.outputFile(outputPath, result.css)),
		)
		.then(() =>
			fs
				.readFile(tailwindIn, "utf8")
				.then((tcss) => fs.outputFile(tailwindOut, tcss)),
		);
};
