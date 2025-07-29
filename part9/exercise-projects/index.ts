import express from 'express';

import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    return res.json({ error: 'malformatted query parameters'});
  }

  return res.json({
    weight,
    height,
    bmi: calculateBmi(height, weight)
  });
});

app.post('/exercise', (req, res) => {
  console.log("req.body", req.body);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  
  //const invalidParams = isNaN(Number(target)) || (daily_exercises instanceof Array && !daily_exercises.some((el: unknown) => isNaN(Number(el))));
  //if (invalidParams) return res.status(400).send({ error: "malformatted parameters" });
  console.log('daily_exer from req.body', daily_exercises, "is this an array of number?", !daily_exercises.some((el: unknown) => isNaN(Number(el))) );
  
  if (
    isNaN(Number(target)) || 
    !Array.isArray(daily_exercises) || 
    daily_exercises.some((el: unknown) => isNaN(Number(el)))
  ) return res.status(400).send({ error: "malformatted parameters" });
  
  const result = calculateExercises(daily_exercises as number[], Number(target));
  return res.send({ result });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});