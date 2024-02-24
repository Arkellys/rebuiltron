const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const clearConsole = require("react-dev-utils/clearConsole");
const { bold } = require("chalk");

const webpackConfig = require("./webpack.config");
const devServerConfig = require("./webpackDevServer.config");
const { exitProcessWithError } = require("./helpers/utils");
const spinnies = require("./helpers/spinnies");


let isElectronStarted = false;


const _startElectron = (port) => {
	spinnies.add("electron", { text: "Starting Electron" });

	try {
		const electronPath = require.resolve("electron");
		const electronModulePath = path.dirname(electronPath);
		const pathFile = path.join(electronModulePath, "path.txt");
		const executablePath = fs.readFileSync(pathFile, "utf-8");
		const electronExtPath = path.join(electronModulePath, "dist", executablePath);

		spawn(electronExtPath, ["."], {
			stdio: "inherit",
			env: {
				...process.env,
				DEV_LOCAL_URL: `http://localhost:${port}`
			}
		}).on("close", process.exit);

		spinnies.succeed("devServer", { text: `Development server running on port ${bold(port)}` });
		spinnies.succeed("electron", { text: "Electron started\n" });

		isElectronStarted = true;

	} catch (error) {
		exitProcessWithError({
			message: [
				"An error occurred while starting Electron.",
				"Please make sure the dependency `electron` is installed."
			],
			stack: error.stack || error
		});
	}
};

module.exports = (port) => {
	const compiler = webpack(webpackConfig);

	// Starting (re)compiling

	compiler.hooks.invalid.tap("invalid", () => {
		clearConsole();
		spinnies.add("compile", { text: "Compiling..." });
	});

	// Finished (re)compiling

	compiler.hooks.done.tap("done", () => {
		clearConsole();
		spinnies.remove("compile");

		if (!isElectronStarted) _startElectron(port);
	});

	return new WebpackDevServer({ ...devServerConfig, port }, compiler);
};