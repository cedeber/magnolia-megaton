const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/* --- CONFIG --- */
const env = process.env.NODE_ENV;
const buildPath = path.resolve(__dirname, '../light-modules/main/webresources/app/');
const publicPath = `${env === 'production' ? '' : '/author'}/.resources/main/webresources/app/`;

module.exports = {
    entry: {
        main: './src/main.ts',
        polyfills: ['es6-shim', 'whatwg-fetch', 'matchmedia-polyfill', 'intersection-observer', 'objectFitPolyfill']
    },
    output: {
        filename: env === 'production' ? '[name].bundle.js' : '[name].debug.js',
        path: buildPath,
        publicPath: publicPath,
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // Specify the common bundle's name.
        // }),
        new CleanWebpackPlugin(
            [buildPath],
            {
                root: path.resolve(__dirname, "../"),
                verbose: false,
            }
        ),
        new ExtractTextPlugin({
            filename: env === 'production' ? '[name].bundle.css' : '[name].debug.css',
            allChunks: true,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    silent: true,
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            fallback: 'vue-style-loader',
                            use: [
                                {loader: 'css-loader', options: {sourceMap: true}},
                            ],
                        })
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {loader: 'css-loader', options: {importLoaders: 1, camelCase: true, sourceMap: true}},
                        {loader: 'postcss-loader', options: {sourceMap: true}},
                    ]
                }),
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2)$/,
                loader: 'file-loader',
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".vue"],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devtool: '#source-map'
};

if (env === 'production') {
    // module.exports.devtool = '#source-map';
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
                compress: true,
            }
        }),
    ])
}
