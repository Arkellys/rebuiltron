process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";


const { exitProcessWithError, clearConsole } = require("../helpers/utils");
const checkSetup = require("../tasks/checkSetup");
const compileMain = require("../tasks/compileMain");
const startDevServer = require("../tasks/startDevServer");
const startElectron = require("../tasks/startElectron");
const watchPreloads = require("../tasks/watchPreloads");


process.on("unhandledRejection", exitProcessWithError);

checkSetup.then(async ([port]) => {
	clearConsole();

	await watchPreloads();
	await compileMain();
	const devServer = await startDevServer(port);
	await startElectron(port);

	console.log();

	["SIGINT", "SIGTERM"].forEach((sig) => {
		process.on(sig, async () => {
			await devServer.stop();
			process.exit();
		});
	});
}).catch(exitProcessWithError);