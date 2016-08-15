var fs = require('fs'),
  zlib = require('zlib'),
  rollup = require('rollup').rollup,
  uglify = require('rollup-plugin-uglify')

function _complie(dest, options, bundleOptions, needGzip) {
  return rollup(options)
    .then(bundle => {
      var rs = bundle.generate(bundleOptions),
        code = rs.code,
        promises = []

      if (bundleOptions.sourceMap) {
        code = code + '\n//# sourceMappingURL=' + dest.replace(/(.*\/)|(.*\\)/g, '') + '.map'
        promises.push(write(dest + '.map', JSON.stringify(rs.map), writeLog))
      }
      promises.push(write(dest, code, writeLog))
      if (needGzip)
        promises.push(gzip(dest + '.gz', code, writeLog))
      return Promise.all(promises)
    })
}

module.exports = function complie(options) {
  var bundle = options.bundle,
    dest = bundle.dest,
    promises = []

  console.log(`complie ${options.rollup.entry} -> ${dest}`)

  promises.push(_complie(dest, options.rollup, bundle, false))
  if (bundle.mini)
    promises.push(_complie(dest.replace(/\.js$/, '.min.js'), Object.assign({}, options.rollup, {
      plugins: options.rollup.plugins.concat([uglify()])
    }), bundle, bundle.gzip))

  return Promise.all(promises)
    .catch(function(e) {
      console.error(`complie ${options.rollup.entry} -> ${dest} Error`, e)
    })
}

function gzip(dest, buff, callback) {
  return new Promise((resolve, reject) => {
    zlib.gzip(buff, (err, content) => {
      if (err) return reject(err)
      fs.writeFile(dest, content, (err) => {
        if (err) return reject(err)
        callback(dest, content)
        resolve(dest)
      })
    })
  })
}

function write(dest, buf, callback) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, buf, (err) => {
      if (err) return reject(err)
      callback(dest, buf)
      resolve(dest)
    })
  })
}

function writeLog(dest, buf) {
  console.log('complie and write: ' + dest + ' (' + size(buf) + ')')
}

function size(buf) {
  return (buf.length / 1024).toFixed(2) + 'kb'
}
