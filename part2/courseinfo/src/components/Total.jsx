const Total = ({parts}) => {
    
    // Sum up the numbers in the array using reduce
    const totalExercises = parts.reduce((acc, part) => part.exercises + acc, 0);
    
    return (
        <b>Number of exercises {totalExercises}</b>
    );
};

export default Total;