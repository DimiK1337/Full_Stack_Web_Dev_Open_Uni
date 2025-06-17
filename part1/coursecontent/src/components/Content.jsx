import Part from "./Part";

const Content = (props) => {
    const pTags = [];
    props.parts.forEach((part, index) => {
        pTags.push(<Part key={index} part={part.part} exercises={part.exercises} />);
    });
    return (
        <div>
            {pTags}
        </div>
    );
};

export default Content;