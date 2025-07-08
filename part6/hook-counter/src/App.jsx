import { useContext } from "react"
import { useCounterValue, useCounterDispatch} from "./CounterContext"


const Display = () => {
  const counter = useCounterValue()
  return <div>{counter}</div>
}

const Button = ({ type, label }) => {
  const dispatch = useCounterDispatch()
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

const App = () => {
  return (
    <div>
      <Display/>
      <div>
        <Button type='INC' label='+' />
        <Button type='ZERO' label='0' />
        <Button type='DEC' label='-' />
      </div>
    </div>
  )
}

export default App