let dom = require('./event'),
  readyList = [], isReady,
  root = document.documentElement;

function fireReady(fn) {
  isReady = true
  while (fn = readyList.shift()) {
    fn();
  }
}

function doScrollCheck() {
  try {
    root.doScroll('left')
    fireReady()
  } catch (e) {
    setTimeout(doScrollCheck)
  }
}

if (document.readyState === 'complete') {
  setTimeout(fireReady);
} else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireReady)
} else if (document.attachEvent) {
  document.attachEvent('onreadystatechange', function() {
    if (document.readyState === 'complete')
      fireReady();
  })
  try {
    var isTop = window.frameElement === null
  } catch (e) {}
  if (root.doScroll && isTop && window.external)
    doScrollCheck()
}

if (window.document)
  dom.on(window, 'load', fireReady);

dom.ready = function(fn) {
  if (!isReady) {
    readyList.push(fn)
  } else {
    fn(avalon)
  }
}
