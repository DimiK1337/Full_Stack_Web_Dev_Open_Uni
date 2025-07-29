import { isNotNumber } from "./utils";

type Rating = 1 | 2 | 3;

export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

export interface CalculateExerciseValues {
  daily_exercises: number[];
  target: number;
}

const parseArgs = (args: string[]): CalculateExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.slice(2).some(a => isNotNumber(a))) throw new Error('malformatted parameters');
  return {
    target: Number(args[2]),
    daily_exercises: args.slice(3).map(Number)
  };
};


const calculateExercises = (daily_exercises: number[], target: number): ExerciseResult => {  
  const average = daily_exercises.reduce((acc, cur) => acc + cur, 0) / daily_exercises.length;

  let rating: Rating = 1;
  let ratingDescription: string = "You need to work much harder!";

  if (average >= target) {
    rating = 3;
    ratingDescription = "Great job! Target met!";
  }
  else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  }

  return {
    success: average >= target,
    periodLength: daily_exercises.length,
    trainingDays: daily_exercises.filter(h => h !== 0).length,
    target,
    average,
    rating,
    ratingDescription
  };
};

export default calculateExercises;

if (require.main === module) {
  try {
    const { daily_exercises, target } = parseArgs(process.argv);
    const res = calculateExercises(daily_exercises, target);
    console.log(res);
  }
  catch (error: unknown) {
    let errorMessage = 'Something bad happened: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}
