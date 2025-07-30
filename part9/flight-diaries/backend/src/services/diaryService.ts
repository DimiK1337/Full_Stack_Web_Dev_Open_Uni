import diaries from '../../data/entries';

import { 
  DiaryEntry, 
  NewDiaryEntry, 
  NonSensitiveDiaryEntry
} from '../types';

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const findById = (id: number): DiaryEntry | undefined => {
  return diaries.find(d => d.id === id);
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility
  }));
};

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
  const newEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry
  };

  diaries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  findById,
  getNonSensitiveEntries,
  addDiary
};

