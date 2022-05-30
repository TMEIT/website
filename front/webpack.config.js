//config for webpack + babel preprocess

const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin')

const DIST_DIR = path.resolve(__dirname, "www");
const SRC_DIR = path.resolve(__dirname, "src");

const PACKAGE = require('./package.json');
const version = PACKAGE.version;

module.exports = {
    entry: SRC_DIR + "/app/index.js",
    output: {
        path: DIST_DIR,
        filename: "bundle-" + version + ".js",
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
                        presets: ['@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                include: SRC_DIR,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html', //relative to root of the application
            favicon: "./src/favicon.png",
            hash: true,
            templateContent: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                    <title>TMEIT</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86">
                </head>
                <body>
                  <div id="root"></div>
                </body>
              </html>
            `

        })
    ],
    devServer: {
        contentBase: './www',
        historyApiFallback: {
            disableDotRule: true
        },
        proxy: {
            '/api': 'http://127.0.0.1:5000'
        }
    }
};
