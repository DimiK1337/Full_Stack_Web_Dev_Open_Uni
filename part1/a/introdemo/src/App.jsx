import { useState } from "react";

const App = () => {
  
  const [counter, setCounter] = useState(0);

  /**
   * When setCounter is called, the whole component re-renders, meaning that the counter is increased every second. This behaves like setInterval, where a delay is given to re-execute code. 
   */
  setTimeout(() => {
    setCounter(counter + 1);
  }, 1000);

  return (
    <div>{counter}</div>
  );
}

export default App;