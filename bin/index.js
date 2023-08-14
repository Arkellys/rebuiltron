#!/usr/bin/env node

const { exitProcessWithError } = require("../helpers/utils.js");


const args = process.argv.slice(2);
const [script] = args;

const scripts = {
	start: () => require("../scripts/start.js"),
	build: () => require("../scripts/build.js")
};

scripts[script]?.() || exitProcessWithError(`Unknown command: \`${script}\``);