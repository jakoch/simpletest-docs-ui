"use strict";

const log = require("fancy-log");
const PluginError = require("plugin-error");
const { Transform } = require("stream");
const { spawnSync } = require("child_process");
const map = (transform) => new Transform({ objectMode: true, transform });

module.exports = () => {
	const report = { changed: 0, unchanged: 0 };
	return map(format).on("finish", () => {
		if (report.changed > 0) {
			const changed = `formatted ${report.changed} file${report.changed === 1 ? "" : "s"}`;
			const unchanged = `left ${report.unchanged} file${report.unchanged === 1 ? "" : "s"} unchanged`;
			log(`biome-format: ${changed}; ${unchanged}`);
		} else {
			log(
				`biome-format: left ${report.unchanged} file${report.unchanged === 1 ? "" : "s"} unchanged`,
			);
		}
	});

	function format(file, enc, next) {
		if (file.isNull()) return next();
		if (file.isStream())
			return next(
				new PluginError("gulp-prettier-eslint", "Streaming not supported"),
			);

		const input = file.contents.toString();

		// Use `npx biome format --stdin --stdin-filename <filename>` to format the content
		const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
		const args = ["biome", "format", "--stdin", "--stdin-filename", file.path];
		const res = spawnSync(cmd, args, { input, encoding: "utf8" });

		if (res.error) return next(new PluginError("biome-format", res.error));
		if (res.status !== 0) {
			// If formatting fails, emit an error but continue
			log(`biome format exited ${res.status}: ${res.stderr}`);
			return next(null, file);
		}

		const output = res.stdout;
		if (input === output) {
			report.unchanged += 1;
		} else {
			report.changed += 1;
			file.contents = Buffer.from(output);
		}

		next(null, file);
	}
};
