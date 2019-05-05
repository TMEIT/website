//config for webpack + babel preprocess

const path = require("path");

const DIST_DIR = path.resolve(__dirname, "www");
const SRC_DIR = path.resolve(__dirname, "src");

module.exports = {
    entry: SRC_DIR + "/app/index.js",
    output: {
        path: DIST_DIR + "/app",
        filename: "bundle.js",
        publicPath: "/app/"
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
    }
,
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
