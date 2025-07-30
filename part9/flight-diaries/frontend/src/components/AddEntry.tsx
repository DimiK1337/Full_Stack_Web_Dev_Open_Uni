
import { useState } from 'react';

import { createDiaryEntry } from '../services/diaryService';
import type { NonSensitiveDiaryEntry } from '../types';
import Notification from './Notification';
import axios from 'axios';


interface AddEntryProps {
  setDiaryEntries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryEntry[]>>;
};

const AddEntry = ({ setDiaryEntries }: AddEntryProps) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');

  const weatherTypes = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];
  const visibilityTypes = ['great', 'good', 'ok', 'poor'];


  const submitEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newEntry = {
      date,
      weather,
      visibility,
      comment
    };

    try {
      const res = await createDiaryEntry(newEntry);
      setDiaryEntries(prevState => [...prevState, res])
    }
    catch (e: unknown) {      
      if (axios.isAxiosError(e) && e.response?.data) {
        setErrorMessage(`Error: ${e.response.data.error[0].message}`)
      }
      else {
        setErrorMessage(`Unknown Error`)
      }
    }
    
  };


  return (
    <div>
      <h1>Add entry</h1>
      {errorMessage && <Notification message={errorMessage} />}
      <form onSubmit={submitEntry}>
        <p>
          Date: <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </p>

        <div>
          Weather:
          {weatherTypes.map(t => <>
            <input
              type="radio"
              name="weather"
              id={t}
              value={t}
              onChange={() => setWeather(t)}
            />
            <label htmlFor={t}>{t}</label>
          </>)}
        </div>
        <div>
          Visibility:
          {visibilityTypes.map(t => <>
            <input
              type="radio"
              name="visibility"
              id={t}
              value={t}
              onChange={() => setVisibility(t)}
            />
            <label htmlFor={t}>{t}</label>
          </>)}
        </div>
        <p>
          Comment: <input value={comment} onChange={({ target }) => setComment(target.value)} />
        </p>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default AddEntry;