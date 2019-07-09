import diff, {updateEle} from "./patch";

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
