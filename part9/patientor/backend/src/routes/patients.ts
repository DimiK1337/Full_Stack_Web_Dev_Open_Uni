import express, { Response } from 'express';
import patientService from '../services/patientService';
import { NonSensitivePatient, Patient } from '../types';
import { toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  return res.send(patientService.getNonSensitivePatients());
});

router.post('/', (req, res: Response<Patient | string>) => {
  try {
    const newPatient = toNewPatient(req.body);
    const patient = patientService.addPatient(newPatient);
    res.json(patient);
  }
  catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;