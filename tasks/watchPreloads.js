const webpack = require("webpack");

const webpackConfig = require("../webpack.config");
const spinnies = require("../helpers/spinnies");
const { logStats, getCompilationText, clearConsole } = require("../helpers/utils");
const { COMPILATION_ASSETS, COMPILATION_STATES } = require("../helpers/constants");


/**
 * Sets up the watcher of preload files.
 * @returns {Promise<void>} Promise resolving when compilation is successful
 */

module.exports = () => new Promise((resolve, reject) => {
	let isFirstWatch = true;

	const asset = COMPILATION_ASSETS.PRELOAD;
	const compiler = webpack(webpackConfig.development.preloads);

	compiler.hooks.compile.tap("compile", () => {
		if (!isFirstWatch) clearConsole();

		spinnies.add("watch", {
			text: getCompilationText({
				asset,
				state: COMPILATION_STATES.PENDING
			})
		});
	});

	compiler.watch({}, (error, stats) => {
		if (error) {
			spinnies.fail("watch", {
				text: getCompilationText({
					asset,
					state: COMPILATION_STATES.FATAL_ERROR
				})
			});

			return reject(error);
		}

		if (isFirstWatch) {
			isFirstWatch = false;
			resolve();
		}

		if (stats.hasErrors()) {
			spinnies.fail("watch", {
				text: getCompilationText({
					asset,
					state: COMPILATION_STATES.ERROR,
					stats
				}),
				failColor: "white"
			});

			return logStats(stats);
		}

		if (stats.hasWarnings()) {
			spinnies.update("watch", {
				text: getCompilationText({
					asset,
					state: COMPILATION_STATES.WARNING,
					stats
				}),
				status: "stopped",
				color: "white"
			});

			return logStats(stats);
		}

		spinnies.succeed("watch", {
			text: getCompilationText({
				asset,
				state: COMPILATION_STATES.SUCCESS
			})
		});
	});
});