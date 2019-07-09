import diff, {updateEle} from "./patch";
let rootVNode = null
let root = null
export default function render(vNode, replaceEle) {
  if (replaceEle) {
    updateEle(replaceEle, diff(vNode, rootVNode))
    rootVNode = vNode
  } else {
    root = vNode.render()
    rootVNode = vNode
    document.body.appendChild(root)
    return root
  }
}
