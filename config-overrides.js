const webpack = require('webpack')
module.exports = function override(config, env) {
    // New config, e.g. config.plugins.push...
    config.resolve.fallback = {
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "crypto": require.resolve("crypto-browserify"),
        "url": require.resolve("url/"),
        "assert": require.resolve("assert/"),
        "buffer": require.resolve("buffer/"),
    }

    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'create-ecdh/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );
    return config
}