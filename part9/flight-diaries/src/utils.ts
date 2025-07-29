import { NewDiaryEntry, Visibility, Weather } from './types';


// A type guard is added "s is string" means that when the func returns true, TS knowns it can treat param 's' as a string
const isString = (s: unknown): s is string => typeof s === 'string' || s instanceof String;

const parseComment = (comment: unknown) => {
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
};

export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if (!object || typeof object !== 'object') throw new Error('Incorrect or missing data');

  if ('comment' in object && 'date' in object && 'weather' in object && 'visibility' in object) {
    const newEntry: NewDiaryEntry = {
      comment: parseComment(object.comment),
      date: parseDate(object.date),
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility)
    };
    return newEntry;
  }
  throw new Error('Incorrect data: some fields are missing');
};