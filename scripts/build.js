process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";


const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = require("react-dev-utils/FileSizeReporter");
const { isEmpty } = require("lodash");
const clearConsole = require("react-dev-utils/clearConsole");

const checkSetup = require("../checkSetup");
const paths = require("../helpers/paths");
const { exitProcessWithError } = require("../helpers/utils");
const log = require("../helpers/logger");
const spinnies = require("../helpers/spinnies");


process.on("unhandledRejection", exitProcessWithError);

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

checkSetup
	.then(() => measureFileSizesBeforeBuild(paths.appBuild))
	.then(previousFileSizes => {
		const buildApp = require("../buildApp");
		return buildApp(previousFileSizes);
	})
	.then(({ stats, previousFileSizes, warnings }) => {
		spinnies.remove("build");
		clearConsole();

		isEmpty(warnings)
			? log.success("Compiled successfully!")
			: log.warning(["Compiled with warnings.\n", warnings.join("\n\n")]);

		console.log("File sizes after gzip:\n");

		printFileSizesAfterBuild(
			stats,
			previousFileSizes,
			paths.appBuild,
			WARN_AFTER_BUNDLE_GZIP_SIZE,
			WARN_AFTER_CHUNK_GZIP_SIZE
		);

		console.log();
		process.exit(0);
	})
	.catch(exitProcessWithError);