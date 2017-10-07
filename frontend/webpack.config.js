const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const appConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "binconfig.yaml"), "utf-8"));

module.exports = {
    entry: {
        app: appConfig.paths.source.scripts,
        polyfills: ['es6-shim', 'whatwg-fetch', 'matchmedia-polyfill', 'intersection-observer', 'objectFitPolyfill']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, appConfig.paths.build.scripts),
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // Specify the common bundle's name.
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".vue"],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                mangle: true,
                compress: true
            }
        }),
    ])
}
