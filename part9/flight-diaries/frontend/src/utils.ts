import type { NewDiaryEntry } from './types'
import { Visibility, Weather } from './types';
import { z } from 'zod';


// A type guard is added "s is string" means that when the func returns true, TS knowns it can treat param 's' as a string
//const isString = (s: unknown): s is string => typeof s === 'string' || s instanceof String;

/* const parseComment = (comment: unknown) => {
  if (!comment || !isString(comment)) throw new Error('Incorrect or missing comment');
  return comment;
};

const isDate = (date: string): boolean => Boolean(Date.parse(date));
const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) throw new Error(`Incorrect or missing date: ${date}`);
  return date;
};

const isWeather = (param: string): param is Weather => Object.values(Weather).map(v => v.toString()).includes(param);
const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isString(weather) || !isWeather(weather)) throw new Error(`Incorrect or missing weather: ${weather}`);
  return weather;
};

const isVisibility = (param: string): param is Visibility => Object.values(Visibility).map(v => v.toString()).includes(param);
const parseVisibility = (visibility: unknown): Visibility => {
  if (!visibility || !isString(visibility) || !isVisibility(visibility)) throw new Error(`Incorrect or missing visibility: ${visibility}`);
  return visibility;
}; */

export const newEntrySchema = z.object({
  weather: z.enum(Weather),
  visibility: z.enum(Visibility),
  date: z.string().date(),
  comment: z.string().optional()
});

export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  return newEntrySchema.parse(object);
};