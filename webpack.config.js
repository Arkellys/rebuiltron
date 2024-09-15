const rendererConfig = require("./configurations/renderers");
const preloadConfig = require("./configurations/preloads");
const mainConfig = require("./configurations/main");


module.exports = {
	development: {
		renderers: rendererConfig,
		main: mainConfig,
		preloads: preloadConfig
	},
	production: [rendererConfig, mainConfig, preloadConfig]
};