import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  );
}

const Display = ({good, neutral, bad}) => {

  // Good is worth 1, Neutral is worth 0 (exclude from avg), Bad is worth -1
    // Formula: (good + 0*neutral + (-1)*bad) / (good + neutral + bad)
  const calcAverage = () => (good + -1*bad)/(good + neutral + bad)

  const calcPositiveFeedback = () => (good/(good + neutral + bad)) * 100; 

  return (
    <div>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All: {good + neutral + bad}</p>
      <p>Average: {calcAverage()}</p>
      <p>Positive Feedback %: {calcPositiveFeedback()}</p>

    </div>
  );
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    console.log("good before", good)
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    console.log("good before", neutral)
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    console.log("good before", bad)
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button text="good" onClick={handleGoodClick}/>
      <Button text="neutral" onClick={handleNeutralClick}/>
      <Button text="bad" onClick={handleBadClick}/>

      <h2>Statistics</h2>
      <Display good={good} neutral={neutral} bad={bad}/>

    </div>
  )
}

export default App