import express from 'express';

import { calculator, Operation } from './calculator';

const app = express();

app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { a, b, op } = req.body;

  if (!a || isNaN(Number(a)))  return res.status(400).send({ error: 'a needs to be a number'});
  if (!b || isNaN(Number(b)))  return res.status(400).send({ error: 'b needs to be a number'});


  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(
    Number(a), Number(b), op as Operation
  );
  res.send({ result });
});

const PORT=3000;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});