const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const clearConsole = require("react-dev-utils/clearConsole");
const { bold } = require("chalk");

const webpackConfig = require("../webpack.config");
const devServerConfig = require("../webpackDevServer.config");
const spinnies = require("../helpers/spinnies");

/**
 * Starts the development server.
 * @param {number} port - Port on which the renderers are served
 * @returns {Promise<WebpackDevServer>} Development server instance
 */

module.exports = async (port) => {
	let isFirstRun = true;
	const rendererCompiler = webpack(webpackConfig.development.renderers);

	spinnies.add("devServer", { text: "Starting the development server" });

	rendererCompiler.hooks.invalid.tap("invalid", () => {
		clearConsole();
		spinnies.add("compile", { text: "Compiling..." });
	});

	rendererCompiler.hooks.done.tap("done", () => {
		if (isFirstRun) return isFirstRun = false;

		clearConsole();
		spinnies.remove("compile");
	});

	const devServer = new WebpackDevServer({ ...devServerConfig, port }, rendererCompiler);
	await devServer.start();

	spinnies.succeed("devServer", { text: `Development server running on port ${bold(port)}` });

	return devServer;
};