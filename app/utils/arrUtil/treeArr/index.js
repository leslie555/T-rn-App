const defaultProps = {
  children: 'children',
  value: 'value',
  label: 'label'
}

//  根据节点中的某个值获取节点对象和路径
export function getTreeNodeByValue(data, value, props = {}) {
  props = Object.assign(defaultProps, props)
  const output = {
    data: {},
    pathArr: [],
    pathNameArr: []
  }
  const fn = (data, value, props) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item[props.value] !== value && item[props.children]) {
        const result = fn(item[props.children], value, props)
        if (result) {
          output.pathArr.unshift(item[props.value])
          output.pathNameArr.unshift(item[props.label])
          return result
        }
      } else if (item[props.value] === value) {
        output.pathArr.push(item[props.value])
        output.pathNameArr.push(item[props.label])
        return item
      }
    }
  }
  output.data = fn(data, value, props)
  return output
}

export function findNodeByArr(tree, arr, cb, props = {}) {
  props = Object.assign(defaultProps, props)
  let children = tree
  let node
  arr.forEach(val => {
    node = children.find(v => {
      return v[props.value] === +val
    })
    if (node) {
      if (cb) {
        cb(node)
      }
      children = node.children
    } else {
      return -1
    }
  })
  return node
}
