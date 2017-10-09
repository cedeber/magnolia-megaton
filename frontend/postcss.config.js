module.exports = ({ file, options, env }) => ({
    plugins: {
        "postcss-import": {},
        "postcss-cssnext": { browsers: ["last 3 versions"] },
        "postcss-discard-comments": env === 'production' ? { removeAll: true }: false,
        "postcss-discard-empty": env === 'production' ? {} : false,
        "postcss-sorting": env === 'production' ? { "clean-empty-lines": true } : false,
        "cssnano": env === 'production' ? {
            zindex: false,
            normalizeUrl: false,
            normalizeCharset: false,
            autoprefixer: false,
            calc: false,
            convertValues: false,
            discardUnused: false,
        } : false
    }
});
