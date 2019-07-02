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

const REPLACE = 0; // replace node
const REORDER = 1; // reorder node
const PROPS = 2; // change props
const TEXT = 3; // change text node

function createPatchType(type, ref) {
  let r = {
    type
  }
  switch (type) {
    case REPLACE:
    case REORDER:
      r.node = ref;
      break;
    case PROPS:
      r.props = ref;
      break;
    case TEXT:
      r.content = ref;
      break;
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
  if (typeof newVNode === 'string' || newVNode === undefined) {
    if (newVNode !== oldVNode) {
      patch.push(createPatchType(TEXT, newVNode))
    }
  } else if (newVNode.tagName === oldVNode.tagName) {
    // instanceof VNode
    if (newVNode.props) {
      let diffProps = propsDiff(newVNode.props, oldVNode.props)
      if (Object.keys(diffProps).length > 0) {
        patch.push(createPatchType(PROPS, diffProps))
      }
    }
    diffChildren(newVNode.children, oldVNode.children, patches, walker)
  } else {
    patch.push(createPatchType(REPLACE, newVNode))
  }
  patches[index] = patch
}

function propsDiff(newObj = {}, oldObj = {}) {
  let r = {}
  for (let propName in newObj) {
    if (newObj[propName] !== oldObj[propName]) {
      r[propName] = newObj[propName]
    }
  }
  return r
}

function diffChildren(newChildren, oldChildren, patches, walker) {
  oldChildren.forEach((oldChild, i) => {
    walker.index++
    dfsWalk(newChildren[i], oldChild, patches, walker)
  })
}


export function updateEle(ele, patches) {
  let walker = { index: 0 }
  eleDfsWalk(ele, patches, walker)
}

function eleDfsWalk(node, patches, walker) {
  let len = node.childNodes.length
  let patch = patches[walker.index]
  for (let i = 0; i < len; i++) {
    walker.index++;
    eleDfsWalk(node.childNodes[i], patches, walker)
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
    case PROPS:
      for (let propName in patch.props) {
        if (propName === 'style') {
          patch.props[propName] = css(patch.props[propName])
        }
        node[propName] = patch.props[propName]
      }
      break;
    case TEXT:
      node.textContent = patch.content;
      break;
    default:
      throw new TypeError(`${patch.type} is not supported.`)
  }
}
