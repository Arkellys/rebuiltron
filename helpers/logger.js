const { red, green, yellow, black } = require("colorette");
const { isString } = require("lodash");


/**
 * @typedef {(string|string[])} LogMessage
 */

/**
 * Formats a message into a single string.
 * @param {LogMessage} message - Message to format
 * @returns {string} Formatted message
 */

const _formatMessage = (message) => {
	if (isString(message)) return message;
	return message.join("\n");
};


/**
 * Logs a message in red.
 * @param {LogMessage} message - Message to log
 */

const logError = (message) => console.log(red(`\n${_formatMessage(message)}\n`));

/**
 * Logs a message in green.
 * @param {LogMessage} message - Message to log
 */

const logSuccess = (message) => console.log(green(`\n${_formatMessage(message)}\n`));

/**
 * Logs a message in yellow.
 * @param {LogMessage} message - Message to log
 */

const logWarning = (message) => console.log(yellow(`\n${_formatMessage(message)}\n`));

/**
 * Logs a message in black.
 * @param {string} message - Message to log
 */

const logInfo = (message) => console.log(black(`${message}\n`));


module.exports = {
	error: logError,
	success: logSuccess,
	warning: logWarning,
	info: logInfo
};