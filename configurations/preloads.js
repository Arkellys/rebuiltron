const { mapKeys } = require("lodash");

const paths = require("../helpers/paths");
const rebuiltronConfig = require("../rebuiltronConfig");
const baseConfig = require("./base");


const { preloads } = require(paths.appConfig);


module.exports = {
	...baseConfig,
	target: "electron-preload",
	entry: mapKeys(preloads, (_value, entryName) => (
		`${rebuiltronConfig.buildFileNames.preload}.${entryName}`)
	),
	output: {
		...baseConfig.output,
		filename: `${rebuiltronConfig.buildDirs.js}/[name].js`
	}
};