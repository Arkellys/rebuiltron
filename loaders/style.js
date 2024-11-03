const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { shouldUseSourceMap, isEnvDevelopment, isEnvProduction } = require("../helpers/environment");
const paths = require("../helpers/paths");
const { emptyOr } = require("../helpers/utils");
const rebuiltronConfig = require("../rebuiltronConfig");


const { sassOptions } = require(paths.appConfig);


const _publicPath = rebuiltronConfig.buildDirs.css
	.split("/")
	.reduce((path) => (path + "../"), "");

const _getBaseStyleLoaders = () => ([
	...emptyOr(isEnvDevelopment, [require.resolve("style-loader")]),
	...emptyOr(isEnvProduction, [{
		loader: MiniCssExtractPlugin.loader,
		options: { publicPath: _publicPath } // Locates HTML files from bundled `.css`
	}]),
	{
		loader: require.resolve("css-loader"),
		options: {
			importLoaders: 3,
			sourceMap: shouldUseSourceMap,
			modules: {
				mode: "icss"
			}
		}
	},
	{
		loader: require.resolve("postcss-loader"),
		options: {
			postcssOptions: {
				ident: "postcss",
				config: false,
				plugins: [
					"postcss-flexbugs-fixes",
					[
						"postcss-preset-env",
						{
							autoprefixer: {
								flexbox: "no-2009"
							},
							stage: 3
						}
					],
					"postcss-normalize"
				]
			},
			sourceMap: shouldUseSourceMap
		}
	}
]);


module.exports = [
	{
		test: /\.css$/,
		use: _getBaseStyleLoaders({ importLoaders: 1 }),
		sideEffects: true // https://github.com/webpack/webpack/issues/6571
	},
	{
		test: /\.(scss|sass)$/,
		use: [
			..._getBaseStyleLoaders({ importLoaders: 3 }),
			{
				loader: require.resolve("resolve-url-loader"),
				options: {
					sourceMap: shouldUseSourceMap,
					root: paths.src
				}
			},
			{
				loader: require.resolve("sass-loader"),
				options: {
					sourceMap: true,
					...emptyOr(sassOptions?.additionalData, {
						additionalData: (content, loaderContext) => {
							const { data, exclude } = sassOptions.additionalData;
							const { resourcePath, rootContext } = loaderContext;

							const relativeFilePath = path.relative(rootContext, resourcePath);
							const isExcluded = relativeFilePath.match(exclude);

							// Add `additionalData` on non-excluded files
							return isExcluded ? content : data + content;
						}
					})
				}
			}
		],
		sideEffects: true // https://github.com/webpack/webpack/issues/6571
	}
];