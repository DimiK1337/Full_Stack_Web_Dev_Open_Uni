import React from "react"
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  // Executed the first time the component is rendered
  componentDidMount = () => {
    const url = 'http://localhost:3001/anecdotes'
    axios
      .get(url)
      .then(res => {

        // Calling this.setState will always trigger the render method
        this.setState({ anecdotes: res.data })
      })
  }

  handleClick = () => {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }

  render() {
    if (this.state.anecdotes.length === 0) {
      return <div>no anecdotes...</div>
    }
    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>
          {this.state.anecdotes[this.state.current].content}
        </div>
        <button onClick={this.handleClick}>next</button>
      </div>
    )
  }
}

export default App