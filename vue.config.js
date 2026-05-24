const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  parallel: false,
  transpileDependencies: ["@dcloudio/uni-ui"],

  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("."),
      },
    },
  },

  css: {
    sourceMap: false,
    loaderOptions: {
      scss: {
        implementation: require("sass"),
      },
      sass: {
        implementation: require("sass"),
      },
    },
  },
};
