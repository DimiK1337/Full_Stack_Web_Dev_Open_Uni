import { isNotNumber } from "./utils";

type Rating = 1 | 2 | 3;

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

interface CalculateExerciseValues {
  weekly_hours: number[];
  target: number;
}


const parseArgs = (args: string[]): CalculateExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.slice(2).some(a => isNotNumber(a))) throw new Error('malformatted parameters');
  return {
    target: Number(args[2]),
    weekly_hours: args.slice(3).map(Number)
  };
};


const calculateExercises = (weekly_hours: number[], target: number): Result => {
  const average = weekly_hours.reduce((acc, cur) => acc + cur, 0) / weekly_hours.length;

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
    periodLength: weekly_hours.length,
    trainingDays: weekly_hours.filter(h => h !== 0).length,
    target,
    average,
    rating,
    ratingDescription
  };
};


try {
  const { weekly_hours, target } = parseArgs(process.argv);
  const res = calculateExercises(weekly_hours, target);
  console.log(res);
}
catch (error: unknown) {
  let errorMessage = 'Something bad happened: ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
