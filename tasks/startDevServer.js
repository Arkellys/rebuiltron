const { bold } = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

const { COMPILATION_ASSETS, COMPILATION_STATES } = require("../helpers/constants");
const spinnies = require("../helpers/spinnies");
const { getCompilationText, logStats, clearConsole } = require("../helpers/utils");
const webpackConfig = require("../webpack.config");
const devServerConfig = require("../webpackDevServer.config");


/**
 * Starts the development server.
 * @param {number} port - Port on which the renderers are served
 * @returns {Promise<WebpackDevServer>} Development server instance
 */

module.exports = (port) => (
	new Promise(async (resolve) => {
		let devServer;
		let isFirstRun = true;

		const asset = COMPILATION_ASSETS.RENDERER;
		const compiler = webpack(webpackConfig.development.renderers);

		spinnies.add("devServer", { text: "Starting the development server" });

		compiler.hooks.compile.tap("compile", () => {
			if (!isFirstRun) clearConsole();

			spinnies.add("compile", {
				text: getCompilationText({
					asset,
					state: COMPILATION_STATES.PENDING
				})
			});
		});

		compiler.hooks.done.tap("done", (stats) => {
			if (isFirstRun) {
				isFirstRun = false;

				spinnies.succeed("devServer", { text: `Development server running on port ${bold(port)}` });
				resolve(devServer);
			}

			if (stats.hasErrors()) {
				spinnies.fail("compile", {
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
				spinnies.update("compile", {
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

			spinnies.succeed("compile", {
				text: getCompilationText({
					asset,
					state: COMPILATION_STATES.SUCCESS
				})
			});
		});

		devServer = new WebpackDevServer({ ...devServerConfig, port }, compiler);
		await devServer.start();
	})
);