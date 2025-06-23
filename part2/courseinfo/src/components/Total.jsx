const Total = (props) => {

    // Dynamically calculate the total number of exercises from the parts prop
    const numberOfExercises = props.parts.map(part => Number(part.exercises)); // Create an array of numbers for the exercises in each part
    const totalExercises = numberOfExercises.reduce((partialSum, a) => partialSum + a, 0); // Sum up the numbers in the array
    
    return (
        <p>Number of exercises {totalExercises}</p>
    );
};

export default Total;