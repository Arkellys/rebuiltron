/* eslint-disable jsdoc/valid-types, jsdoc/match-description */

const fs = require("fs");
const { styleText } = require("node:util");
const path = require("path");

const { isArray } = require("lodash");

const { COMPILATION_STATES } = require("./constants");
const spinnies = require("./spinnies");


/**
 * @import { Stats } from "webpack"
 * @import { COMPILATION_ASSETS } from "./constants"
 */

/**
 * Path of the app directory.
 */

const _appDirectory = fs.realpathSync(process.cwd());

/**
 * Resolves a path relative to the app directory.
 * @param {string} relativePath - Path to resolve
 * @returns {string} Resolved path
 */

const resolveApp = (relativePath) => path.resolve(_appDirectory, relativePath);

/**
 * Logs error message (if provided) and exits the running process.
 * @param {Error} [error] - Error to log
 */

const exitProcessWithError = (error) => {
	spinnies.stopAll("fail");

	if (!error) return;
	console.log(styleText("red", `\n${error?.message || error}\n`));

	process.exit(1);
};

/**
 * Returns the given value when the condition is truthy, otherwise an empty element of the same type.
 * @param {any} condition - Condition determining if the value should be returned
 * @param {(object | Array)} value - Value to return
 * @returns {(object | Array)} Value or empty element
 */

const emptyOr = (condition, value) => {
	const empty = isArray(value) ? [] : {};
	return condition ? value : empty;
};

/**
 * Clears the console.
 */

const clearConsole = () => {
	process.stdout.write(
		process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H"
	);
};

/**
 * Logs stats.
 * @param {Stats} stats - Stats to log
 */

const logStats = (stats) => {
	console.log();

	console.log(stats.toString({
		colors: true,
		all: false,
		warnings: true,
		errors: true,
		errorDetails: false
	}));
};

/**
 * @typedef CompilationData
 * @property {COMPILATION_ASSETS[keyof COMPILATION_ASSETS]} [asset] - Type of the compiled asset
 * @property {COMPILATION_STATES[keyof COMPILATION_STATES]} state - Compilation state
 * @property {Stats} [stats] - Compilation stats
 */

/**
 * Constructs the text to display for the given compilation state.
 * @param {CompilationData} data - Compilation data
 * @returns {string} Compilation text
 */

const getCompilationText = ({ asset, state, stats }) => {
	let prefix = asset ? styleText("bold", `${asset}: `) : "";

	if (state === COMPILATION_STATES.PENDING) return prefix + `${asset ? "c" : "C"}ompiling...`;
	if (state === COMPILATION_STATES.FATAL_ERROR) return prefix + styleText("bold", `${asset ? "f" : "F"}ailed`) + " to compile";

	prefix += `${asset ? "c" : "C"}ompiled `;

	if (state === COMPILATION_STATES.SUCCESS) return prefix + styleText(["green", "bold"], "successfully");

	const isError = state === COMPILATION_STATES.ERROR;

	const count = stats.toJson()[isError ? "errorsCount" : "warningsCount"];
	const color = isError ? "red" : "yellow";

	return prefix + "with " + styleText([color, "bold"], `${count} ${state}${count > 1 ? "s" : ""}`);
};


module.exports = {
	resolveApp,
	exitProcessWithError,
	emptyOr,
	logStats,
	clearConsole,
	getCompilationText
};