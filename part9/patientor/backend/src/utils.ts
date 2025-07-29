import { z } from 'zod';
import {
  NewPatient,
  Gender
} from "./types";

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string()
});

export const toNewPatient = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object);
};