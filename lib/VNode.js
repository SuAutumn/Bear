import Component from "@/lib/Component";
function toSingleArray (array) {
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
class VNode {
  constructor(tagName, props, ...children) {
    if (tagName.prototype instanceof Component) {
      return (new tagName(props)).createVNode(props)
    }
    if (typeof tagName === 'function') {
      return tagName(props)
    }
    this.tagName = tagName
    this.props = props || {}
    this.children = toSingleArray(children || [])
    this.el = null
  }

  render() {
    let ele = document.createElement(this.tagName)
    for (let propName in this.props) {
      ele[propName] = this.props[propName]
      // ele.setAttribute(propName, this.props[propName])
    }

    function appendChildren(children) {
      children.forEach(child => {
        if (child instanceof VNode) {
          ele.appendChild(child.render())
        } else if (child instanceof Array) {
          appendChildren(child)
        } else {
          ele.appendChild(document.createTextNode(child || ''))
        }
      })
    }
    appendChildren(this.children)
    this.el = ele
    return ele
  }
}

export default function h(tagName, props, ...children) {
  return new VNode(tagName, props, ...children)
}