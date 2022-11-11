//config for webpack + babel preprocess

const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const DIST_DIR = path.resolve(__dirname, "static", "front");
const SRC_DIR = path.resolve(__dirname, "src");
const FONTSOURCE_DIR = path.resolve(__dirname, "node_modules", "@fontsource");

const PACKAGE = require("./package.json");
const version = PACKAGE.version;

module.exports = {
    entry: SRC_DIR + "/app/index.js",
    output: {
        path: DIST_DIR,
        filename: "[name]-bundle-[contenthash].js",
        chunkFilename: "[name]-chunk-[chunkhash].js",
        publicPath: "/static/front/"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: SRC_DIR,
                exclude: /node_modules/,
                use: { //more loaders can be added here in an array
                    loader: 'babel-loader',
                    options: {
                        presets:  [["@babel/preset-react", {"runtime": "automatic"}]],
                        plugins: ["@emotion"]
                    }
                }
            },
            {
                test: /\.css$/,
                include: [SRC_DIR, FONTSOURCE_DIR],
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(svg|png|webp)?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 16 * 1024 // inline images smaller than 16KiB
                    }
                }
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: DIST_DIR + "/report.html"
        }),
        new HtmlWebpackPlugin({
            filename: './index.html', //relative to root of the application
            favicon: "./src/favicon.png",
            hash: false,
            templateContent: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                    <title>TMEIT</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                </head>
                <body>
                  <div id="root"></div>
                </body>
              </html>
            `

        })
    ],
    optimization: {
//        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxSize: 50000, // Split chunks less than 50KB
            cacheGroups: {
                vendor: { // Label chunks with package name https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
                    test: /[/]node_modules[/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[/]node_modules[/](.*?)([/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                        },
                },
            },
        },
    },
};
