const webpack = require("webpack");
const path = require("path");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

/* --- configuration --- */
// Legacy: ES5
// Module: ES6
const legacy =
    process.env.LEGACY &&
    (process.env.LEGACY === "true" || process.env.LEGACY === "1");

// debug == development
const debug =
    process.env.DEBUG &&
    (process.env.DEBUG === "true" || process.env.DEBUG === "1");

// Paths
const publicPath = `${debug ? "/author" : ""}/app${legacy ? "-legacy" : ""}/`; // we do redirecting for Magnolia, see `magnolia/virtualUriMappings`
const resourcesPath = path.resolve(
    __dirname,
    "../../magnolia/light-modules/main/webresources",
);
const buildPath = path.resolve(
    __dirname,
    "../../magnolia/light-modules/main/webresources/build/",
    `${legacy ? "legacy" : "module"}`,
);

// CSS Loader / PostCSS configuration
const cssLoaderConfig = [
    {
        loader: "css-loader",
        options: {
            // import: true,
            minimize: true,
            importLoaders: 1,
            sourceMap: debug,
        },
    },
    {
        loader: "postcss-loader",
        options: {
            ident: "postcss",
            sourceMap: debug ? "inline" : false,
            plugins: [
                require("postcss-import"),
                require("postcss-preset-env")({
                    stage: 2,
                    sourceMap: true,
                    features: {
                        "custom-properties": {
                            preserve: false,
                        },
                        "custom-media-queries": true,
                        "nesting-rules": true,
                    },
                    browsers: "> 0.5% in CH, Firefox ESR, not dead",
                    autoprefixer: {
                        grid: true,
                    },
                }),
            ],
        },
    },
];

if (!debug) {
    cssLoaderConfig[1].options.plugins.push(
        require("cssnano")({
            preset: [
                "default",
                {
                    calc: false,
                },
            ],
        }),
    );
}

// Entries with polyfills
const entry = {
    main: [
        "objectFitPolyfill",
        "intersection-observer",
        "./application/polyfills",
        "./application/src/main.ts",
    ],
};

if (legacy) {
    entry["main"].unshift("core-js/shim", "whatwg-fetch", "matchmedia-polyfill");
}

module.exports = {
    entry,
    output: {
        filename: "[name].js",
        path: buildPath,
        publicPath,
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
        },
    },
    plugins: [
        new CleanWebpackPlugin([buildPath], {
            root: path.resolve(__dirname, "../../"),
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new VueLoaderPlugin(),
        new CopyWebpackPlugin(
            legacy
                ? undefined
                : [
                      {
                          from: "./*-manifest.json",
                          context: "./application/",
                          to: resourcesPath,
                      },
                  ],
        ),
    ],
    module: {
        rules: [
            {
                // Vue Single file components
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        i18n: "@kazupon/vue-i18n-loader",
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
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    silent: true,
                    // overwrite tsconfig.json configuration
                    compilerOptions: legacy
                        ? {
                              target: "es5",
                          }
                        : {},
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, ...cssLoaderConfig],
            },
            {
                // All assets that have to be packaged
                test: /\.(png|svg|jpg|gif|ttf|otf|woff|woff2)$/,
                use: [
                    {
                        loader: "file-loader",

                        // We add a `*.cache.*` so that Magnolia cache it for a very long time
                        options: { name: "[name].[hash].cache.[ext]" },
                    },
                ],
            },
        ],
    },
    devtool: debug ? "inline-source-map" : undefined,
};
