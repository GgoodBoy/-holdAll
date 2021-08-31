'use strict'
module.exports = {
  NODE_ENV: '"production"',
  argv:process.argv[2]=='beta'?'"beta"':'"prod"',
  page:[
    {name:'channel1',des:'app端',channelId:1,src:'https://hm.baidu.com/hm.js?c9718290cd2aa22eca96ca03dd5a438c'},
    {name:'channel2',des:'M站',channelId:2,src:'https://hm.baidu.com/hm.js?ccefbefd049be1385e39e35f2733bcc4'},
    {name:'channel3',des:'微信公众号',channelId:3,src:'https://hm.baidu.com/hm.js?5df009c12393aaa309854e4989c326bb'},
    {name:'channel4',des:'微信群、朋友圈',channelId:4,src:'https://hm.baidu.com/hm.js?aba0dac094b8578deb7e8dc0c4bc73d1'},
    {name:'channel5',des:'杜老师',channelId:5,src:'https://hm.baidu.com/hm.js?200563f10d0e5805f51afa4e4162c483'},
    {name:'channel6',des:'端外1',channelId:6,src:'https://hm.baidu.com/hm.js?ff364f11c0ba4c08c1d6e7e8c8d64628'},
    {name:'channel7',des:'端外2',channelId:7,src:'https://hm.baidu.com/hm.js?728dad70c633198e385ccd8f45b31f63'},
    {name:'channel8',des:'端外3',channelId:8,src:'https://hm.baidu.com/hm.js?4ccceff6e84639c0134b931fa9020176'},
  ]
}
