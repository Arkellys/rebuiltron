const { mapKeys } = require("lodash");

const paths = require("../helpers/paths");
const javascriptLoaders = require("../loaders/javascript");
const rebuiltronConfig = require("../rebuiltronConfig");

const baseConfig = require("./base");


const { preloads } = require(paths.appConfig);


module.exports = {
	...baseConfig,
	mode: "production",
	target: "electron-preload",
	entry: mapKeys(preloads, (_value, entryName) => (
		`${rebuiltronConfig.buildFileNames.preload}.${entryName}`
	)),
	output: {
		...baseConfig.output,
		filename: `${rebuiltronConfig.buildDirs.js}/[name].js`
	},
	module: {
		...baseConfig.module,
		rules: [{
			oneOf: javascriptLoaders
		}]
	}
};