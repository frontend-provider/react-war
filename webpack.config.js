// const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
  const dev = argv.mode === 'development'
  process.env.NODE_ENV = argv.mode
  const config = {
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
    },
    ...(dev ? { devtool: 'eval-cheap-module-source-map' } : {}),
    devServer: {
      port: 8080,
      open: true,
    },
    resolve: {
      extensions: [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.scss',
        '.sass',
        '.css',
        '.json',
      ],
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
          },
        },
        {
          test: /\.(s?c|sa)ss$/i,
          use: [
            'style-loader',
            'css-modules-typescript-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
                postcssOptions: {
                  plugins: [
                    'postcss-import',
                    'tailwindcss',
                    ...(dev ? [] : ['autoprefixer', 'cssnano']),
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
              },
            },
          ],
        },
        // {
        //   test: /\.svg$/,
        //   use: ['@svgr/webpack'],
        // },
        {
          test: /\.(png|jpe?g|gif|ico)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './index.html',
      }),
    ],
  }

  return config
}
