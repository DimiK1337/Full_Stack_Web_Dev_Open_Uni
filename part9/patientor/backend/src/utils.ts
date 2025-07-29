import { 
  NewPatient,
  Gender
} from "./types";

const isString = (s: unknown): s is string => typeof s === 'string' || s instanceof String;
const parseName = (name: unknown) => {
  if (!name || !isString(name)) throw new Error('Incorrect or missing name');
  return name;
};

const isDate = (date: string): boolean => Boolean(Date.parse(date));
const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) throw new Error(`Incorrect or missing date: ${date}`);
  return date;
};

const parseSSN = (ssn: unknown) => {
  if (!ssn || !isString(ssn)) throw new Error(`Incorrect or missing ssn: ${ssn}`);
  return ssn;
};

const isGender = (param: string): param is Gender => Object.values(Gender).map(v => v.toString()).includes(param);
const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) throw new Error(`Incorrect or missing gender: ${gender}`);
  return gender;
};

const parseOccupation = (occupation: unknown) => {
  if (!occupation || !isString(occupation)) throw new Error(`Incorrect or missing occupation: ${occupation}`);
  return occupation;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') throw new Error('Incorrect or missing data');
  if (
    'name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation)
    };
    return newPatient;
  }
  throw new Error('Incorrect data: some fields are missing');
};