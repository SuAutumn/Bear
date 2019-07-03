import VNode from "@/lib/VNode";

function css(obj) {
  if (typeof obj === 'string') {
    return obj
  }
  let r = ''
  for (let i in obj) {
    r += `${i}:${obj[i]};`
  }
  return r
}

const REPLACE = '1'; // replace node
const ADD = '2'; // reorder node
const PROPS = '3'; // change props
const TEXT = '4'; // change text node
const REMOVE = '5'

function createPatchType(type, ref) {
  let r = {
    type
  }
  switch (type) {
    case REPLACE:
      r.node = ref;
      break;
    case ADD:
      r.nodes = ref;
      break;
    case PROPS:
      r.props = ref;
      break;
    case TEXT:
      r.content = ref;
      break;
    case REMOVE:
      r.nodes = ref;
      break
  }
  return r;
}

export default function diff(newVNode, oldVNode) {
  let walker = {
    index: 0
  }
  let patches = []
  dfsWalk(newVNode, oldVNode, patches, walker)
  return patches
}

function dfsWalk(newVNode, oldVNode, patches, walker) {
  let patch = []
  let index = walker.index
  if (typeof oldVNode === 'string') {
    if (newVNode !== oldVNode) {
      patch.push(createPatchType(TEXT, newVNode))
    }
  } else if (!newVNode && oldVNode) {
    // newVNode is undefined and oldVNode is still alive
    // so remove the oldVNode
    patch.push(createPatchType(REMOVE, oldVNode))
    diffChildren(undefined, oldVNode.children, patches, walker)
  } else if (newVNode.tagName === oldVNode.tagName) {
    newVNode.el = oldVNode.el
    // both new and old is instanceof VNode
    let diffProps = propsDiff(newVNode.props, oldVNode.props)
    if (Object.keys(diffProps).length > 0) {
      patch.push(createPatchType(PROPS, diffProps))
    }
    let newL = newVNode.children.length
    let oldL = oldVNode.children.length
    if (oldL < newL) {
      // when add nodes, need to parentNode add children
      patch.push(createPatchType(ADD, newVNode.children.slice(oldL, newL)))
    }
    diffChildren(newVNode.children, oldVNode.children, patches, walker)
  } else {
    patch.push(createPatchType(REPLACE, newVNode))
  }
  patches[index] = patch
}

function propsDiff(newObj = {}, oldObj = {}) {
  let r = Object.assign({}, newObj, oldObj)
  for (let propName in oldObj) {
    if (!newObj[propName]) {
      r[propName] = null
    }
  }
  return r
}

function diffChildren(newChildren, oldChildren, patches, walker) {
  oldChildren.forEach((oldChild, i) => {
    walker.index++
    dfsWalk(newChildren && newChildren[i], oldChild, patches, walker)
  })
}


export function updateEle(ele, patches) {
  if (!ele) return
  let walker = {index: 0, apply: []}
  eleDfsWalk(ele, patches, walker)
  // console.log(patches.length, walker.index + 1)
  walker.apply.forEach(({node, patch}) => {
    patch.forEach(p => {
      applyPatches(node, p)
    })
  })
}

function eleDfsWalk(node, patches, walker) {
  walker.apply.push({
    node: node,
    patch: patches[walker.index]
  })
  let len = node.childNodes.length
  for (let i = 0; i < len; i++) {
    walker.index++;
    eleDfsWalk(node.childNodes[i], patches, walker)
  }
}

function applyPatches(node, patch) {
  switch (patch.type) {
    case REPLACE:
      node.parentNode.replaceChild(patch.node.render(), node);
      break
    case ADD:
      patch.nodes.forEach(vNode => {
        node.appendChild(vNode.render())
      })
      break
    case PROPS:
      for (let propName in patch.props) {
        node[propName] = patch.props[propName]
      }
      break;
    case TEXT:
      if (patch.content instanceof VNode) {
        node.removeChild(node.childNodes[0])
        node.appendChild(patch.content.render())
      } else {
        node.textContent = patch.content;
      }
      break;
    case REMOVE:
      node.parentNode.removeChild(node)
      break
    default:
      throw new TypeError(`${patch.type} is not supported.`)
  }
}