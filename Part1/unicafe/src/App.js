import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}> {text} </button>
const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}
const Total = ({good, neutral, bad}) => {
  return (
    <tr>
      <td>All:</td>
      <td>{good + neutral + bad}</td>
    </tr>
  )
}
const Average = ({good, neutral, bad}) => {
  return (
    <tr>
      <td>Average:</td>
      <td>{(good + neutral + bad)/3}</td>
    </tr>
  )
}
const Positive = ({good, neutral, bad}) => {
  return (
    <tr>
      <td>Positive:</td>
      <td>{(good/(good + neutral + bad))*100}%</td>
    </tr>
  )
}
const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad;
  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="Good:" value={good}/>
          <StatisticLine text="Neutral:" value={neutral}/>
          <StatisticLine text="Bad:" value={bad}/>
          <Total good={good} neutral={neutral} bad={bad}/>
          <Average good={good} neutral={neutral} bad={bad}/>
          <Positive good={good} neutral={neutral} bad={bad}/>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="Good"/>
      <Button onClick={() => setNeutral(neutral + 1)} text="Neutral"/>
      <Button onClick={() => setBad(bad + 1)} text="Bad"/>

      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App