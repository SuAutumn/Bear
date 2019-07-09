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

let vIndex = 0 // vritual dom walker step
let dIndex = 0 // dom walker step
export default function diff(newVNode, oldVNode) {
  vIndex = 0
  let patches = []
  dfsWalk(newVNode, oldVNode, patches)
  return patches
}

function isStringMaybe(t) {
  return typeof t === 'string' || typeof t ===  'number' || t === null || t === undefined
}

function dfsWalk(newVNode, oldVNode, patches) {
  let patch = []
  let index = vIndex
  if (isStringMaybe(oldVNode) && isStringMaybe(newVNode)) {
    newVNode !== oldVNode && patch.push(createPatchType(TEXT, newVNode))
  } else if (!newVNode && oldVNode) {
    // newVNode is undefined and oldVNode is still alive
    // so remove the oldVNode
    patch.push(createPatchType(REMOVE, oldVNode))
    diffChildren(undefined, oldVNode.children, patches)
  } else if (newVNode.tagName === oldVNode.tagName) {
    newVNode.el = oldVNode.el // add el dom
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
    diffChildren(newVNode.children, oldVNode.children, patches)
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

function diffChildren(newChildren, oldChildren, patches) {
  oldChildren.forEach((oldChild, i) => {
    vIndex++
    dfsWalk(newChildren && newChildren[i], oldChild, patches)
  })
}


export function updateEle(ele, patches) {
  dIndex = 0
  if (!ele) return
  eleDfsWalk(ele, patches)
}

function eleDfsWalk(node, patches) {
  let patch = patches[dIndex]
  // if this node is not replace type
  // walk deep, otherwise run patch directly
  if (patch.every(p => {
    return p.type !== REPLACE
  })) {
    let len = node.childNodes.length
    for (let i = 0; i < len; i++) {
      dIndex++;
      eleDfsWalk(node.childNodes[i], patches)
    }
  }
  if (patch.length > 0) {
    patch.forEach(p => {
      applyPatches(node, p)
    })
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
      node.textContent = patch.content;
      break;
    case REMOVE:
      node.parentNode.removeChild(node)
      break
    default:
      throw new TypeError(`${patch.type} is not supported.`)
  }
}
