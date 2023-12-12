module.exports = function override(webpackConfig) {
    webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
    });

    webpackConfig.resolve = { ...webpackConfig.resolve, ...{ fallback: { crypto: require.resolve("crypto-browserify") } } } 

    return webpackConfig;
}