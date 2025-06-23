import Part from "./Part";

const Content = (props) => {
    console.log("Content component rendered with props:", props);

    const pTags = [];
    props.parts.forEach((part, index) => {
        pTags.push(<Part key={index} name={part.name} exercises={part.exercises} />);
    });
    return (
        <div>
            {pTags}
        </div>
    );
};

export default Content;