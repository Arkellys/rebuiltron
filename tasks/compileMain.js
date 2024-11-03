const webpack = require("webpack");

const { COMPILATION_ASSETS, COMPILATION_STATES } = require("../helpers/constants");
const spinnies = require("../helpers/spinnies");
const { getCompilationText, logStats } = require("../helpers/utils");
const webpackConfig = require("../webpack.config");


/**
 * Compiles main entry file for development.
 * @returns {Promise<void>} Promise resolving when compilation is successful
 */

module.exports = () => new Promise((resolve, reject) => {
	const asset = COMPILATION_ASSETS.MAIN;

	spinnies.add("compile-main", {
		text: getCompilationText({
			asset,
			state: COMPILATION_STATES.PENDING
		})
	});

	webpack(webpackConfig.development.main, (error, stats) => {
		if (error || stats.hasErrors()) {
			spinnies.fail("compile-main", {
				text: getCompilationText({
					asset,
					state: COMPILATION_STATES.FATAL_ERROR
				})
			});

			if (stats) logStats(stats);
			return reject(error);
		}

		if (stats.hasWarnings()) {
			spinnies.update("compile-main", {
				text: getCompilationText({
					asset,
					state: COMPILATION_STATES.WARNING,
					stats
				}),
				status: "stopped",
				color: "white"
			});

			logStats(stats);
			return resolve();
		}

		spinnies.succeed("compile-main", {
			text: getCompilationText({
				asset,
				state: COMPILATION_STATES.SUCCESS
			})
		});

		return resolve();
	});
});