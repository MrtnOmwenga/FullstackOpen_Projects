import { useState } from 'react'

//Components
const Button = ({text, onClick}) => <button onClick={onClick}>{text}</button>
const Poll = ({votes}) => <p>Has {votes} votes.</p>

//App
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  // States
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([
    {number: 0, votes:0},
    {number: 1, votes:1},
    {number: 2, votes:2},
    {number: 3, votes:3},
    {number: 4, votes:4},
    {number: 5, votes:0},
    {number: 6, votes:0},
    {number: 7, votes:0}
  ])

  // Change anecdote in random fashion
  const handleClick = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  // Vote for an anecdote
  const vote = () => {
    const copy = [...votes]
    copy[selected].votes += 1
    setVotes(copy)
  }

  //Find the best anecdote
  const Best = votes.reduce((prev, curr) => {
    return (prev.votes > curr.votes) ? prev : curr
  })

  return (
    <div>
      <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}
        <Poll votes={votes[selected].votes}/>
        <div>
          <Button text="Vote" onClick={vote}/>
          <Button text="Next Anecdote" onClick={handleClick}/>
        </div>
      </div>
      <div>
        <h1>Anecdote with most votes</h1>
        {console.log("App works till here")}
        {anecdotes[Best.number]}
      </div>
    </div>
  )
}

export default App