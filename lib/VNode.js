import Component from "@/lib/Component";

class VNode {
  constructor (tagName, props, ...children) {
    if (tagName.prototype instanceof Component) {
      let r = (new tagName(props)).createVNode(props)
      console.log(r)
      return r
    }
    if (typeof tagName === 'function') {
      return tagName(props)
    }
    this.tagName = tagName
    this.props = props || {}
    this.children = children || []
    this.el = null
  }
  render () {
    let ele = document.createElement(this.tagName)
    for (let propName in this.props) {
      ele[propName] = this.props[propName]
      // ele.setAttribute(propName, this.props[propName])
    }
    this.children.forEach(child => {
      let childEle = child instanceof VNode ? child.render() : document.createTextNode(child || '')
      ele.appendChild(childEle)
    })
    this.el = ele
    return ele
  }
}

export default function h(tagName, props, ...children) {
  return new VNode(tagName, props, ...children)
}
