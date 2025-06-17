const Hello = (props) => {
  console.log(props);
  return (
    <div>
      <p>Hello {props.name}</p>
    </div>
  )
}

const Footer = () => {
  return (
    <div>
      greeting app created by <a href='https://github.com/mluukkai'>mluukkai</a>
    </div>
  )
}

const App = () => {
  const age = 10 + 2;
  return (
    <>
      <h1>Greetings</h1>
      <Hello name="CHAD—san" age={age}/>
      <Footer />
    </>
  )
}


export default App;