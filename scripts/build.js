process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";


const fsExtra = require("fs-extra");
const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = require("react-dev-utils/FileSizeReporter");

const buildApp = require("../tasks/buildApp");
const checkSetup = require("../tasks/checkSetup");
const paths = require("../helpers/paths");
const { exitProcessWithError } = require("../helpers/utils");


process.on("unhandledRejection", exitProcessWithError);

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

checkSetup
	.then(() => (
		measureFileSizesBeforeBuild(paths.appBuild)
	))
	.then((previousFileSizes) => {
		fsExtra.emptyDirSync(paths.appBuild);
		return buildApp(previousFileSizes);
	})
	.then(({ stats, previousFileSizes }) => {
		console.log("\nFile sizes after gzip:\n");

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