const path = require('path');
const glob = require('glob');

module.exports = {
  devServer: {
    open: false,
    static: false,
    client: {
      overlay: {
        warnings: false,
      },
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const workerEntries = glob.sync('./src/workers/**/*.{js,ts}').reduce((acc, file) => {
        const name = path.basename(file, path.extname(file));
        acc[`workers/${name}`] = `./${file}`;
        return acc;
      }, {});

      return {
        ...webpackConfig,
        devtool: env === 'production' ? false : 'cheap-module-source-map',
        mode: env,
        entry: {
          main: [paths.appIndexJs].filter(Boolean),
          content: './src/chromeServices/DOMEvaluator.ts',
          ...workerEntries,
        },
        output: {
          ...webpackConfig.output,
          filename: 'static/js/[name].js',
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
      };
    },
  },
};
