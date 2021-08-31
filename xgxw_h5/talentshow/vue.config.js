const path = require('path')
let resolve=(dir)=>{
    return path.join(__dirname, dir)
}
module.exports = {
    //打包配置，解决页面空白的配置方案。
    publicPath: './',
    // 输出文件目录
    outputDir: 'talentshow',
    productionSourceMap: false,
    lintOnSave: false,//关闭ESlint
    chainWebpack: config => {
        config.entry.app = ['@babel/polyfill', './src/main.js'];
        /**
         * 添加别名
         * 使用vue-cli开发项目，最大特色是组件化。组件中频繁引用其他组件或插件。
         * 我们可以把一些常用的路径定义成简短的名字。方便开发中使用。
        */
        config.resolve.alias
        .set('@',resolve('./src'))
        .set('components',resolve('./src/components'))
        .set('assets',resolve('./src/assets'))
        .set('utils',resolve('./src/utils'))
        .set('views', resolve('./src/views'))   
        
    },
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: 8888, //8080,
        https: false,
        hotOnly: false,
        before: app => {},
    }
  }