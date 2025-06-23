import Header from "./Header"
import Content from "./Content"

const Course = (props) => {
  const {name, parts} = props.course
  return (
    <div>
      <Header course={name} />
      <Content parts={parts} />
    </div>
  );

}

export default Course;