const fsExtra = require("fs-extra");
const webpack = require("webpack");
const clearConsole = require("react-dev-utils/clearConsole");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const { bold, green, yellow } = require("chalk");

const paths = require("../helpers/paths");
const webpackConfig = require("../webpack.config");
const spinnies = require("../helpers/spinnies");
const log = require("../helpers/logger");


/**
 * Builds the app for production.
 * @param {any} previousFileSizes - Size of the files of the previous build
 * @returns {Promise<{ stats: webpack.Stats | undefined, previousFileSizes: any }>} Result of the build
 */

module.exports = (previousFileSizes) => {
	fsExtra.emptyDirSync(paths.appBuild);
	const compiler = webpack(webpackConfig.production);

	return new Promise((resolve, reject) => {
		clearConsole();
		spinnies.add("build", { text: "Creating the production build" });

		compiler.run((error, stats) => {
			if (!error) {
				return resolve({
					stats,
					previousFileSizes
				});
			}

			spinnies.fail("build", {
				text: "Failed to compile"
			});

			reject(error);
		});

		compiler.hooks.done.tap("done", (stats) => {
			clearConsole();

			const statsData = stats.toJson({ all: false, warnings: true, errors: true });
			const { errors, warnings } = formatWebpackMessages(statsData);

			if (stats.hasErrors()) throw new Error(errors);

			if (stats.hasWarnings()) {
				spinnies.update("build", {
					text: `Compiled ${yellow(bold("with warnings"))}`,
					status: "stopped",
					color: "white"
				});

				return log.warning(warnings.join("\n\n"));
			};

			spinnies.succeed("build", {
				text: `Compiled ${green(bold("successfully"))}`
			});
		});
	});
};