const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const { bold } = require("chalk");

const spinnies = require("../helpers/spinnies");


/**
 * Starts Electron.
 * @param {number} port - Port on which the renderer is served
 * @returns {Promise<void>} Promise resolving when compilation is successful
 */

module.exports = (port) => (
	new Promise((resolve, reject) => {
		spinnies.add("electron", { text: `Starting ${bold("Electron")}` });

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

			spinnies.succeed("electron", { text: `${bold("Electron")} started` });
			resolve();

		} catch (error) {
			spinnies.fail("electron", { text: `${bold("Failed")} to start Electron` });
			reject(error);
		}
	})
);