const path = require('path')
module.exports = {

    /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
    productionSourceMap: false,
    /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
    assetsDir: "assets",    
    /**
     * cnpm install amfe-flexible postcss-px2rem -S
     * 入口文件main.js里引入amfe-flexible
     * import "amfe-flexible";
     *  */
    chainWebpack: config => {
        /**
         * 添加别名
         * 使用vue-cli开发项目，最大特色是组件化。组件中频繁引用其他组件或插件。
         * 我们可以把一些常用的路径定义成简短的名字。方便开发中使用。
        */
        config.resolve.alias
        .set('@',resolve('./src'))
        .set('components',resolve('./src/components'))
        .set('assets',resolve('./src/assets'))
        .set('views',resolve('./src/views'))       
    },  
    configureWebpack: config => { 
        const plugins = [];
        if (isProduction) { 
            plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false, // 去掉注释
                        },
                        warnings: false,
                        compress: {
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log']//移除console
                        }
                    }
                })
            )
        }        
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    // 设计稿宽度的1/10，一般为75
                    require('postcss-px2rem')({remUnit: 100}),
                ]
            }
        }
    },    
    devServer: {
		compress: true,
		disableHostCheck: true, //webpack4.0 开启热更新        
        open:false,  
        // 项目运行时候的端口号
        port: 4000, //自定义端口设置
        /**
         * 当我们的前端服务和后端服务不同源即协议不同，端口不同，域名不同时，就会出现跨域的问题。
         * 代理跨域 
         *  */
        // proxy: {
        //     // 只有碰到/api的才会执行代理
        //     '/api': {
        //         target: 'https://www.baidu.com/', // 要访问的跨域的域名
        //         // 是否启用websockets
        //         ws: true, 
        //         // 如果是https接口，需要配置这个参数
        //         secure: true,
        //         // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样客户端端和服务端进行数据的交互就不会有跨域问题
        //         changeOrigin: true,
        //         /**
        //          * pathRewrite属性的用处，替换：
        //          * 如果我们要请求：http://common.dm.com/api/loginPost
        //          * 但实际请求是：http://localhost:3000/loginPost
        //          */
        //         pathRewrite: {
        //             '^/api': '/'
        //         }
        //     }
        // }      
    }   
}