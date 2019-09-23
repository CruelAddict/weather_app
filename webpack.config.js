const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

let conf = {
    entry: [
        './src/index.js',
        './src/styles/main.scss'
    ] ,
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'main.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.pug',
            inject: 'body'
        }),

        new MiniCssExtractPlugin({
            filename: "styles/style.css",
            chunkFilename: "styles/[name].css"
        }),
        new webpack.ProvidePlugin({
            "$":"jquery",
            "jQuery":"jquery",
            "window.jQuery":"jquery"
        })
    ],
    devServer: {
        overlay: true
    },
    module: {
        rules : [
            {
                test: /\.pug$/,
                use: ['pug-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            }
        ]
    },
    resolve : {
        alias: {
            // bind version of jquery-ui
            "jquery-ui": "jquery-ui/jquery-ui.js",
            // bind to modules;
            modules: path.join(__dirname, "node_modules")
        }
    }
};

module.exports = conf;
