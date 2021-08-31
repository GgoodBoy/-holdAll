let plugins = [];
  /**
   * 接着你可以在代码中直接引入 Vant 组件
   *  插件会自动将代码转化为方式二中的按需引入形式
   * import { Button } from 'vant';
   * 
   * export default {
   *      name: 'Home',
   *      components: {
   *          Button,
   *          HelloWorld
   *      }
   * }
   */
  plugins.push(
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  )
module.exports = {
  plugins,
  presets: [
    '@vue/cli-plugin-babel/preset',
    ["@babel/preset-env", {
      "modules": false,
      // 通过设置target预设插件对语法进行处理
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      },
      "useBuiltIns": "usage",
      "corejs": 3
    }
    ]
  ]
}
