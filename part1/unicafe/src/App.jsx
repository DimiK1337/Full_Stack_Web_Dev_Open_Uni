import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  );
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
}

const Statistics = ({ good, neutral, bad }) => {

  // Good is worth 1, Neutral is worth 0 (exclude from avg), Bad is worth -1
  // Formula: (good + 0*neutral + (-1)*bad) / (good + neutral + bad)
  const calcAverage = () => (good + -1 * bad) / (good + neutral + bad)

  const calcPositiveFeedback = () => (good / (good + neutral + bad)) * 100;

  if (!(good || neutral || bad)) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <table>
        <tbody>
          <StatisticsLine text="Good" value={good} />
          <StatisticsLine text="Neutral" value={neutral} />
          <StatisticsLine text="Bad" value={bad} />
          <StatisticsLine text="All" value={good + neutral + bad} />
          <StatisticsLine text="Average" value={calcAverage()} />
          <StatisticsLine text="Positive %" value={calcPositiveFeedback()} />
        </tbody>
      </table>
    </div>
  );
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button text="good" onClick={handleGoodClick} />
      <Button text="neutral" onClick={handleNeutralClick} />
      <Button text="bad" onClick={handleBadClick} />

      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App