const paths = require("../helpers/paths");
const rebuiltronConfig = require("../rebuiltronConfig");
const baseConfig = require("./base");


module.exports = {
	...baseConfig,
	target: "electron-main",
	entry: {
		[rebuiltronConfig.buildFileNames.main]: paths.electronMain
	},
	output: {
		...baseConfig.output,
		filename: `${rebuiltronConfig.buildDirs.js}/[name].js`
	}
};