const express = require('express'),
  rollup = require('express-middleware-rollup'),
  path = require('path'),
  pkg = require('../package.json')

function devServer(option) {
  let app = express()

  app.use(express.static(path.join(__dirname, '../')))
  app.listen(3000)
  return app
}
