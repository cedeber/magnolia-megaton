const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/* --- configuration --- */
const env = process.env.NODE_ENV;
const buildPath = env === 'prototype' ? path.resolve(__dirname, '../prototype/app/') : path.resolve(__dirname, '../magnolia/light-modules/main/webresources/app/');
const publicPath = env === 'prototype' ? '/app/' : `${env === 'production' ? '' : '/author'}/.resources/main/webresources/app/`;

const config = {
    entry: {
        main: './src/main.ts',
        polyfills: ['es6-shim', 'whatwg-fetch', 'matchmedia-polyfill', 'intersection-observer', 'objectFitPolyfill', './polyfills']
    },
    output: {
        filename: env === 'production' ? '[name].bundle.js' : '[name].debug.js',
        path: buildPath,
        publicPath: publicPath,
    },
    plugins: [
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
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(env),
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
            },
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
                    extractCSS: true,
                    postcss: [
                        require('postcss-import')(),
                        require('postcss-url')({ url: 'rebase' }),
                        require('postcss-cssnext')({ browsers: ['last 3 versions'], warnForDuplicates: false }),
                    ],
                    loaders: {
                        i18n: '@kazupon/vue-i18n-loader',
                    },
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href',
                    },
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1, camelCase: true, sourceMap: true } },
                        { loader: 'postcss-loader', options: {
                            sourceMap: true,
                            ident: 'postcss',
                            plugins: () => {
                                let plugins = [
                                    require('postcss-import')(),
                                    require('postcss-url')({ url: 'rebase' }),
                                    require('postcss-cssnext')({ browsers: ['last 3 versions'], warnForDuplicates: false }),
                                ];

                                if (env === 'production') {
                                    plugins.push(require('cssnano')({
                                        zindex: false,
                                        normalizeUrl: false,
                                        normalizeCharset: false,
                                        autoprefixer: false,
                                        calc: false,
                                        convertValues: false,
                                        discardUnused: false,
                                    }));
                                }

                                return plugins;
                            },
                        }},
                    ],
                }),
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: { name: "[name].[hash].cache.[ext]" },
                }],
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
    config.plugins = (config.plugins || []).concat([
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                mangle: true,
                compress: true,
            }
        }),
    ]);
}

module.exports = config;
