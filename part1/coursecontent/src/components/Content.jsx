const Content = (props) => {
    const pTags = [];
    props.parts.forEach((part) => {
        pTags.push(<p>{part.part} {part.exercises}</p>);
    });
    return (
        pTags
    );
};

export default Content;