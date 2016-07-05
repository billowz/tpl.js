const _ = require('../util'),
  W3C = window.dispatchEvent,
  textContent = typeof document.createElement('div').textContent == 'string' ? 'textContent' : 'innerText';

let dom = {
  W3C: W3C,
  inDoc(el, root) {
    root = root || document.documentElement;
    if (root.contains)
      return root.contains(el);

    try {
      while ((el = el.parentNode)) {
        if (el === root)
          return true
        return false
      }
    } catch (e) {
      return false;
    }
  },
  query(selectors, all) {
    if (_.isString(selectors))
      return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
    return selectors;
  },
  cloneNode(el, deep) {
    if (el instanceof Array) {
      return _.map(el, (e) => {
        e.cloneNode(deep !== false);
      })
    } else
      return el.cloneNode(deep !== false);
  },
  remove(el) {
    if (el instanceof Array) {
      _.each(el, (e) => {
        e.parentNode.removeChild(e)
      })
    } else
      el.parentNode.removeChild(el);
  },
  before(el, target) {
    if (target instanceof Array)
      target = target[0];

    let parent = target.parentNode;

    if (el instanceof Array) {
      _.each(el, (e) => {
        parent.insertBefore(e, target)
      })
    } else
      parent.insertBefore(el, target);
  },
  after(el, target) {
    if (target instanceof Array)
      target = target[target.length - 1];

    let parent = target.parentNode;

    if (el instanceof Array) {
      _.each(el, (e) => {
        insertAfter(parent, e, target);
      })
    } else
      insertAfter(parent, el, target);
  },
  append(el, target) {
    if (target instanceof Array) {
      _.each(target, (t) => {
        el.appendChild(t);
      })
    } else
      el.appendChild(target);
  },
  prepend(el, target) {
    if (el.firstChild) {
      dom.before(target, el.firstChild)
    } else {
      dom.append(el, target)
    }
  },
  html(el, html) {
    if (arguments.length > 1)
      return (el.innerHTML = html);
    return el.innerHTML;
  },
  outerHtml(el) {
    if (el.outerHTML) {
      return el.outerHTML
    } else {
      var container = document.createElement('div')
      container.appendChild(el.cloneNode(true))
      return container.innerHTML
    }
  },
  text(el, text) {
    if (el.nodeType == 3) {
      if (arguments.length > 1)
        return (el.data = text);
      return el.data;
    } else {
      if (arguments.length > 1)
        return (el[textContent] = text);
      return el[textContent];
    }
  },
  focus(el) {
    el.focus();
  }
}
module.exports = dom;


//====================== Query =============================
if (!document.querySelectorAll) {
  document.querySelectorAll = function querySelectorAll(selector) {
    let doc = document,
      head = doc.documentElement.firstChild,
      styleTag = doc.createElement('STYLE');

    head.appendChild(styleTag);
    doc.__qsaels = [];
    if (styleTag.styleSheet) { // for IE
      styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsaels.push(this))}';
    } else { // others
      let textnode = document.createTextNode(selector + '{x:expression(document.__qsaels.push(this))}');
      styleTag.appendChild(textnode);
    }
    window.scrollBy(0, 0);
    return doc.__qsaels;
  }
}
if (!document.querySelector) {
  document.querySelector = function querySelector(selectors) {
    let elements = document.querySelectorAll(selectors);
    return elements.length ? elements[0] : null;
  }
}

function insertAfter(parentEl, el, target) {
  if (parentEl.lastChild == target)
    parentEl.appendChild(el);
  else
    parentEl.insertBefore(el, target.nextSibling);
}
