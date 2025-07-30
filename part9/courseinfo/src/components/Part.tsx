import type { CoursePart } from "../types";

interface PartProps {
  part: CoursePart
}

const Part = ({ part }: PartProps) => {
  const assertNever = (value: never): never => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`)
  }

  const renderPart = () => {
    switch (part.kind) {
      case 'basic':
        return <div>
          <p>{part.name} {part.exerciseCount}</p>
          <i>{part.description}</i>
        </div>

      case 'background':
        return <div>
          <p>{part.name} {part.exerciseCount}</p>
          <i>{part.description}</i>
        </div>

      case 'group':
        return <div>
          <p>{part.name} {part.exerciseCount}</p>
          <p>Project Exercises: {part.groupProjectCount}</p>
        </div>

      case 'special':
        return <div>
          <p>{part.name} {part.exerciseCount}</p>
          <i>{part.description}</i>
          <p>Required skills: {part.requirements.join(', ')}</p>
        </div>

      default:
        return assertNever(part)
    }
  };

  return renderPart();
};

export default Part;