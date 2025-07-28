import { isNotNumber } from "./utils"

interface CalculateBMIValues {
  height: number,
  weight: number
}

const parseArgs = (args: string[]): CalculateBMIValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
  if (isNotNumber(args[2]) || isNotNumber(args[3])) throw new Error('Provided values were not numbers')
  return { height: Number(args[2]), weight: Number(args[3]) }
}

/**
 * 
 * @param height - height in centimeters
 * @param weight - weight in kg
 * @returns A string with the BMI category
 */
const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100
  const bmi = (weight) / (heightInMeters * heightInMeters)
  console.log('bmi=', bmi)

  if (bmi < 16) return "Underweight (Severe thinness)";
  else if (bmi < 17) return "Underweight (Moderate thinness)";
  else if (bmi < 18.5) return "Underweight (Mild thinness)";
  else if (bmi < 25) return "Normal range";
  else if (bmi < 30) return "Overweight (Pre-obese)";
  else if (bmi < 35) return "Obese (Class I)";
  else if (bmi < 40) return "Obese (Class II)";
  return "Obese (Class III)";
}


if (require.main === module) {
  // this file/module was run from the CLI as in node xxx.ts
  try {
    const { height, weight } = parseArgs(process.argv)
    const res = calculateBmi(height, weight)
    console.log(res)
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened. '
    if (error instanceof Error) {
      errorMessage += error.message
    }
    console.log(errorMessage)
  }

}

export default calculateBmi