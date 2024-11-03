const arklintConfig = require("eslint-config-arklint");
const { importConfig, jsdocConfig } = require("eslint-config-arklint/extensions");


module.exports = [
	...arklintConfig,
	...importConfig,
	...jsdocConfig
];