"use strict";

const fs = require("fs-extra");
const postcssLib = require("postcss");
const postcssImport = require("postcss-import");
const postcssUrl = require("postcss-url");
const postcssVar = require("postcss-custom-properties");
const autoprefixer = require("autoprefixer");
const path = require("path");

module.exports = (srcDir, destDir, livereload) => () => {
	const inputPath = `${srcDir}/css/site.css`;
	const outputPath = `${destDir}/css/site.css`;

	return fs.readFile(inputPath, "utf8").then((css) =>
		postcssLib([
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
			postcssVar({ preserve: true }),
			autoprefixer(),
		])
			.process(css, { from: inputPath, to: outputPath })
			.then((result) => fs.outputFile(outputPath, result.css))
			.then(() => {
				if (livereload) livereload();
			}),
	);
};
