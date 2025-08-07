import { z } from 'zod';
import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import { Entry, NewPatient, NonSensitivePatient, Patient } from '../types';
import { newPatientSchema } from '../utils';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  return res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (!patient) return res.status(404).send({ error: 'patient not found' });
  return res.json(patient);
});

const parseNewPatient = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body);
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

router.post('/', parseNewPatient, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const patient = patientService.addPatient(req.body);
  res.json(patient);
});

router.post('/:id/entries', (req: Request<{ id: string }, unknown, Entry>, res: Response<Entry | { error: string }>) => {
  const entry = patientService.addPatientEntry(req.params.id, req.body);
  if (!entry) return res.status(500).send({ error: 'Failed to save entry' });
  return res.json(entry);
});

router.use(errorMiddleware);

export default router;