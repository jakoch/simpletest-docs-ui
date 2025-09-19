"use strict";

// Load stylelint via dynamic import so we use the ESM entrypoint when available
// and avoid the deprecated CommonJS Node API introduced in stylelint v16.

/**
 * Lint CSS using the stylelint Node API.
 * files: glob or array of globs to pass to stylelint
 * returns a function that accepts the gulp `done` callback
 */
module.exports = (files) => async (done) => {
	try {
		// Use dynamic import to prefer the ESM entrypoint when available.
		const stylelint =
			(await import("stylelint")).default || (await import("stylelint"));

		// Use the new result.report property (formatted problems) per stylelint v16.
		const result = await stylelint.lint({
			files,
			formatter: "string",
			quietDeprecationWarnings: true,
		});

		// `report` is the new formatted output; fallback to `output` for older stylelint versions
		const formatted = result.report ?? result.output;
		if (formatted) console.log(formatted);

		if (result.errored) {
			const err = new Error("stylelint found errors");
			err.results = result.results;
			return done(err);
		}

		return done();
	} catch (err) {
		return done(err);
	}
};
