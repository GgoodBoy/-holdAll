'use strict'
module.exports = {
  NODE_ENV: '"production"',
  argv:process.argv[2]=='beta'?'"beta"':'"prod"'
}
