import h from '@/VNode';
import render from "@/render";
import Component from "@/Component";
import './index.scss';


const App = function (props = {}) {
  const list = props.list.map(item => {
    return <div>{item}</div>
  })
  const btn = props.name && (<button onClick={(event) => alert(event.type)}>click me!</button>)
  return (
    <div>
      {list}
      <Time></Time>
      {btn}
    </div>
  )
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
    }, 1000)
  }

  destroyed () {
    window.clearInterval(this.timer)
  }

  render(props, state) {
    return (
      <div>{state.time.toLocaleString()}</div>
    )
  }
}

const data = {
  name: null,
  list: [1, 2, 3, 4, 5]
}
let root = render(<App {...data} />)
setTimeout(function () {
  data.name = 'little sheep'
  data.list = [4, 5, 6]
  render(<App {...data} />, root)
}, 3000)
