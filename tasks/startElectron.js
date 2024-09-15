const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const spinnies = require("../helpers/spinnies");


/**
 * Starts Electron.
 * @param {number} port - Port on which the renderer is served
 */

module.exports = (port) => (
	new Promise((resolve, reject) => {
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

			spinnies.succeed("electron", { text: "Electron started" });
			resolve();

		} catch (error) {
			spinnies.fail("electron", { text: "Failed to start Electron" });
			reject(error);
		}
	})
);