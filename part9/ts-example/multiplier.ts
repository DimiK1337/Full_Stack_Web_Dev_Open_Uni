interface MultiplyValues {
  a: number;
  b: number;
}

const parseArgs = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
  if (isNaN(Number(args[2])) || isNaN(Number(args[3]))) throw new Error('Provided values were not numbers')

  return { a: Number(args[2]), b: Number(args[3]) }
}

const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText,  a * b);
}

try {
  const { a, b } = parseArgs(process.argv);
  multiplicator(a, b, `Multiplied ${a} and ${b}, the result is:`);
}
catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}