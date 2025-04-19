import arklintConfig from "eslint-config-arklint";
import extensions from "eslint-config-arklint/extensions";


const { importConfig, jsdocConfig } = extensions;

export default [
	...arklintConfig,
	...importConfig,
	...jsdocConfig
];