import Header from "./components/Header"
import Content from "./components/Content"
import Total from "./components/Total"

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  // Zipping the parts and exercises together to create a single prop
  const zippedParts = [
    { part: part1, exercises: exercises1 },
    { part: part2, exercises: exercises2 },
    { part: part3, exercises: exercises3 }
  ];

  return (
    <div>
      <Header course={course} />
      <Content parts={zippedParts} />
      <Total parts={zippedParts} />
    </div>
  )
}

export default App