const paths = require("../helpers/paths");
const rebuiltronConfig = require("../rebuiltronConfig");
const baseConfig = require("./base");


const { main } = require(paths.appConfig);


module.exports = {
	...baseConfig,
	target: "electron-main",
	entry: {
		[rebuiltronConfig.buildFileNames.main]: main
	},
	output: {
		...baseConfig.output,
		filename: `${rebuiltronConfig.buildDirs.js}/[name].js`
	}
};