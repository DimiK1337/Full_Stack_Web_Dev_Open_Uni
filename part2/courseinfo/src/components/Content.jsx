import Part from "./Part";

const Content = ({parts}) => {
    const pTags = [];
    parts.forEach((part, index) => {
        pTags.push(<Part key={index} name={part.name} exercises={part.exercises} />);
    });
    return (
        <div>
            {pTags}
        </div>
    );
};

export default Content;