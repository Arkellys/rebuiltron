const webpack = require("webpack");

const { COMPILATION_STATES } = require("../helpers/constants");
const spinnies = require("../helpers/spinnies");
const { logStats, getCompilationText, clearConsole } = require("../helpers/utils");
const webpackConfig = require("../webpack.config");


/**
 * Builds the app for production.
 * @param {any} previousFileSizes - Size of the files of the previous build
 * @returns {Promise<{ stats: webpack.Stats | undefined, previousFileSizes: any }>} Result of the build
 */

module.exports = (previousFileSizes) => new Promise((resolve, reject) => {
	clearConsole();
	spinnies.add("build", { text: "Creating the production build" });

	webpack(webpackConfig.production, (error, stats) => {
		clearConsole();

		if (error || stats.hasErrors()) {
			spinnies.fail("build", {
				text: getCompilationText({
					state: COMPILATION_STATES.FATAL_ERROR
				})
			});

			if (stats) logStats(stats);
			return reject(error);
		}

		if (stats.hasWarnings()) {
			spinnies.update("build", {
				text: getCompilationText({
					state: COMPILATION_STATES.WARNING
				}),
				status: "stopped",
				color: "white"
			});

			logStats(stats);

			return resolve({
				stats,
				previousFileSizes
			});
		}

		spinnies.succeed("build", {
			text: getCompilationText({
				state: COMPILATION_STATES.SUCCESS
			})
		});

		return resolve({
			stats,
			previousFileSizes
		});
	});
});