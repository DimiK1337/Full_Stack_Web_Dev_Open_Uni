import express from 'express';
import cors, { CorsOptions } from 'cors';

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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
