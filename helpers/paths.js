const rebuiltronConfig = require("../rebuiltronConfig.js");
const { isEnvDevelopment } = require("./environment.js");
const { resolveApp } = require("./utils.js");


module.exports = {
	appConfig: resolveApp(rebuiltronConfig.configFileName),
	appPath: resolveApp("."),
	appBuild: resolveApp(rebuiltronConfig.appDirs.build),
	appPublic: resolveApp(rebuiltronConfig.appDirs.public),
	src: resolveApp(rebuiltronConfig.appDirs.src),
	appNodeModules: resolveApp("node_modules"),
	appWebpackCache: resolveApp("node_modules/.cache"),
	basePath: isEnvDevelopment ? "/" : "./"
};