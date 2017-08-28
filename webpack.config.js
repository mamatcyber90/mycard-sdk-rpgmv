module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'MyCard.js',
        path: __dirname + '/dist'
        // path: '/Users/zh99998/Documents/Games/Project1/js/plugins'
    },

    // Enable sourcemaps for debugging webpack's output.
    // devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.js', '.json']
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.ts?$/, loader: 'awesome-typescript-loader' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }

            // {
            //     test: /\.js$/,
            //     exclude: /node_modules\/(?!universalify|fs-extra)/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['env']
            //         }
            //     }
            // }
        ]

    },

    externals: {
        fs: 'StorageManager.isLocalMode() && require(\'fs\')',
        'nw.gui': 'StorageManager.isLocalMode() && require(\'nw.gui\')'
    }

};
