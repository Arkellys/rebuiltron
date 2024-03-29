const rebuiltronConfig = require("../rebuiltronConfig.js");
const { isEnvDevelopment } = require("./environment.js");
const { resolveApp } = require("./utils.js");


const packageJsonPath = resolveApp("package.json");
const packageJson = require(packageJsonPath);


module.exports = {
	appConfig: resolveApp(rebuiltronConfig.configFileName),
	electronMain: resolveApp(packageJson.main),
	appPath: resolveApp("."),
	appBuild: resolveApp(rebuiltronConfig.appDirs.build),
	appPublic: resolveApp(rebuiltronConfig.appDirs.public),
	appPackageJson: packageJsonPath,
	appSrc: resolveApp(rebuiltronConfig.appDirs.appSrc),
	electronSrc: resolveApp(rebuiltronConfig.appDirs.electronSrc),
	appNodeModules: resolveApp("node_modules"),
	appWebpackCache: resolveApp("node_modules/.cache"),
	basePath: isEnvDevelopment ? "/" : "./"
};