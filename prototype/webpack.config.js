const { CheckerPlugin } = require('awesome-typescript-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const { optimize } = require('webpack');
const { join } = require('path');
let prodPlugins = [];

if (process.env.WEBPACK_MODE === 'production') {
    prodPlugins.push(
        new optimize.AggressiveMergingPlugin(),
        new optimize.OccurrenceOrderPlugin()
    );
}

module.exports = {
    mode: process.env.WEBPACK_MODE,
    devtool: 'inline-source-map',
    entry: {
        contentscript: join(__dirname, 'src/contentscript/contentscript.ts'),
        background: join(__dirname, 'src/background/background.ts'),
        popup: join(__dirname, 'src/popup/popup.ts'),
    },
    output: {
        path: join(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.ts?$/,
                use: 'awesome-typescript-loader?{configFileName: "tsconfig.json"}',
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            }
        ],
    },
    plugins: [
        new CheckerPlugin(),
        ...prodPlugins,
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new CopyPlugin([
            { from: 'src/assets', to: 'assets/[path][name].[ext]' },
            { from: 'manifest.json', to: 'manifest.json' },
            { from: 'src/popup/popup.html', to: 'popup.html' },
        ]),
        new RemovePlugin({
            before: {
                include: [
                    'dist'
                ]
            }
        })
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    }
};