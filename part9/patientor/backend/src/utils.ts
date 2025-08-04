import { z } from 'zod';
import {
  NewPatient,
  Gender,
  HealthCheckRating
} from './types';

const baseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional()
});

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.enum(HealthCheckRating)
});

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string(),
    criteria: z.string()
  })
});

const OccupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string(),
    endDate: z.string()
  }).optional()
});

const discriminatorKey = 'type';
const entrySchema = z.discriminatedUnion(discriminatorKey, [
  healthCheckEntrySchema,
  hospitalEntrySchema,
  OccupationalHealthcareEntrySchema
]);

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
  entries: z.array(entrySchema)
});

export const toNewPatient = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object);
};