import Component from "./Component";

function toSingleArray(array) {
  let r = []
  array.forEach(item => {
    if (item instanceof Array) {
      r = r.concat(toSingleArray(item))
    } else {
      r.push(item)
    }
  })
  return r
}

function objForEach(obj, fn) {
  if (!(obj instanceof Object)) {
    throw new TypeError(`can not iterator for ${obj}`)
  }
  for (let p in obj) {
    fn(p, obj[p], obj)
  }
}

class VNode {
  constructor(tagName, props, ...children) {
    this.tagName = tagName
    this.props = props || {}
    this.children = toSingleArray(children || [])
    this.el = null
  }

  render() {
    let ele = document.createElement(this.tagName)
    objForEach(this.props, (key, val, props) => {
      if (key.slice(0, 2) === 'on') {
        ele.addEventListener(key.slice(2).toLowerCase(), val)
      } else {
        ele.setAttribute(key, val)
      }
    })

    function appendChildren(children) {
      children.forEach(child => {
        if (!val) {
          ele.removeAttribute(key)
        } else if (key.slice(0, 2) === 'on') {
          ele.addEventListener(key.slice(2).toLowerCase(), val)
        } else {
          // ele.setAttribute(key, val)
          // in chrome, the className render delay
          // but assign value css directly render
          key === 'className' ? (ele[key] = val) : ele.setAttribute(key, val)
        }
      })
    }

    appendChildren(this.children)
    this.el = ele
    return ele
  }
}

export default function h(tagName, props, ...children) {
  if (tagName.prototype instanceof Component) {
    return (new tagName(props)).createVNode(props)
  }
  if (typeof tagName === 'function') {
    return tagName(props)
  }
  return new VNode(tagName, props, ...children)
}
