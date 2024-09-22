process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";


const checkSetup = require("../tasks/checkSetup");
const startDevServer = require("../tasks/startDevServer");
const compileMain = require("../tasks/compileMain");
const watchPreloads = require("../tasks/watchPreloads");
const startElectron = require("../tasks/startElectron");
const { exitProcessWithError, clearConsole } = require("../helpers/utils");


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