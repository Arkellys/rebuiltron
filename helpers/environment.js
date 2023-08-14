const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";
const shouldUseSourceMap = isEnvDevelopment;


module.exports = { isEnvDevelopment, isEnvProduction, shouldUseSourceMap };