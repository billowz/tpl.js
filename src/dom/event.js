const _ = require('../util'),
  dom = require('./core'),
  {Map} = _,
  {W3C} = dom,
  root = document.documentElement;


_.assign(dom, {
  on(el, type, cb) {
    if (!typeof cb == 'function')
      throw TypeError('Invalid Event Handler');
    if (!type)
      throw TypeError('Invalid Event Type');
    if (initEventListener(el, type, cb)) {
      if (canBubbleUp[type]) {
        console.log('bind delegate:', type, '/', eventFixType(type))
        delegateEvent(type);
      } else {
        console.log('bind:', type, '/', eventFixType(type))
        bind(el, eventFixType(type), dispatch, !!focusBlur[type]);
      }
    }
    return cb;
  },
  off(el, type, cb) {
    if (!typeof cb == 'function')
      throw TypeError('Invalid Event Handler');
    if (!type)
      throw TypeError('Invalid Event Type');
    let handlers = getEventListener(el, type);
    if (handlers && handlers.length) {
      for (let i = 0, l = handlers.length; i < l; i++) {
        if (handlers[i] == cb) {
          handlers.split(i, 1);
          if (canBubbleUp[type]) {
            undelegateEvent(type);
          } else if (!handlers.length) {
            unbind(el, eventFixType(type), dispatch);
          }
          if (!handlers.length)
            cleanEventListener(el, type);
          return;
        }
      }
    }
  },
  dispatchEvent(el, type, opts) {
    let hackEvent;
    if (document.createEvent) {
      hackEvent = document.createEvent('Events');
      hackEvent.initEvent(type, true, true, opts);
      _.assign(hackEvent, opts);
      el.dispatchEvent(hackEvent);
    } else if (dom.inDoc(el)) { //IE6-8触发事件必须保证在DOM树中,否则报'SCRIPT16389: 未指明的错误'
      hackEvent = document.createEventObject();
      _.assign(hackEvent, opts);
      el.fireEvent('on' + type, hackEvent);
    }
    return hackEvent;
  }
});

module.exports = dom;

const rmouseEvent = /^(?:mouse|contextmenu|drag)|click/,
  rvendor = /^(?:ms|webkit|moz)/
class Event {
  constructor(event) {
    for (let i in event) {
      if (!rvendor.test(i) && typeof event[i] !== 'function')
        this[i] = event[i];
    }
    this.target = event.srcElement;

    if (event.type.indexOf('key') === 0) {
      this.which = event.charCode != null ? event.charCode : event.keyCode;
    } else if (rmouseEvent.test(event.type) && !('pageX' in this)) {
      let doc = this.target.ownerDocument || document,
        box = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;
      this.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0);
      this.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0);
      this.wheelDeltaY = this.wheelDelta;
      this.wheelDeltaX = 0;
    }
    this.timeStamp = new Date() - 0;
    this.originalEvent = event;
  }
  preventDefault() {
    let e = this.originalEvent;
    this.returnValue = false;
    if (e) {
      e.returnValue = false;
      if (e.preventDefault)
        e.preventDefault();
    }
  }
  stopPropagation() {
    let e = this.originalEvent
    this.cancelBubble = true;
    if (e) {
      e.cancelBubble = true;
      if (e.stopPropagation)
        e.stopPropagation();
    }
  }
  stopImmediatePropagation() {
    let e = this.originalEvent;
    this.isImmediatePropagationStopped = true;
    if (e.stopImmediatePropagation)
      e.stopImmediatePropagation();
    this.stopPropagation();
  }
}

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
  canBubbleUp = {
    click: true,
    dblclick: true,
    keydown: true,
    keypress: true,
    keyup: true,
    mousedown: true,
    mousemove: true,
    mouseup: true,
    mouseover: true,
    mouseout: true,
    wheel: true,
    mousewheel: true,
    input: true,
    change: true,
    beforeinput: true,
    compositionstart: true,
    compositionupdate: true,
    compositionend: true,
    select: true,
    cut: true,
    copy: true,
    paste: true,
    beforecut: true,
    beforecopy: true,
    beforepaste: true,
    focusin: true,
    focusout: true,
    DOMFocusIn: true,
    DOMFocusOut: true,
    DOMActivate: true,
    dragend: true,
    datasetchanged: true
  },
  focusBlur = {
    focus: true,
    blur: true
  },
  eventHooks = {},
  eventHookTypes = {},
  last = +new Date(),
  eventListeners = new Map(),
  delegateEvents = {};
if (!W3C) {
  delete canBubbleUp.change
  delete canBubbleUp.select
}
function eventFixType(type) {
  let hook = eventHooks[type];
  return hook ? hook.type || type : type;
}
function delegateEvent(type) {
  if (!delegateEvents[type]) {
    bind(root, eventFixType(type), dispatch, !!focusBlur[type]);
    delegateEvents[type] = 1;
  } else {
    delegateEvents[type]++;
  }
}
function undelegateEvent(type) {
  if (delegateEvents[type]) {
    delegateEvents[type]--;
    if (!delegateEvents[type])
      unbind(root, eventFixType(type), dispatch);
  }
}

function initEventListener(el, type, cb) {
  let listens = eventListeners.get(el),
    handlers;
  if (!listens) {
    listens = {
      typeNR: 0,
      handlers: {}
    };
    eventListeners.set(el, listens);
  }
  if (!(handlers = listens.handlers[type])) {
    handlers = listens.handlers[type] = [cb];
    listens.typeNR++;
    return true;
  }
  handlers.push(cb);
  return false;
}

function getEventListener(el, type) {
  let listens = eventListeners.get(el),
    handlers;
  if (listens)
    return listens.handlers[type];
  return undefined;
}

function cleanEventListener(el, type) {
  let listens = eventListeners.get(el),
    handlers;
  if (listens) {
    delete listens.handlers[type];
    listens.typeNR--;
    if (!listens.typeNR)
      eventListeners['delete'](el);
  }
}

function dispatchElement(el, event, isMove) {
  let handlers = getEventListener(el, event.type);
  if (handlers && handlers.length) {
    event.currentTarget = el;
    let handler, i, l;
    for (i = 0, l = handlers.length; i < l && !event.isImmediatePropagationStopped; i++) {
      handler = handlers[i];
      if (isMove) {
        let now = new Date();
        if (now - last > 16) {
          handler.call(el, event);
          last = now;
        }
      } else
        handler.call(el, event);
    }
  }
}

function dispatch(event) {
  event = new Event(event);
  let type,
    el = event.target;

  if( (type = eventHookTypes[event.type]) ) {
    event.type = type;
    let hook = eventHooks[type];
    if (hook && hook.fix && hook.fix(el, event) === false)
      return;
  } else {
    type = event.type;
  }

  if (el.disabled !== true || type !== 'click') {
    let isMove = /move|scroll/.test(type);
    if (canBubbleUp[type]) {
      while (el && el.getAttribute && !event.cancelBubble) {
        dispatchElement(el, event, isMove);
        el = el.parentNode;
      }
    } else
      dispatchElement(el, event, isMove);
    console.log(event.type, event)
  }
}

//针对firefox, chrome修正mouseenter, mouseleave
if (!('onmouseenter' in root)) {
  _.eachObj({
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  }, function(origType, fixType) {
    eventHooks[origType] = {
      type: fixType,
      fix: function(elem, event, fn) {
        let t = event.relatedTarget;
        return !t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))
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
    fix: function(elem, event) {
      console.log(event.propertyName)
      return event.propertyName === 'value';
    }
  }
}
if (document.onmousewheel === void 0) {
  /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
   firefox DOMMouseScroll detail 下3 上-3
   firefox wheel detlaY 下3 上-3
   IE9-11 wheel deltaY 下40 上-40
   chrome wheel deltaY 下100 上-100 */
  let fixWheelType = document.onwheel ? 'wheel' : 'DOMMouseScroll',
    fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail';
  eventHooks.mousewheel = {
    type: fixWheelType,
    fix: function(elem, event) {
      event.wheelDeltaY = event.wheelDelta = event[fixWheelDelta] > 0 ? -120 : 120;
      event.wheelDeltaX = 0;
      return true;
    }
  }
}
_.eachObj(eventHooks, function(hook, name) {
  if (hook.type)
    eventHookTypes[hook.type] = name;
})
