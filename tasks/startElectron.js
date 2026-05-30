const { spawn } = require("child_process");
const fs = require("fs");
const { styleText } = require("node:util");
const path = require("path");

const spinnies = require("../helpers/spinnies");


/**
 * Starts Electron.
 * @param {number} port - Port on which the renderer is served
 * @returns {Promise<void>} Promise resolving when compilation is successful
 */

module.exports = (port) => (
	new Promise(async (resolve, reject) => {
		spinnies.add("electron", { text: `Starting ${styleText("bold", "Electron")}` });

		try {
			const electronPath = require.resolve("electron");
			const electronModulePath = path.dirname(electronPath);
			const electronDistPath = path.join(electronModulePath, "dist");

			const isElectronInstalled = fs.existsSync(electronDistPath);

			if (!isElectronInstalled) {
				await new Promise((resolveInstall, rejectInstall) => {
					const installScript = path.join(electronModulePath, "install.js");

					spawn(process.execPath, [installScript], {
						stdio: "inherit",
						env: process.env
					}).on("close", (code) => {
						if (code === 0) return resolveInstall();
						rejectInstall(new Error(`Electron install failed (exit ${code})`));

					}).on("error", rejectInstall);
				});
			}

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

			spinnies.succeed("electron", { text: `${styleText("bold", "Electron")} started` });
			resolve();

		} catch (error) {
			spinnies.fail("electron", { text: `${styleText("bold", "Failed")} to start Electron` });
			reject(error);
		}
	})
);