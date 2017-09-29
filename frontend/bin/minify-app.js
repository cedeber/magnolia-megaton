const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const UglifyJS = require("uglify-js");

const appConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "../binconfig.yaml"), "utf-8"));

function compress(file, options) {
    fs.readFile(file, "utf-8", (error, data) => {
        if (error) { console.warn(error); return; }

        const result = UglifyJS.minify(data, options);

        if (result.error) { console.warn("[ERROR]", result.error, `=> ${path.basename(file)}`); }
        if (result.warnings) { console.warn("[WARNING]", result.warnings, `=> ${path.basename(file)}`); }

        if (result.code) {
            fs.writeFile(file, result.code, errCode => {
                if (errCode) { console.warn(error); return; }
                console.log("[INFO]", path.basename(file));
            });
        }

        if (result.map) {
            fs.writeFile(`${file}.map`, result.map, errCode => {
                if (errCode) { console.warn(error); return; }
                console.log("[INFO]", `${path.basename(file)}.map`);
            });
        }
    });
}

function config(file) {
    const options = {
        warnings: true,
        mangle: false,
        sourceMap: {},
    };

    // read sourcemap content
    if (fs.existsSync(`${file}.map`)) {
        fs.readFile(`${file}.map`, "utf8", (error, data) => {
            if (error) { console.warn(error); return; }

            options.sourceMap = {
                filename: path.basename(file),
                root: "",
                content: data,
                url: `${path.basename(file)}.map`,
            };

            compress(file, options);
        });
    }
}

function walk(directoryName) {
    fs.readdir(directoryName, (error1, files) => {
        if (error1) { console.warn(error1); return; }

        files.forEach(file => {
            const fullPath = path.join(directoryName, file);

            fs.stat(fullPath, (error2, f) => {
                if (error2) { console.warn(error2); return; }

                if (f.isDirectory()) { walk(fullPath); }
                else { if (path.extname(file) === ".js") { config(fullPath); } }
            });
        });
    });
}

walk(appConfig.paths.build.scripts.app);
