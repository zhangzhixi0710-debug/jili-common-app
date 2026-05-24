module.exports = {
  presets: [
    [
      "@vue/app",
      {
        useBuiltIns: "entry",
      },
    ],
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true, // 自动引入样式
      },
      "vant",
    ],
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
    "@babel/plugin-proposal-optional-chaining",
  ],
};
