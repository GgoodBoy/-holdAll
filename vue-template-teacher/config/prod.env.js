'use strict'
module.exports = {
  NODE_ENV: '"production"',
  // BASE_API:'"https://sccms.youfushuyuan.com"' //仿生环境 
  // BASE_API: '"http://sccms.youfushuyuan.com"', //仿生环境
  // BASE_API:'"http://xgxcms.youfushuyuan.com"'
  
  // BASE_API: process.argv[2] == 'beta' ? '"http://172.16.120.6:8769"' : '"http://xgxcms.xueguoxue.com"',
  BASE_API: process.argv[2] == 'beta' ? '"https://sccms.youfushuyuan.com"' : '"https://xgxcms.xueguoxue.com"',
  argv: process.argv[2] == 'beta'?'"beta"':'"prod"'
}