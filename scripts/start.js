process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";


const clearConsole = require("react-dev-utils/clearConsole");

const checkSetup = require("../checkSetup");
const { exitProcessWithError } = require("../helpers/utils");
const spinnies = require("../helpers/spinnies");


process.on("unhandledRejection", exitProcessWithError);

checkSetup.then(([port]) => {
	const createDevServer = require("../createDevServer");
	const devServer = createDevServer(port);

	clearConsole();
	spinnies.add("devServer", { text: "Starting the development server" });

	devServer.start();

	["SIGINT", "SIGTERM"].forEach((sig) => {
		process.on(sig, () => {
			devServer.close();
			process.exit();
		});
	});
}).catch(exitProcessWithError);