import { z } from 'zod';
import express, { Request, Response, NextFunction } from 'express';
import diaryService from '../services/diaryService';
import { NonSensitiveDiaryEntry, DiaryEntry, NewDiaryEntry } from '../types';

import { newEntrySchema } from '../utils';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));
  if (!diary) return res.sendStatus(404);
  return res.send(diary);
});


const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newEntrySchema.parse(req.body);
    next();
  }
  catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) res.status(400).send({ error: error.issues });
  else next(error);
};

router.post('/', newDiaryParser, (req: Request<unknown, unknown, NewDiaryEntry>, res: Response<DiaryEntry>) => {
  const addedEntry = diaryService.addDiary(req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;

