const Spinnies = require("spinnies");


let spinnies = null;
spinnies ??= new Spinnies({ spinnerColor: "cyan", color: "blue", succeedColor: "white" });

module.exports = spinnies;