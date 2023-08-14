module.exports = [
	{
		test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
		type: "asset",
		parser: {
			dataUrlCondition: {
				maxSize: 10000
			}
		}
	},
	{
		test: /\.svg$/,
		issuer: /\.jsx?$/,
		use: [{
			loader: require.resolve("@svgr/webpack"),
			options: {
				prettier: false,
				svgo: false,
				titleProp: true,
				ref: true
			}
		}]
	}
];