module.exports =  {
  env: {},
  head: {
    title: '学国学网 | 专注优秀传统文化教育与传播',
    meta: [
      { charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
			{ hid: 'keywords', name: 'keywords', content: '学国学网,学国学,国文素养,国学经典,国学堂,国学教育培训,在线教育,K12,传统文化,弟子规,故事会,百家讲坛,汉语思维,话说汉字,识字,名著导读,文艺修养,易经,文房四宝,国家艺术,民俗,朗读,书法,下棋。' },
			{ hid: 'description', name: 'description', content: '学国学网专注于优秀传统文化教育与传播，是目前唯一一家同时覆盖“学前、中小学生、成 年爱好者”的系统化、专业化国学在线教育平台。依托北京师范大学传统文化研究中心和华夏明德传统文化研究院，携手数百位国学大师、专家教授、一线名师，凝智聚力，充分汲取优秀传统文化之精髓，精心打磨国学精品课程，以用户体验为导向，注入前沿科技力量，让传统文化知识的传播和获得变得更加系统、专业高效、有趣。' },
      // { name:'referrer',content:'no-referrer'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      { rel:'stylesheet',href:'//g.alicdn.com/de/prismplayer/2.7.2/skins/default/aliplayer-min.css'}
    ],
    script: [
      {src: '//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'},
      {src: '//g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js' },
      {src:'//webchat.7moor.com/javascripts/7moorInit.js?accessId=aa38ac60-7b15-11e7-9a22-a76501091e5f&autoShow=false&language=ZHCN',async:'async'}
    ],
  },
  loading: { color: "#fff" },
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'assets/styles/main.scss'
  ],
  plugins: [
    {src:'@/plugins/element-ui',ssr:false},
    {src:'~/plugins/axios'},
    {src:'~/plugins/vue-global'},
    {src:'~/plugins/browser',ssr:false},
    {src:'~/plugins/route', ssr: false },
    {src:'~/plugins/babel-polyfill', ssr: true },
    {src:'~/plugins/baidu.js', ssr: false },
    {src:'~/plugins/move.js', ssr: false }
  ],
  build: {
    optimization: { 
      splitChunks: {        
        chunks: 'all',
        automaticNameDelimiter: '.',
        maxAsyncRequests: 7,       
        cacheGroups: {          
          vuetify: {           
              test: /node_modules[\\/]vuetify/,            
              chunks: 'all',            
              priority: 20,            
              name: true          
            },          
            elementui: {            
                test: /node_modules[\\/]element-ui/,           
                chunks: 'all',           
                priority: 20,            
                name: true          
            }       
        }      
    }
  }
  },
  buildModules: ['@nuxt/typescript-build'],
  modules: [
    "@nuxtjs/axios",
  ],
  axios: {},
  router:{
    middleware: ['auth'],
  }
}
