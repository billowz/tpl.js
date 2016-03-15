export function remove(el, coll) {
  if (el instanceof Array) {
    for (let i = 0, l = el.length; i < l; i++)
      remove(el);
    return;
  }
  if (el.parentNode) {
    el.parentNode.removeChild(el)
  } else if (coll instanceof Array) {
    for (let i = coll.length - 1; i >= 0; i--) {
      if (coll[i] === el)
        coll.splice(i, 1);
    }
  }
}
export function before(el, target) {
  target.parentNode.insertBefore(el, target)
}
export function after(el, target) {
  if (target.nextSibling) {
    before(el, target.nextSibling)
  } else {
    target.parentNode.appendChild(el)
  }
}
export function append(el, target) {
  target.appendChild(el)
}
export function prepend(el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}
export function replace(target, el) {
  var parent = target.parentNode
  if (parent) {
    parent.replaceChild(el, target)
  }
}
export function on(el, event, cb, useCapture) {
  el.addEventListener(event, cb, useCapture)
}

export function off(el, event, cb) {
  el.removeEventListener(event, cb)
}

export function setClass(el, cls) {
  /* istanbul ignore if */
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls
  } else {
    el.setAttribute('class', cls)
  }
}
export function addClass(el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  } else {
    var cur = ' ' + (el.getAttribute('class') || '') + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim())
    }
  }
}
export function removeClass(el, cls) {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    var cur = ' ' + (el.getAttribute('class') || '') + ' '
    var tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    setClass(el, cur.trim())
  }
  if (!el.className) {
    el.removeAttribute('class')
  }
}
