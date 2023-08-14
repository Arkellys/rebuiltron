const fs = require("fs");

const detect = require("detect-port");

const { isEnvProduction } = require("./helpers/environment");
const rebuiltronConfig = require("./rebuiltronConfig");
const { resolveApp } = require("./helpers/utils");

/**
 * Checks whether the default port is available, otherwise resolves with the next available port.
 */

const checkPort = new Promise(async (resolve) => {
	if (isEnvProduction) resolve();

	const defaultPort = 3000;
	const nextAvailablePort = await detect(defaultPort);

	resolve(nextAvailablePort);
});

/**
 * Checks whether Electron's entry point is set.
 */

const checkEntryPoint = new Promise((resolve, reject) => {
	const packageJsonPath = resolveApp("package.json");
	const { main } = require(packageJsonPath);

	if (!main) {
		reject([
			"No entry point found for Electron.",
			"Please add a `main` field in `package.json`."
		]);
	}

	resolve();
});

/**
 * Checks whether Rebuiltron's config file exists and contains the required fields.
 */

const checkAppConfig = new Promise((resolve, reject) => {
	const configPath = resolveApp(rebuiltronConfig.configFileName);

	if (!fs.existsSync(configPath)) {
		reject([
			"Not configuration file found.",
			`Please create a \`${rebuiltronConfig.configFileName}\` file.`
		]);
	}

	const { preloads, renderers } = require(configPath);

	if (!preloads) reject("Configuration error: `preloads` field is required.");
	if (!renderers) reject("Configuration error: `renderers` field is required.");

	resolve();
});


module.exports = Promise.all([checkPort, checkEntryPoint, checkAppConfig]);