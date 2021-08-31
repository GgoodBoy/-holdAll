const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const path = require('path')
const app = express()
const requireAll = require('require-all')
const bodyParser = require('body-parser');
// Import and Set Nuxt.js options
let config = require('../nuxt.config.ts')
config.dev = process.env.ENVIRONMENT === 'development'?true:false
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('static',express.static(path.join(__dirname, '../static')));
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

const routes = requireAll({
  dirname: path.join(__dirname, './routes/'),
  filter: /(.+)\.route\.js$/,
})

for (const router of Object.values(routes)) {
  app.use('/', router)
}

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
