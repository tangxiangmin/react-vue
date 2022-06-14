import {h} from "@shymean/react-vue";

type DemoProps = {
  count: number
}

function Demo(props: DemoProps) {
  return () => {
    return <div className={'demo'}> this is demo {props.count}</div>
  }
}

<Demo count={1}/>
