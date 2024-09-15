const webpack = require("webpack");
const { red, bold, green, yellow } = require("chalk");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const clearConsole = require("react-dev-utils/clearConsole");

const webpackConfig = require("../webpack.config");
const spinnies = require("../helpers/spinnies");
const log = require("../helpers/logger");


/**
 * Sets up the watcher of preload files.
 * @returns {Promise<void>} Promise resolving when compilation is successful
 */

module.exports = () => {
	const preloadCompiler = webpack(webpackConfig.development.preloads);

	return new Promise((resolve, reject) => {
		let isFirstWatch = true;

		preloadCompiler.watch({}, (error) => {
			if (!isFirstWatch) return;
			isFirstWatch = false;

			if (!error) return resolve();

			spinnies.fail("watch", {
				text: "Failed to compile preload file(s)"
			});

			reject(error);
		});

		preloadCompiler.hooks.compile.tap("compile", () => {
			if (!isFirstWatch) clearConsole();

			spinnies.add("watch", {
				text: "Compiling preload file(s)..."
			});
		});

		preloadCompiler.hooks.done.tap("done", (stats) => {
			const statsData = stats.toJson({ all: false, warnings: true, errors: true });
			const { errors, warnings } = formatWebpackMessages(statsData);

			if (stats.hasErrors()) {
				if (isFirstWatch) throw new Error(errors); // Stops the process

				spinnies.fail("watch", {
					text: `Preload file(s) compiled ${red(bold("with errors"))}`,
					failColor: "white"
				});

				return log.error(errors.join("\n\n"));
			}

			if (stats.hasWarnings()) {
				spinnies.update("watch", {
					text: `Preload file(s) compiled ${yellow(bold("with warnings"))}`,
					status: "stopped",
					color: "white"
				});

				return log.warning(warnings.join("\n\n"));
			};

			spinnies.succeed("watch", {
				text: `Preload file(s) compiled ${green(bold("successfully"))}`
			});
		});
	});
};