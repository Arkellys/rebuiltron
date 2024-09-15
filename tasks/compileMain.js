const webpack = require("webpack");
const { bold, green } = require("chalk");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");

const webpackConfig = require("../webpack.config");
const spinnies = require("../helpers/spinnies");


/**
 * Compiles main entry file for development.
 * @returns {Promise<void>} Promise resolving when compilation is successful
 */

module.exports = () => {
	const mainCompiler = webpack(webpackConfig.development.main);

	return new Promise((resolve, reject) => {
		spinnies.add("compile-main", { text: "Compiling main file..." });

		mainCompiler.run((error) => {
			if (!error) return resolve();

			spinnies.fail("compile-main", {
				text: "Failed to compile main file"
			});

			reject(error);
		});

		mainCompiler.hooks.done.tap("done", (stats) => {
			const statsData = stats.toJson({ all: false, warnings: true, errors: true });
			const { errors } = formatWebpackMessages(statsData);

			if (stats.hasErrors()) throw new Error(errors);

			spinnies.succeed("compile-main", {
				text: `Main file compiled ${green(bold("successfully"))}`
			});
		});
	});
};