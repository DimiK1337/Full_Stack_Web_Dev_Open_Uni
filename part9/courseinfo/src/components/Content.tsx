import type { CoursePart } from '../types';

// Components
import Part from './Part';

interface ContentProps {
  courseParts: CoursePart[];
};

const Content = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map((part, idx) => <>
        {idx === 0 && <hr/>}
        <Part part={part} />
        {idx <= courseParts.length - 1 && <hr />}
      </>)}
    </>
  );
};

export default Content;