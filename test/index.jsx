import h from '@/VNode';
import render from "@/render";


const App = function (props = {}) {
  if (props.name) {
    return (
      <div>
        {props.name}
        <div>{props.age || 25}</div>
      </div>
    )
  } else {
    return (
      <div>
        no
        <div style="color: red;">data</div>
      </div>
    )
  }
}
// 修改数据
const data = {
  "name": null,
}
let root = render(<App {...data} />)
setTimeout(function () {
  data.name = 'little sheep'
  render(<App {...data} />, root)
}, 2000)
