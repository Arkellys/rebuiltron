const mainConfig = require("./configurations/main");
const preloadConfig = require("./configurations/preloads");
const rendererConfig = require("./configurations/renderers");


module.exports = {
	development: {
		renderers: rendererConfig,
		main: mainConfig,
		preloads: preloadConfig
	},
	production: [rendererConfig, mainConfig, preloadConfig]
};