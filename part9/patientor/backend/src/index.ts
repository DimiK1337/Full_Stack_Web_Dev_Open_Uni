import express from 'express';
import cors, { CorsOptions } from 'cors';

import diagnosisRouter from './routes/diagnoses';

const app = express();
app.use(express.json());

const corsOptions: CorsOptions = {
  origin: 'http://localhost:5173'
};

app.use(cors(corsOptions));

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/diagnoses', diagnosisRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
