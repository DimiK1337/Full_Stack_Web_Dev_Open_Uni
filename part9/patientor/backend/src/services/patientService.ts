import type { 
  Patient, 
  NonSensitivePatient, 
  NewPatient,

  EntryWithoutId
} from '../types';
import { v1 as uuid } from 'uuid';
import patients from '../../data/patients';

import { toNewEntry } from '../utils';


const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id, 
    name, 
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const getPatientById = (id: string) => {
  return patients.find(p => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    ...patient,
    id: uuid()
  };
  patients.push(newPatient);
  return newPatient;
};

const addPatientEntry = (id: string, entryObj: EntryWithoutId) => {
  const entry = {
    ...toNewEntry(entryObj),
    id: uuid()
  };

  for (const p of patients) {
    if (p.id === id) {
      p.entries.push(entry);
      console.log('entry pushed', entry);
      break;
    }
  }  
  return entry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  getPatientById,
  addPatient,

  addPatientEntry
};

