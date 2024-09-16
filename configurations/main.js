const paths = require("../helpers/paths");
const rebuiltronConfig = require("../rebuiltronConfig");
const baseConfig = require("./base");
const javascriptLoaders = require("../loaders/javascript");


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