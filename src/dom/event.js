const _ = require('../util'),
  dom = require('./core'),
  {W3C} = dom;

_.assign(dom, {
  on(el, event, cb) {
    bind(el, event, cb);
  },
  off(el, event, cb) {
    unbind(el, event, cb);
  }
});


module.exports = dom;


let bind = W3C ? function(el, type, fn, capture) {
    el.addEventListener(type, fn, capture)
  } : function(el, type, fn) {
    el.attachEvent('on' + type, fn)
  },
  unbind = W3C ? function(el, type, fn) {
    el.removeEventListener(type, fn)
  } : function(el, type, fn) {
    el.detachEvent('on' + type, fn)
  },
  eventHooks = {};

//针对firefox, chrome修正mouseenter, mouseleave
if (!('onmouseenter' in root)) {
  _.eachObj({
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  }, function(origType, fixType) {
    eventHooks[origType] = {
      type: fixType,
      fix: function(elem, fn) {
        return function(e) {
          var t = e.relatedTarget
          if (!t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))) {
            delete e.type
            e.type = origType
            return fn.apply(elem, arguments)
          }
        }
      }
    }
  })
}
//针对IE9+, w3c修正animationend
_.eachObj({
  AnimationEvent: 'animationend',
  WebKitAnimationEvent: 'webkitAnimationEnd'
}, function(construct, fixType) {
  if (window[construct] && !eventHooks.animationend) {
    eventHooks.animationend = {
      type: fixType
    }
  }
});

//针对IE6-8修正input
if (!('oninput' in document.createElement('input'))) {
  eventHooks.input = {
    type: 'propertychange',
    fix: function(elem, fn) {
      return function(e) {
        if (e.propertyName === 'value') {
          e.type = 'input'
          return fn.apply(elem, arguments)
        }
      }
    }
  }
}
if (document.onmousewheel === void 0) {
  /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
   firefox DOMMouseScroll detail 下3 上-3
   firefox wheel detlaY 下3 上-3
   IE9-11 wheel deltaY 下40 上-40
   chrome wheel deltaY 下100 上-100 */
  var fixWheelType = document.onwheel !== void 0 ? 'wheel' : 'DOMMouseScroll'
  var fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail'
  eventHooks.mousewheel = {
    type: fixWheelType,
    fix: function(elem, fn) {
      return function(e) {
        e.wheelDeltaY = e.wheelDelta = e[fixWheelDelta] > 0 ? -120 : 120
        e.wheelDeltaX = 0
        if (Object.defineProperty) {
          Object.defineProperty(e, 'type', {
            value: 'mousewheel'
          })
        }
        return fn.apply(elem, arguments)
      }
    }
  }
}
