
const Part = (props) => {
    console.log("Part component rendered with props:", props);
    return (
        <p>{props.name} {props.exercises}</p>
    );
};

export default Part;