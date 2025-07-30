import type { NonSensitiveDiaryEntry } from '../types';
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/diaries';

const getAllDiaryEntries = async () => {
  const res = await axios.get<NonSensitiveDiaryEntry[]>(BASE_URL)
  return res.data
}


export {
  getAllDiaryEntries
}