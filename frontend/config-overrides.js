const { override, addBabelPlugins } = require('customize-cra');

module.exports = override(
  // Babel 플러그인을 추가하여 console.log를 제거합니다.
  ...addBabelPlugins("babel-plugin-transform-remove-console")
);
