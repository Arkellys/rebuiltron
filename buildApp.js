const fsExtra = require("fs-extra");
const clearConsole = require("react-dev-utils/clearConsole");
const webpack = require("webpack");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const { isEmpty, head } = require("lodash");

const paths = require("./helpers/paths");
const webpackConfig = require("./webpack.config");
const spinnies = require("./helpers/spinnies");


module.exports = (previousFileSizes) => {
	fsExtra.emptyDirSync(paths.appBuild);

	clearConsole();
	spinnies.add("build", { text: "Creating the production build" });

	const compiler = webpack(webpackConfig);

	return new Promise((resolve, reject) => {
		compiler.run((error, stats) => {
			const statsData = error
				? { errors: [error?.message || error], warnings: [] }
				: stats.toJson({ all: false, warnings: true, errors: true });

			const { errors, warnings } = formatWebpackMessages(statsData);

			return !isEmpty(errors)
				? reject(["Failed to compile.\n", head(errors)])
				: resolve({ stats, previousFileSizes, warnings });
		});
	});
};