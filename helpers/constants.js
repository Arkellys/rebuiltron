const COMPILATION_ASSETS = Object.freeze({
	PRELOAD: "Preload",
	MAIN: "Main",
	RENDERER: "Renderer"
});

const COMPILATION_STATES = Object.freeze({
	PENDING: "pending",
	FATAL_ERROR: "fatalError",
	ERROR: "error",
	WARNING: "warning",
	SUCCESS: "success"
});


module.exports = { COMPILATION_ASSETS, COMPILATION_STATES };