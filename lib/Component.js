import diff, {updateEle} from "@/lib/patch";

class Bear {
  constructor(props) {
    this.state = {}
  }

  static h(ele, props, ...children) {
    if (typeof ele === 'function') {
      if (ele.prototype instanceof Bear) {
        return Bear.renderCom(ele, props)
      } else {
        return ele(props)
      }
    } else {
      return Bear.renderEle(ele, props, ...children)
    }

  }

  static renderCom(ele, props) {
    let com = new ele()
    // clone the props
    com.$props = Object.assign({}, props)
    com.$el = com.render(props, com.state)
    Promise.resolve().then(com.mounted.bind(com))
    return com.$el
  }

  static renderEle(ele, props, ...children) {
    let e = document.createElement(ele)
    for (let p in props) {
      let cache = props[p]
      Object.defineProperty(props, p, {
        get() {
          return p === 'style' ? css(cache) : cache
        },
        set(newVal) {
          cache = e[p] = newVal
        }
      })
      e[p] = props[p]
    }
    if (children && children.length) {
      function appendChild(children) {
        children.forEach(child => {
          if (!child) return
          if (typeof child === 'string') {
            child = document.createTextNode(child)
          }
          if (child instanceof Array) {
            appendChild(child)
          } else {
            e.appendChild(child)
          }
        })
      }

      appendChild(children)
    }
    return e
  }
  static render (newEle, oldEle) {
    if (!oldEle) {
      document.body.appendChild(newEle)
    } else {
      oldEle.parentNode.replaceChild(newEle, oldEle)
    }
  }

  /**
   * @abstract
   */
  mounted() {
  }

  setState(obj) {
    let el = this.render(this.$props, Object.assign(this.state, obj))
    // whatever replace the ele
    this.$el.parentNode.replaceChild(el, this.$el)
    this.$el = el
  }

  /**
   * @abstract
   * @param props
   * @param state
   */
  render(props, state) {
  }
}

export default class Component {
  constructor (props) {
    this.state = {}
    this.props = props
    this.VNode = null
  }
  createVNode () {
    this.VNode = this.render(this.props, this.state)
    Promise.resolve().then(() => {
      this.mounted()
    })
    return this.VNode
  }
  render (props, state) {
    // create VM Node
  }
  setState(obj) {
    let newVNode = this.render(this.props, Object.assign(this.state, obj))
    let patches = diff(newVNode, this.VNode)
    updateEle(this.VNode.el, patches)
    newVNode.el = this.VNode.el
    this.VNode = newVNode
  }
  mounted () {}
}
