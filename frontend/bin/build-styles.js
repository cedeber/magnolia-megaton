const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const postcss = require("postcss");
const postcssImport = require("postcss-import");
const postcssCssnext = require("postcss-cssnext");
const postcssDiscardComments = require("postcss-discard-comments");
const postcssDiscardEmpty = require("postcss-discard-empty");
const postcssSorting = require("postcss-sorting");
const postcssCssnano = require("cssnano");
const chalk = require("chalk");

const appConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "../binconfig.yaml"), "utf-8"));
const plugins = [
    postcssImport,
    // postcssCssnext({ browsers: ["last 2 versions", "not ie < 12", "not ie_mob < 12", "not bb < 10", "not op_mob < 37"] }),
    postcssCssnext({ browsers: ["last 3 versions"] }),
    postcssDiscardComments({ removeAll: true }),
    postcssDiscardEmpty,
    postcssSorting({ "clean-empty-lines": true }),
];
let sourcemap = false;
let watch = false;

function cleanEmptyLines(input) {
    return input.replace(/\r\n\s*\r\n/g, "\r\n").replace(/\n\s*\n/g, "\n");
}

for (let i = 2, l = process.argv.length; i < l; i++) {
    switch (process.argv[i]) {
        case "--sourcemap":
            sourcemap = true;
            break;
        case "--watch":
            watch = true;
            break;
        case "--minify":
            plugins.push(postcssCssnano({
                zindex: false,
                normalizeUrl: false,
                normalizeCharset: false,
                autoprefixer: false,
                calc: false,
                convertValues: false,
                discardUnused: false,
            }));
            break;

        // skip default
    }
}

function buildStyleFile(file) {
    if (path.extname(file) !== ".css") { return; }

    const inputFile = path.resolve(appConfig.paths.source.styles, file);
    const outputFile = path.resolve(appConfig.paths.build.styles, path.basename(file));

    fs.readFile(inputFile, "utf8", (error, data) => {
        if (error) { console.error(error); return; }

        const options = sourcemap ? {
            from: inputFile,
            to: outputFile,
            map: { inline: false, sourcesContent: false },
        } : {
            from: inputFile,
            to: outputFile,
        };

        postcss(plugins).
            process(data, options).
            then(result => {
                result.warnings().forEach(warn => console.warn(warn.toString()));
                if (result.warnings().length > 0) { return; }
                if (sourcemap) {
                    fs.writeFile(outputFile, result.css, () => console.log(`${chalk.yellow("[INFO]")} ${chalk.green.bold("✓")} ${chalk.dim("source")}\t\t${chalk.blue(file)}`));
                    fs.writeFile(`${outputFile}.map`, result.map, () => console.log(`${chalk.yellow("[INFO]")} ${chalk.green.bold("✓")} ${chalk.dim("sourcemap")}\t${chalk.cyan(file + ".map")}`));
                }
                else {
                    fs.writeFile(outputFile, cleanEmptyLines(result.css), () => console.log(`${chalk.yellow("[INFO]")} ${chalk.green.bold("✓")} ${chalk.dim("source")}\t\t${chalk.blue(file)}`));
                }
            }).
            catch((err) => console.error(`\n${chalk.red("[ERROR]")} ${chalk.red.bold("✗")} ${chalk.bold(err.reason)} ${chalk.magenta(path.relative(appConfig.paths.source.styles, err.input.file))}:${err.input.line}:${err.input.column} ${chalk.dim(err.plugin)}\n${err.showSourceCode(true)}`));
    });
}

function main() {
    fs.readdir(appConfig.paths.source.styles, (error, files) => {
        if (error) { console.warn(error); return; }

        for (const file of files) { buildStyleFile(file); }
    });
}

if (watch) {
    fs.watch(appConfig.paths.source.styles, { recursive: true }, (eventType, fileName) => {
        if (eventType === "change") {
            // [TODO] check if file is CSS
            console.log(`\n${chalk.bold("File change:")} ${chalk.magenta(fileName)}`);
            main();
        }
    });
}

main();
