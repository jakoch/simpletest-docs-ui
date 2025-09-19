"use strict";

const { spawn } = require("child_process");

/**
 * Lint JS using Biome CLI. Accepts the same `files` parameter as before
 * and returns a function that accepts the gulp `done` callback.
 */
module.exports = (_files) => (done) => {
	// Run `biome check` without passing custom globs so Biome uses its own
	// configuration (biome.json) to determine files. Passing complex glob
	// patterns previously caused internal IO errors.
	const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
	const child = spawn(cmd, ["biome", "check"], { stdio: "inherit" });

	child.on("close", (code) => {
		if (code === 0) return done();
		return done(new Error(`biome check failed with exit code ${code}`));
	});
	child.on("error", (err) => done(err));
};
