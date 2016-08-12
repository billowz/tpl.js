const express = require('express'),
  rollup = require('express-middleware-rollup'),
  path = require('path'),
  pkg = require('../package.json')

const app = express();

app.use(rollup({
  src: './src',
  dest: './dist',
  bundleExtension: '.js',
  root: path.join(__dirname, '../'),
  rollupOpts: {
    entry: 'index.js'
  },
  bundleOpts: {
    format: 'umd'
  },
  debug: true
}));
app.use(express.static(path.join(__dirname, '../')));
app.listen(3000);
