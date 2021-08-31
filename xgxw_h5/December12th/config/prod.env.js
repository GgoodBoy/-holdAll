'use strict'
module.exports = {
  NODE_ENV: '"production"',
  argv:process.argv[2]=='beta'?'"beta"':'"prod"',
  page:[
    {name:'channel1',des:'APP主页',channelId:1,src:'https://hm.baidu.com/hm.js?a59ca0a9f9ae1de31f75ee3491effa8a'},
    {name:'channel2',des:'测一测二维码',channelId:2,src:'https://hm.baidu.com/hm.js?a44f3b67f4b5a734b3166d0fde19a8a7'},
    {name:'channel3',des:'摇一摇二维码',channelId:3,src:'https://hm.baidu.com/hm.js?8ba9211583119cce24c9f760f9026b59'},
    {name:'channel4',des:'M站',channelId:4,src:'https://hm.baidu.com/hm.js?a4908497120b46c93d414a747ff08e4e'},
    {name:'channel5',des:'微信群',channelId:5,src:'https://hm.baidu.com/hm.js?b953a8d73dbb50ba7d7040e838dba99f'},
    {name:'channel6',des:'微信公众号',channelId:6,src:'https://hm.baidu.com/hm.js?9c1ec84e25754723607fcc43285175c4'},
    {name:'channel7',des:'端外1',channelId:7,src:'https://hm.baidu.com/hm.js?37f624f48c1cb40464086e97d661f7cf'},
    {name:'channel8',des:'端外2',channelId:8,src:'https://hm.baidu.com/hm.js?dad97fee435d14a4b8d308c507bc3888'},
    {name:'channel9',des:'端外3',channelId:9,src:'https://hm.baidu.com/hm.js?afa12727497556fa2b0feb294ea42478'},
    {name:'channel10',des:'端外4',channelId:10,src:'https://hm.baidu.com/hm.js?69569533b6d273a535cc9d1905724962'},
    {name:'test',des:'测一测页面'},
    {name:'shake',des:'摇一摇页面'},
  ]
}
