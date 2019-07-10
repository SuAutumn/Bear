import h from '@/VNode';
import render from "@/render";
import Component from "@/Component";
import './index.scss';


const App = function (props = {}) {
  if (props.name) {
    return (
      <div>
        {props.name}
        <div className="font-size-20 transition-all">{props.age || 25}</div>
        <Time></Time>
        <button onClick={(event) => alert(event.type)}>click me!</button>
      </div>
    )
  } else {
    return (
      <div>
        no
        <div style="color: red;">data</div>
        <Time></Time>
      </div>
    )
  }
}

class Time extends Component {
  constructor() {
    super()
    this.state.time = new Date()
  }
  mounted() {
    this.timer = setInterval(() => {
      this.setState({
        time: new Date()
      })
    })
  }

  render(props, state) {
    return (
      <div>{state.time.toLocaleString()}</div>
    )
  }
}

const data = {
  "name": null,
}
let root = render(<App {...data} />)
setTimeout(function () {
  data.name = 'little sheep'
  render(<App {...data} />, root)
}, 2000)
