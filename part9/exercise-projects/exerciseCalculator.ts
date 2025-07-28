type Rating = 1 | 2 | 3

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (weekly_hours: number[], target: number): Result => {
  const average =  weekly_hours.reduce((acc, cur) => acc + cur, 0) / weekly_hours.length;

  let rating: Rating = 1;
  let ratingDescription: string = "You need to work much harder!";

  if (average >= target) {
    rating = 3
    ratingDescription = "Great job! Target met!";
  }
  else if (average >= target * 0.75) {
    rating = 2
    ratingDescription = "Not too bad but could be better";
  }

  return {
    periodLength: weekly_hours.length,
    trainingDays: weekly_hours.filter(h => h !== 0).length,
    target,
    average,
    success: average >= target,
    rating,
    ratingDescription
  }
}


const res = calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2);
console.log('res', res);
