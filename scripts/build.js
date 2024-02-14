const fs = require("fs");
const sass = require('sass');
const nunjucks = require("nunjucks");
const md5 = require('md5');


const scssCompilation = (inputFile, outputFile) => {
    // Compile scss to css
    // @param inputFile: path to less file
    // @param outputFile: path to css file to be created
    const {css} = sass.compile(inputFile, {style: "compressed"});
    fs.writeFileSync(outputFile, css);

    console.log(`${inputFile} has been compiled to ${outputFile}`);
}

const compileNunjucks = (inputDir, outputDir) => {
    // Compile nunjucks to html
    // @param inputDir: path to directory containing nunjucks files to compile
    // @param outputDir: path to directory to output compiled html files

    const env = nunjucks.configure(inputDir, {
        autoescape: true,
        throwOnUndefined: true,
        trimBlocks: true,
        lstripBlocks: true,
    });

    const files = fs.readdirSync(inputDir, { recursive: true });
    const _date = encodeURIComponent(md5(new Date().toISOString()))
    const context = {
        "modified": _date
    }
    files.forEach((file) => {
        // get all files ending with .njk, but skip files starting with _
        // _ is used to denote partials
        const fileName = file.split("/").at(-1);
        if (fileName.endsWith(".njk") && !fileName.startsWith("_")) {
            try {
                const input = fs.readFileSync(`${inputDir}/${file}`, {"encoding": "utf8"});
                // const output = nunjucks.renderString(input);
                const output = env.renderString(input, context);
                const outputFilepath = `${outputDir}/${file.replace(".njk", ".html")}`;
                const outputFilepathDir = outputFilepath.split("/").slice(0, -1).join("/");
                if (!fs.existsSync(outputFilepathDir)) {
                    fs.mkdirSync(outputFilepathDir, { recursive: true });
                }

                fs.writeFileSync(outputFilepath, output);
                console.log(`${inputDir}/${file} has been compiled to ${outputFilepath}`);
            } catch (error) {
                console.error(`Error in ${file}:`, error);
                throw error;
            }
        }
    });
};

const copyAssets = (srcDir, distDir) => {
    // Copy assets from src to dist, if srcDir exists
    if (fs.existsSync(srcDir)) {
        fs.cpSync(srcDir, distDir, {recursive: true});
        console.log(`${srcDir} has been copied to ${distDir}`);
    } else {
        console.log(`${srcDir} does not exist. Skipping.`);
    }


};

const build = () => {
    const srcDir = "src";
    const distDir = "dist";

    // Clean up dist directory
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true });
    }
    // Recreate dist directory
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }

    // Copy assets to dist
    console.log('\x1b[36m%s\x1b[0m', "\n---> Copy assets to dist");
    copyAssets(`${srcDir}/assets/media`, `${distDir}/media`);
    copyAssets(`${srcDir}/assets/fonts`, `${distDir}/fonts`);
    copyAssets(`${srcDir}/assets/js`, `${distDir}/js`);

    // Compile nunjucks to html, and overwrite html files in dist
    console.log('\x1b[36m%s\x1b[0m', "\n---> Compile nunjucks to html");
    compileNunjucks(`${srcDir}/nunjucks`, distDir);

    // Compile scss to css, and overwrite css files in dist
    const inputFile = `${srcDir}/assets/scss/style.scss`;
    const outputFile = `${distDir}/css/style.css`;
    if (!fs.existsSync(`${distDir}/css/`)) {
        fs.mkdirSync(`${distDir}/css/`);
    }
    console.log('\x1b[36m%s\x1b[0m', "\n---> Compile SCSS");
    scssCompilation(inputFile, outputFile);

    console.log('\x1b[32m%s\x1b[0m', '\n---Build completed---\n');
};

// Only run if called directly
if (typeof require !== "undefined" && require.main === module) {
    build();
}

module.exports = {
    scssCompilation,
    build,
};
