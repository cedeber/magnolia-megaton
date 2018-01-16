// tslint:disable:max-line-length object-literal-sort-keys

const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin"); // Clean build folders
const UglifyJSPlugin = require("uglifyjs-webpack-plugin"); // Minify JS
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // Extract CSS
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // Analyze bundle modules size

// We create a "shell.css" file which is injected in <HEAD> thanks to FreeMarker.
// This is optimized for Single Page App and Progressive Web App
const shellCSS = new ExtractTextPlugin("shell.css");
const appsCSS = new ExtractTextPlugin("[name].css");

/* --- configuration --- */
const env = process.env.NODE_ENV;
const buildPath = env === "prototype" ? path.resolve(__dirname, "../prototype/app/") : path.resolve(__dirname, "../magnolia/light-modules/main/webresources/build/");
const publicPath = "/app/"; // we do redirecting, see `magnolia/virtualUriMappings`
const appChunks = ["main"]; // You can have multiple applications in case you do multi page websites. They will share common plugins in commons.js wich includes the polyfills
const reportFilename = "../../../../../frontend/report.html"; // must be relative to `buildPath` and saved into `frontend`

/**
 * PostCSS plugins
 * @returns {*[]}
 */
function getPostCSSPlugins() {
    let plugins = [
        require("postcss-import")(),
        require("postcss-cssnext")({
            browsers: ["last 3 versions"],
            warnForDuplicates: false,
        }),
    ];

    return plugins;
}

/**
 * CSS loader integrates cssnano
 * This is the cssnano options if in production
 * @returns {*}
 */
function getCSSNanoOptions() {
    return env === "production" ? {
        zindex: false,
        normalizeUrl: false,
        normalizeCharset: false,
        autoprefixer: false,
        calc: false,
        convertValues: false,
        discardUnused: false,
    } : false;
}

/**
 * CSS loaders with PostCSS
 * @type {*[]}
 */
const cssExtractUse = [
    { loader: "css-loader", options: { importLoaders: 1, camelCase: true, sourceMap: true, minimize: getCSSNanoOptions() } },
    { loader: "postcss-loader", options: {
        sourceMap: true,
        ident: "postcss",
        plugins: getPostCSSPlugins(),
    }},
];

const config = {
    entry: {
        main: "./src/main.ts",

        // polyfills is declared here but will be included within commons.js, see CommonsChunkPlugin
        polyfills: ["es6-shim", "whatwg-fetch", "matchmedia-polyfill", "intersection-observer", "objectFitPolyfill", "./polyfills"],
    },
    output: {
        // We don't use [hash] because we import scripts with Magnolia
        filename: "[name].js",
        path: buildPath,
        publicPath: publicPath,
    },
    plugins: [
        new CleanWebpackPlugin(
            [buildPath],
            {
                root: path.resolve(__dirname, "../"),
                verbose: false,
            },
        ),

        // Used for asynchronously loaded modules => `import().then()`
        new webpack.NamedChunksPlugin(
            chunk => chunk.name || chunk.mapModules(m => path.basename(m.request, ".ts")).join("_"),
        ),
        shellCSS,
        appsCSS,

        // Mainly needed for taggr, but can be used as if it's node.js
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(env),
            },
        }),

        // Extract common modules and concat them with the polyfills
        new webpack.optimize.CommonsChunkPlugin({
            name: "polyfills",
            filename: "commons.js",
            chunks: appChunks,
        }),
    ],
    module: {
        rules: [
            {
                // Output tslint while compiling
                test: /\.ts$/,
                enforce: "pre",
                loader: "tslint-loader",
            },
            {
                // Compiles from TypeScript
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    silent: true,
                },
            },
            {
                // Vue Single file components
                // The CSS from component is compiled through cssnext
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    postcss: {
                        useConfigFile: false,
                        plugins: getPostCSSPlugins(),
                    },
                    loaders: {
                        i18n: "@kazupon/vue-i18n-loader",
                        css: appsCSS.extract({
                            fallback: "vue-style-loader",
                            use: {
                                loader: "css-loader",
                                options: { camelCase: true, sourceMap: true, minimize: getCSSNanoOptions() },
                            },
                        }),
                    },

                    // Transforms asset paths in Vue templates to require expressions that webpack can handle
                    transformToRequire: {
                        video: "src",
                        source: "src",
                        img: "src",
                        image: "xlink:href",
                    },
                },
            },
            {
                // When you import shell.css it extracts it separately
                test: /\b(?=shell\b)\w+\.css$/,
                use: shellCSS.extract({
                    fallback: "style-loader",
                    use: cssExtractUse,
                }),
            },
            {
                // Default CSS, except shell.css
                test: /\b(?!shell\b)\w+\.css$/,
                use: appsCSS.extract({
                    fallback: "style-loader",
                    use: cssExtractUse,
                }),
            },
            {
                // All assets that have to be packaged
                test: /\.(png|svg|jpg|gif|woff|woff2)$/,
                use: [{
                    loader: "file-loader",

                    // We add a `*.cache.*` so that Magnolia cache it for a very long time
                    options: { name: "[name].[hash].cache.[ext]" },
                }],
            },
        ],
    },
    resolve: {
        // We use the ESM version of Vue
        extensions: [".ts", ".js", ".vue"],
        alias: {
            "vue$": "vue/dist/vue.esm.js",
        },
    },
    devtool: "source-map",
};

if (env === "production") {
    config.plugins = (config.plugins || []).concat([
        // Compress JS if in production
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                mangle: true,
                compress: true,
            },
        }),

        // Generates a bundle overview on each build
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename,
        }),
    ]);

    // Remove sourcemap for production
    config.devtool = undefined;
}

module.exports = config;
