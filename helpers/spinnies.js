const Spinnies = require("spinnies");


let spinnies = null;
spinnies ??= new Spinnies({ spinnerColor: "cyanBright", color: "blue", succeedColor: "white" });

module.exports = spinnies;