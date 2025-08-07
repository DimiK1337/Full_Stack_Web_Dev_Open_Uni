import { z } from 'zod';

import { Gender, HealthCheckRating } from './types';
import type {
  NewPatient,
  EntryWithoutId
} from './types';

/* Entry schemas */
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

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
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
  occupationalHealthcareEntrySchema
]);

// Entries without an id schemas
const healthCheckEntryWithoutIdSchema = healthCheckEntrySchema.omit({ id: true });
const hospitalEntryWithoutIdSchema = hospitalEntrySchema.omit({ id: true });
const occupationalHealthcareEntryWithoutIdSchema = occupationalHealthcareEntrySchema.omit({ id: true });

const entryWithoutIdSchema = z.discriminatedUnion(discriminatorKey, [
  healthCheckEntryWithoutIdSchema,
  hospitalEntryWithoutIdSchema,
  occupationalHealthcareEntryWithoutIdSchema
]);


// Patient schema
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

export const toNewEntry = (object: unknown): EntryWithoutId => {
  return entryWithoutIdSchema.parse(object);
};