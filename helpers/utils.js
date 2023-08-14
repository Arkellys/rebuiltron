const path = require("path");
const fs = require("fs");

const { isArray } = require("lodash");

const log = require("./logger");
const spinnies = require("./spinnies");


const _appDirectory = fs.realpathSync(process.cwd());


/**
 * Resolves a path relative to the app directory.
 * @param {string} relativePath - Path to resolve
 * @returns {string} Resolved path
 */

const resolveApp = (relativePath) => path.resolve(_appDirectory, relativePath);

/**
 * Logs error message and stack (if available) and exit the running process.
 * @param {(Error|import("./logger").LogMessage)} error - Error to log
 */

const exitProcessWithError = (error) => {
	spinnies.stopAll("fail");

	log.error(error?.message || error);
	if (error.stack) log.info(error.stack);

	process.exit(1);
};

/**
 * Returns the given value when the condition is truthy, otherwise an empty element of the same type.
 * @param {any} condition - Condition determining if the value should be returned
 * @param {(object|Array)} value - Value to return
 * @returns {(object|Array)} Value or empty element
 */

const emptyOr = (condition, value) => {
	const empty = isArray(value) ? [] : {};
	return condition ? value : empty;
};


module.exports = { resolveApp, exitProcessWithError, emptyOr };