'use strict'
module.exports = {
  NODE_ENV: '"production"',
  argv: process.argv[2] == 'beta' ? '"beta"' : '"prod"',
  // 1. 2.M站 3.微信公众号 4.微信朋友圈 5.其他
  page:[
    {name:'channel1',des:'APP端内',channelId:1,src:'https://hm.baidu.com/hm.js?7f213a4b84d9efab249c48c8d90bff40'},
    {name:'channel2',des:'M站',channelId:2,src:'https://hm.baidu.com/hm.js?0a0e9b520f3f51340780699d96ede45d'},
    {name:'channel3',des:'微信公众号',channelId:3,src:'https://hm.baidu.com/hm.js?64fe7af36b59c6c524d3422c0add37d5'},
    {name:'channel4',des:'微信朋友圈',channelId:4,src:'https://hm.baidu.com/hm.js?afab49535b5d35953190703c4b171f97'},
    {name:'channel5',des:'其他',channelId:5,src:'https://hm.baidu.com/hm.js?e6f34a32373591e3f984a40eadd8d432'}
  ]
}
