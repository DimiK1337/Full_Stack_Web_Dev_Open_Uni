import express from 'express';
import cors, { CorsOptions } from 'cors';

import diaryRouter from './routes/diaries';

const app = express();
app.use(express.json());

const corsOptions: CorsOptions = {
  origin: 'http://localhost:5173'
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors(corsOptions));

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/diaries', diaryRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
