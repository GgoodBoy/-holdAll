'use strict'
module.exports = {
  NODE_ENV: '"production"',
  beta_API: '"https://scapi.youfushuyuan.com"',
  argv:process.argv[2]=='beta'?'"beta"':'"prod"',
  prod_API: '"https://xgxapi.xueguoxue.com"'
}
