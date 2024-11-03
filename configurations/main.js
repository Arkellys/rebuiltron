const paths = require("../helpers/paths");
const javascriptLoaders = require("../loaders/javascript");
const rebuiltronConfig = require("../rebuiltronConfig");

const baseConfig = require("./base");


const { main } = require(paths.appConfig);


module.exports = {
	...baseConfig,
	mode: "production",
	target: "electron-main",
	entry: {
		[rebuiltronConfig.buildFileNames.main]: main
	},
	output: {
		...baseConfig.output,
		filename: `${rebuiltronConfig.buildDirs.js}/[name].js`
	},
	module: {
		...baseConfig.module,
		rules: [
			{
				oneOf: javascriptLoaders
			}
		]
	}
};