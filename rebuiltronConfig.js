module.exports = {
	configFileName: "rebuiltron.config.js",
	buildDirs: {
		js: "static/js",
		media: "static/media",
		css: "static/css"
	},
	buildFileNames: {
		main: "electron.main",
		preload: "electron.preload"
	},
	appDirs: {
		public: "public",
		electronSrc: "electron",
		appSrc: "src",
		build: "build"
	}
};