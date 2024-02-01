const { isEnvDevelopment } = require("./helpers/environment");
const rendererConfig = require("./configurations/renderers");
const preloadConfig = require("./configurations/preloads");
const mainConfig = require("./configurations/main");


module.exports = isEnvDevelopment ? rendererConfig : [rendererConfig, mainConfig, preloadConfig];