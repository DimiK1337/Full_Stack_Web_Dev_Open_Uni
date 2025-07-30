
type CoursePart = {
  name: string;
  exerciseCount: number;
};

interface ContentProps {
  courseParts: CoursePart[];
};

const Content = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map(part => <p>{part.name} {part.exerciseCount}</p>)}
    </>
  );
};

export default Content;